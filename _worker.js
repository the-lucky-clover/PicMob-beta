/**
 * PicMob API - Cloudflare Worker
 * Handles user authentication, photo feeds, and profile management
 */

import { Router } from 'itty-router';
import { handleCORS, corsHeaders } from './cors';
import { authMiddleware, createSession, verifySession } from './auth';
import { UserService } from './services/userService';
import { PhotoService } from './services/photoService';
import { FeedService } from './services/feedService';

const router = Router();

// Apply CORS to all routes
router.all('*', handleCORS);

// Health check
router.get('/health', () => Response.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Authentication routes
router.post('/api/auth/register', async (request, env) => {
  try {
    const { email, password, username } = await request.json();
    
    // Validate input
    if (!email || !password || !username) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if username is available
    const existingUser = await env.DB.prepare(
      `SELECT id FROM users WHERE email = ? OR username = ?`
    ).bind(email, username).first();
    
    if (existingUser) {
      return Response.json({ error: 'Email or username already exists' }, { status: 409 });
    }
    
    const userService = new UserService(env);
    const user = await userService.createUser({ email, password, username });
    
    return Response.json({ 
      success: true, 
      message: 'User created successfully. Please verify your email.',
      userId: user.id 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ error: 'Registration failed' }, { status: 500 });
  }
});

router.post('/api/auth/login', async (request, env) => {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return Response.json({ error: 'Email and password required' }, { status: 400 });
    }
    
    const userService = new UserService(env);
    const user = await userService.authenticateUser(email, password);
    
    if (!user) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    const sessionToken = await createSession(user.id, env);
    
    return Response.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.display_name,
        profilePicture: user.profile_picture
      },
      token: sessionToken
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: 'Login failed' }, { status: 500 });
  }
});

// Protected routes - require authentication
router.all('/api/protected/*', authMiddleware);

// User profile routes
router.get('/api/protected/profile', async (request, env) => {
  const user = request.user;
  const userService = new UserService(env);
  const profile = await userService.getUserProfile(user.id);
  return Response.json({ profile });
});

router.put('/api/protected/profile', async (request, env) => {
  const user = request.user;
  const updates = await request.json();
  const userService = new UserService(env);
  const updatedProfile = await userService.updateUserProfile(user.id, updates);
  return Response.json({ profile: updatedProfile });
});

// Photo management routes
router.post('/api/protected/photos/upload', async (request, env) => {
  try {
    const user = request.user;
    const formData = await request.formData();
    const file = formData.get('photo');
    const caption = formData.get('caption') || '';
    const tags = formData.get('tags') ? JSON.parse(formData.get('tags')) : [];
    
    if (!file) {
      return Response.json({ error: 'No photo file provided' }, { status: 400 });
    }
    
    const photoService = new PhotoService(env);
    const photo = await photoService.uploadPhoto(user.id, file, caption, tags);
    
    return Response.json({ success: true, photo });
  } catch (error) {
    console.error('Photo upload error:', error);
    return Response.json({ error: 'Photo upload failed' }, { status: 500 });
  }
});

router.get('/api/protected/photos', async (request, env) => {
  const user = request.user;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);
  
  const photoService = new PhotoService(env);
  const photos = await photoService.getUserPhotos(user.id, page, limit);
  
  return Response.json({ photos });
});

// Public user feed routes
router.get('/api/users/:username/feed', async (request, env) => {
  try {
    const { username } = request.params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);
    
    const userService = new UserService(env);
    const user = await userService.getUserByUsername(username);
    
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    
    const feedService = new FeedService(env);
    const feed = await feedService.getUserFeed(user.id, page, limit);
    
    return Response.json({
      user: {
        username: user.username,
        displayName: user.display_name,
        profilePicture: user.profile_picture,
        bio: user.bio
      },
      feed
    });
  } catch (error) {
    console.error('Feed fetch error:', error);
    return Response.json({ error: 'Failed to fetch feed' }, { status: 500 });
  }
});

// Main feed (for authenticated users)
router.get('/api/protected/feed', async (request, env) => {
  const user = request.user;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);
  
  const feedService = new FeedService(env);
  const feed = await feedService.getMainFeed(user.id, page, limit);
  
  return Response.json({ feed });
});

// Photo interactions
router.post('/api/protected/photos/:photoId/like', async (request, env) => {
  const user = request.user;
  const { photoId } = request.params;
  
  const photoService = new PhotoService(env);
  await photoService.likePhoto(user.id, photoId);
  
  return Response.json({ success: true });
});

router.delete('/api/protected/photos/:photoId/like', async (request, env) => {
  const user = request.user;
  const { photoId } = request.params;
  
  const photoService = new PhotoService(env);
  await photoService.unlikePhoto(user.id, photoId);
  
  return Response.json({ success: true });
});

// Catch all for unmatched routes
router.all('*', () => Response.json({ error: 'Not found' }, { status: 404 }));

export default {
  async fetch(request, env, ctx) {
    return router.handle(request, env, ctx).catch(error => {
      console.error('Worker error:', error);
      return Response.json({ error: 'Internal server error' }, { status: 500 });
    });
  }
};
    if (url.pathname === "/request-reset" && request.method === "POST") {
      const { email } = await request.json();
      const resetCode = Math.random().toString(36).slice(2, 8).toUpperCase();
      await env.DB.prepare(
        `UPDATE users SET reset_code = ? WHERE email = ?`
      ).bind(resetCode, email).run();
      // TODO: Send resetCode to user's email
      return Response.json({ success: true, resetCode }); // Show code for testing
    }

    // --- PASSWORD RESET ---
    if (url.pathname === "/reset-password" && request.method === "POST") {
      const { email, code, newPassword } = await request.json();
      const user = await env.DB.prepare(
        `SELECT * FROM users WHERE email = ? AND reset_code = ?`
      ).bind(email, code).first();
      if (!user) return Response.json({ error: "Invalid code" }, { status: 400 });
      const hashed = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(newPassword));
      const hashHex = Array.from(new Uint8Array(hashed)).map(b => b.toString(16).padStart(2, "0")).join("");
      await env.DB.prepare(
        `UPDATE users SET password_hash = ?, reset_code = NULL WHERE email = ?`
      ).bind(hashHex, email).run();
      return Response.json({ success: true });
    }

    return new Response("Not found", { status: 404 });
  }
};

