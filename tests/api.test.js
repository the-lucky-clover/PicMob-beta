// Test suite for PicMob Cloudflare Worker API
import { expect, test, describe, beforeAll, afterAll } from 'vitest';

const API_BASE = 'http://127.0.0.1:8787'; // Local Wrangler dev server
let authToken = '';
let testUserId = '';
let testPhotoId = '';

describe('PicMob API Tests', () => {
  
  describe('Authentication', () => {
    test('should register a new user', async () => {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'testpassword123',
          username: 'testuser'
        })
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.userId).toBeDefined();
      testUserId = data.userId;
    });

    test('should prevent duplicate registration', async () => {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'testpassword123',
          username: 'testuser'
        })
      });

      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data.error).toContain('already exists');
    });

    test('should login with correct credentials', async () => {
      // First, manually verify the user in the database for testing
      // In production, this would be done via email verification
      
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'testpassword123'
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.token).toBeDefined();
      expect(data.user.username).toBe('testuser');
      authToken = data.token;
    });

    test('should reject invalid credentials', async () => {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toContain('Invalid credentials');
    });
  });

  describe('Protected Routes', () => {
    test('should require authentication for protected routes', async () => {
      const response = await fetch(`${API_BASE}/api/protected/profile`);
      expect(response.status).toBe(401);
    });

    test('should allow access with valid token', async () => {
      const response = await fetch(`${API_BASE}/api/protected/profile`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.profile).toBeDefined();
      expect(data.profile.username).toBe('testuser');
    });
  });

  describe('User Profile', () => {
    test('should get user profile', async () => {
      const response = await fetch(`${API_BASE}/api/protected/profile`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.profile.username).toBe('testuser');
      expect(data.profile.email).toBe('test@example.com');
    });

    test('should update user profile', async () => {
      const updates = {
        display_name: 'Test User Updated',
        bio: 'This is a test bio'
      };

      const response = await fetch(`${API_BASE}/api/protected/profile`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.profile.display_name).toBe('Test User Updated');
      expect(data.profile.bio).toBe('This is a test bio');
    });
  });

  describe('Public User Feed', () => {
    test('should get public user feed', async () => {
      const response = await fetch(`${API_BASE}/api/users/testuser/feed`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.user.username).toBe('testuser');
      expect(data.feed).toBeInstanceOf(Array);
    });

    test('should return 404 for non-existent user', async () => {
      const response = await fetch(`${API_BASE}/api/users/nonexistentuser/feed`);
      expect(response.status).toBe(404);
    });
  });

  describe('Photo Management', () => {
    test('should get empty photos list initially', async () => {
      const response = await fetch(`${API_BASE}/api/protected/photos`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.photos).toBeInstanceOf(Array);
      expect(data.photos.length).toBe(0);
    });

    // Note: File upload testing would require multipart/form-data setup
    // This is a simplified test for the endpoint structure
    test('should require file for photo upload', async () => {
      const response = await fetch(`${API_BASE}/api/protected/photos/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: new FormData() // Empty form data
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('No photo file provided');
    });
  });

  describe('Feed System', () => {
    test('should get main feed for authenticated user', async () => {
      const response = await fetch(`${API_BASE}/api/protected/feed`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.feed).toBeInstanceOf(Array);
    });

    test('should support pagination', async () => {
      const response = await fetch(`${API_BASE}/api/protected/feed?page=1&limit=5`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.feed).toBeInstanceOf(Array);
    });
  });

  describe('Health Check', () => {
    test('should return health status', async () => {
      const response = await fetch(`${API_BASE}/health`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.status).toBe('ok');
      expect(data.timestamp).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for unknown endpoints', async () => {
      const response = await fetch(`${API_BASE}/api/unknown`);
      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Not found');
    });

    test('should handle malformed JSON', async () => {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json'
      });

      expect(response.status).toBe(500);
    });
  });

  describe('CORS', () => {
    test('should handle OPTIONS requests', async () => {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'OPTIONS'
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    });
  });

  describe('Rate Limiting & Security', () => {
    test('should validate input parameters', async () => {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid-email',
          password: '123', // Too short
          username: '' // Empty
        })
      });

      expect(response.status).toBe(400);
    });

    test('should sanitize user input', async () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test2@example.com',
          password: 'testpassword123',
          username: maliciousInput
        })
      });

      // Should reject or sanitize malicious input
      expect(response.status).toBe(400);
    });
  });

  // Cleanup after tests
  afterAll(async () => {
    // In a real test environment, you might want to clean up test data
    // This would depend on your test database setup
    console.log('Tests completed. Cleanup may be needed for test data.');
  });
});