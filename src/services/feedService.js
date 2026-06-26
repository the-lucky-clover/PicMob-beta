/**
 * Feed service for managing user feeds and discovery
 */

export class FeedService {
  constructor(env) {
    this.env = env;
    this.db = env.DB;
  }

  async getUserFeed(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const photos = await this.db.prepare(`
      SELECT 
        p.id, p.filename, p.thumbnail_filename, p.caption, p.created_at,
        p.width, p.height, p.file_size,
        u.username, u.display_name, u.profile_picture,
        (SELECT COUNT(*) FROM photo_likes WHERE photo_id = p.id) as like_count,
        (SELECT COUNT(*) FROM photo_comments WHERE photo_id = p.id) as comment_count
      FROM photos p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ? AND p.deleted_at IS NULL
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(userId, limit, offset).all();

    return this.enrichPhotosWithMetadata(photos.results || []);
  }

  async getMainFeed(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    // Get photos from users the current user follows, plus popular content
    const photos = await this.db.prepare(`
      SELECT 
        p.id, p.filename, p.thumbnail_filename, p.caption, p.created_at,
        p.width, p.height, p.file_size,
        u.username, u.display_name, u.profile_picture,
        (SELECT COUNT(*) FROM photo_likes WHERE photo_id = p.id) as like_count,
        (SELECT COUNT(*) FROM photo_comments WHERE photo_id = p.id) as comment_count,
        CASE 
          WHEN f.follower_id IS NOT NULL THEN 1 
          ELSE 0 
        END as is_following
      FROM photos p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN follows f ON f.following_id = p.user_id AND f.follower_id = ?
      WHERE 
        p.deleted_at IS NULL AND
        (
          f.follower_id IS NOT NULL OR  -- Following
          p.created_at > datetime('now', '-7 days')  -- Recent popular content
        )
      ORDER BY 
        is_following DESC,
        (like_count + comment_count * 2) DESC,
        p.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(userId, limit, offset).all();

    return this.enrichPhotosWithMetadata(photos.results || []);
  }

  async getDiscoverFeed(page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    // Get trending/popular photos
    const photos = await this.db.prepare(`
      SELECT 
        p.id, p.filename, p.thumbnail_filename, p.caption, p.created_at,
        p.width, p.height, p.file_size,
        u.username, u.display_name, u.profile_picture,
        (SELECT COUNT(*) FROM photo_likes WHERE photo_id = p.id) as like_count,
        (SELECT COUNT(*) FROM photo_comments WHERE photo_id = p.id) as comment_count,
        (like_count + comment_count * 2) as engagement_score
      FROM photos p
      JOIN users u ON p.user_id = u.id
      WHERE 
        p.deleted_at IS NULL AND
        p.created_at > datetime('now', '-30 days') AND
        u.verified = 1
      ORDER BY engagement_score DESC, p.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all();

    return this.enrichPhotosWithMetadata(photos.results || []);
  }

  async enrichPhotosWithMetadata(photos) {
    const photoService = new (await import('./photoService.js')).PhotoService(this.env);
    
    return Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        imageUrl: await photoService.getSignedUrl(photo.filename),
        thumbnailUrl: await photoService.getSignedUrl(photo.thumbnail_filename),
        tags: await photoService.getPhotoTags(photo.id)
      }))
    );
  }

  async getPhotosByTag(tag, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const photos = await this.db.prepare(`
      SELECT 
        p.id, p.filename, p.thumbnail_filename, p.caption, p.created_at,
        p.width, p.height, p.file_size,
        u.username, u.display_name, u.profile_picture,
        (SELECT COUNT(*) FROM photo_likes WHERE photo_id = p.id) as like_count,
        (SELECT COUNT(*) FROM photo_comments WHERE photo_id = p.id) as comment_count
      FROM photos p
      JOIN users u ON p.user_id = u.id
      JOIN photo_tags pt ON pt.photo_id = p.id
      WHERE 
        p.deleted_at IS NULL AND
        pt.tag = ? AND
        u.verified = 1
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(tag.toLowerCase(), limit, offset).all();

    return this.enrichPhotosWithMetadata(photos.results || []);
  }

  async getTrendingTags(limit = 20) {
    const tags = await this.db.prepare(`
      SELECT 
        pt.tag,
        COUNT(DISTINCT pt.photo_id) as photo_count,
        COUNT(DISTINCT p.user_id) as user_count
      FROM photo_tags pt
      JOIN photos p ON p.id = pt.photo_id
      WHERE 
        p.deleted_at IS NULL AND
        pt.created_at > datetime('now', '-7 days')
      GROUP BY pt.tag
      HAVING photo_count >= 2
      ORDER BY photo_count DESC, user_count DESC
      LIMIT ?
    `).bind(limit).all();

    return tags.results || [];
  }

  async followUser(followerId, followingId) {
    if (followerId === followingId) {
      throw new Error('Cannot follow yourself');
    }

    try {
      await this.db.prepare(`
        INSERT INTO follows (follower_id, following_id, created_at)
        VALUES (?, ?, ?)
      `).bind(followerId, followingId, new Date().toISOString()).run();
    } catch (error) {
      if (!error.message.includes('UNIQUE constraint failed')) {
        throw error;
      }
    }
  }

  async unfollowUser(followerId, followingId) {
    await this.db.prepare(`
      DELETE FROM follows 
      WHERE follower_id = ? AND following_id = ?
    `).bind(followerId, followingId).run();
  }

  async isFollowing(followerId, followingId) {
    const result = await this.db.prepare(`
      SELECT 1 FROM follows 
      WHERE follower_id = ? AND following_id = ?
    `).bind(followerId, followingId).first();

    return !!result;
  }
}