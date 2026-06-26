/**
 * User service for managing user data and authentication
 */

import { hashPassword, generateVerificationCode } from '../utils/auth.js';

export class UserService {
  constructor(env) {
    this.env = env;
    this.db = env.DB;
  }

  async createUser({ email, password, username, displayName = null }) {
    const hashedPassword = await hashPassword(password);
    const verificationCode = await generateVerificationCode();
    const userId = crypto.randomUUID();
    
    const result = await this.db.prepare(`
      INSERT INTO users (
        id, email, username, display_name, password_hash, 
        verified, verification_code, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      userId,
      email.toLowerCase(),
      username.toLowerCase(),
      displayName || username,
      hashedPassword,
      false,
      verificationCode,
      new Date().toISOString(),
      new Date().toISOString()
    ).run();

    if (!result.success) {
      throw new Error('Failed to create user');
    }

    return {
      id: userId,
      email,
      username,
      displayName: displayName || username,
      verified: false
    };
  }

  async authenticateUser(email, password) {
    const hashedPassword = await hashPassword(password);
    
    const user = await this.db.prepare(`
      SELECT id, email, username, display_name, profile_picture, verified
      FROM users 
      WHERE email = ? AND password_hash = ?
    `).bind(email.toLowerCase(), hashedPassword).first();

    return user;
  }

  async getUserByUsername(username) {
    const user = await this.db.prepare(`
      SELECT id, email, username, display_name, profile_picture, bio, verified, created_at
      FROM users 
      WHERE username = ?
    `).bind(username.toLowerCase()).first();

    return user;
  }

  async getUserProfile(userId) {
    const user = await this.db.prepare(`
      SELECT 
        id, email, username, display_name, profile_picture, bio, 
        verified, created_at, updated_at,
        (SELECT COUNT(*) FROM photos WHERE user_id = ? AND deleted_at IS NULL) as photo_count,
        (SELECT COUNT(*) FROM follows WHERE follower_id = ?) as following_count,
        (SELECT COUNT(*) FROM follows WHERE following_id = ?) as follower_count
      FROM users 
      WHERE id = ?
    `).bind(userId, userId, userId, userId).first();

    return user;
  }

  async updateUserProfile(userId, updates) {
    const allowedFields = ['display_name', 'bio', 'profile_picture'];
    const updateFields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (allowedFields.includes(key) && value !== undefined) {
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(new Date().toISOString());
    values.push(userId);

    await this.db.prepare(`
      UPDATE users 
      SET ${updateFields.join(', ')}, updated_at = ?
      WHERE id = ?
    `).bind(...values).run();

    return this.getUserProfile(userId);
  }

  async verifyUser(email, verificationCode) {
    const result = await this.db.prepare(`
      UPDATE users 
      SET verified = true, verification_code = null, updated_at = ?
      WHERE email = ? AND verification_code = ?
    `).bind(new Date().toISOString(), email.toLowerCase(), verificationCode).run();

    return result.changes > 0;
  }

  async searchUsers(query, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    
    const users = await this.db.prepare(`
      SELECT 
        id, username, display_name, profile_picture, bio,
        (SELECT COUNT(*) FROM photos WHERE user_id = users.id AND deleted_at IS NULL) as photo_count
      FROM users 
      WHERE 
        verified = true AND
        (username LIKE ? OR display_name LIKE ?)
      ORDER BY 
        CASE 
          WHEN username = ? THEN 1
          WHEN username LIKE ? THEN 2
          WHEN display_name LIKE ? THEN 3
          ELSE 4
        END,
        photo_count DESC
      LIMIT ? OFFSET ?
    `).bind(
      `%${query}%`, `%${query}%`,
      query, `${query}%`, `${query}%`,
      limit, offset
    ).all();

    return users.results || [];
  }
}