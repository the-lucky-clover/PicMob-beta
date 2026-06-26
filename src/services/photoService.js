/**
 * Photo service for managing photo uploads and metadata
 */

export class PhotoService {
  constructor(env) {
    this.env = env;
    this.db = env.DB;
    this.bucket = env.IMAGES;
  }

  async uploadPhoto(userId, file, caption = '', tags = []) {
    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
    }

    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 10MB.');
    }

    // Generate unique filename
    const photoId = crypto.randomUUID();
    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = `photos/${userId}/${photoId}.${extension}`;
    const thumbnailName = `thumbnails/${userId}/${photoId}.webp`;

    try {
      // Upload original image to R2
      await this.bucket.put(fileName, file.stream(), {
        httpMetadata: {
          contentType: file.type,
        },
        customMetadata: {
          userId,
          originalName: file.name,
          uploadedAt: new Date().toISOString()
        }
      });

      // Create thumbnail (simplified - in production, you'd want proper image processing)
      const thumbnailBuffer = await this.createThumbnail(await file.arrayBuffer(), file.type);
      await this.bucket.put(thumbnailName, thumbnailBuffer, {
        httpMetadata: {
          contentType: 'image/webp',
        }
      });

      // Save metadata to database
      const photoData = await this.db.prepare(`
        INSERT INTO photos (
          id, user_id, filename, thumbnail_filename, original_filename,
          file_size, mime_type, caption, width, height, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        photoId,
        userId,
        fileName,
        thumbnailName,
        file.name,
        file.size,
        file.type,
        caption,
        null, // width - would be extracted from image processing
        null, // height - would be extracted from image processing
        new Date().toISOString(),
        new Date().toISOString()
      ).run();

      // Add tags if provided
      if (tags.length > 0) {
        await this.addTagsToPhoto(photoId, tags);
      }

      return {
        id: photoId,
        filename: fileName,
        thumbnailFilename: thumbnailName,
        caption,
        tags,
        createdAt: new Date().toISOString()
      };

    } catch (error) {
      // Cleanup on failure
      try {
        await this.bucket.delete(fileName);
        await this.bucket.delete(thumbnailName);
      } catch (cleanupError) {
        console.error('Cleanup failed:', cleanupError);
      }
      throw error;
    }
  }

  async createThumbnail(imageBuffer, mimeType) {
    // Simplified thumbnail creation
    // In production, use a proper image processing library or service
    // For now, just return the original (Cloudflare Images service would be better)
    return imageBuffer;
  }

  async getUserPhotos(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const photos = await this.db.prepare(`
      SELECT 
        p.id, p.filename, p.thumbnail_filename, p.caption, p.created_at,
        p.width, p.height, p.file_size,
        (SELECT COUNT(*) FROM photo_likes WHERE photo_id = p.id) as like_count,
        (SELECT COUNT(*) FROM photo_comments WHERE photo_id = p.id) as comment_count,
        u.username, u.display_name, u.profile_picture
      FROM photos p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ? AND p.deleted_at IS NULL
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(userId, limit, offset).all();

    // Add tags and signed URLs
    const photosWithDetails = await Promise.all(
      (photos.results || []).map(async (photo) => ({
        ...photo,
        imageUrl: await this.getSignedUrl(photo.filename),
        thumbnailUrl: await this.getSignedUrl(photo.thumbnail_filename),
        tags: await this.getPhotoTags(photo.id)
      }))
    );

    return photosWithDetails;
  }

  async getPhoto(photoId) {
    const photo = await this.db.prepare(`
      SELECT 
        p.*, u.username, u.display_name, u.profile_picture,
        (SELECT COUNT(*) FROM photo_likes WHERE photo_id = p.id) as like_count,
        (SELECT COUNT(*) FROM photo_comments WHERE photo_id = p.id) as comment_count
      FROM photos p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ? AND p.deleted_at IS NULL
    `).bind(photoId).first();

    if (!photo) return null;

    return {
      ...photo,
      imageUrl: await this.getSignedUrl(photo.filename),
      thumbnailUrl: await this.getSignedUrl(photo.thumbnail_filename),
      tags: await this.getPhotoTags(photoId)
    };
  }

  async likePhoto(userId, photoId) {
    try {
      await this.db.prepare(`
        INSERT INTO photo_likes (user_id, photo_id, created_at)
        VALUES (?, ?, ?)
      `).bind(userId, photoId, new Date().toISOString()).run();
    } catch (error) {
      // Ignore duplicate key errors (user already liked)
      if (!error.message.includes('UNIQUE constraint failed')) {
        throw error;
      }
    }
  }

  async unlikePhoto(userId, photoId) {
    await this.db.prepare(`
      DELETE FROM photo_likes 
      WHERE user_id = ? AND photo_id = ?
    `).bind(userId, photoId).run();
  }

  async addTagsToPhoto(photoId, tags) {
    for (const tag of tags) {
      try {
        await this.db.prepare(`
          INSERT INTO photo_tags (photo_id, tag, created_at)
          VALUES (?, ?, ?)
        `).bind(photoId, tag.toLowerCase().trim(), new Date().toISOString()).run();
      } catch (error) {
        // Ignore duplicate tags
        if (!error.message.includes('UNIQUE constraint failed')) {
          throw error;
        }
      }
    }
  }

  async getPhotoTags(photoId) {
    const tags = await this.db.prepare(`
      SELECT tag FROM photo_tags WHERE photo_id = ?
    `).bind(photoId).all();

    return (tags.results || []).map(row => row.tag);
  }

  async getSignedUrl(filename) {
    // For Cloudflare R2, you would generate a signed URL here
    // For now, return a placeholder URL structure
    return `https://your-r2-domain.com/${filename}`;
  }

  async deletePhoto(userId, photoId) {
    // Soft delete
    const result = await this.db.prepare(`
      UPDATE photos 
      SET deleted_at = ?, updated_at = ?
      WHERE id = ? AND user_id = ? AND deleted_at IS NULL
    `).bind(
      new Date().toISOString(),
      new Date().toISOString(),
      photoId,
      userId
    ).run();

    return result.changes > 0;
  }
}