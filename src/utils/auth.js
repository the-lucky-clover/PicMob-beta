/**
 * Authentication utilities for PicMob API
 */

import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode('0JAwJyee2IdpJcqzGGTEElTRF1XlU9AX+igpwl78kOA=');

export async function createSession(userId, env) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  // Store session in KV for additional security/revocation
  const sessionId = crypto.randomUUID();
  await env.SESSIONS.put(`session:${sessionId}`, JSON.stringify({
    userId,
    token,
    createdAt: new Date().toISOString()
  }), { expirationTtl: 7 * 24 * 60 * 60 }); // 7 days

  return token;
}

export async function verifySession(token, env) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export async function authMiddleware(request, env) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.substring(7);
  const payload = await verifySession(token, env);

  if (!payload) {
    return Response.json({ error: 'Invalid token' }, { status: 401 });
  }

  // Get user info
  const user = await env.DB.prepare(
    `SELECT id, email, username, display_name, profile_picture FROM users WHERE id = ?`
  ).bind(payload.userId).first();

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 401 });
  }

  // Add user to request for use in route handlers
  request.user = user;
  
  return null; // Continue to next handler
}

export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateVerificationCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}