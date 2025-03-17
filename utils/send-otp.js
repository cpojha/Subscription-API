/* eslint-disable no-unused-vars */
import crypto from 'crypto';
import { redisClient } from '../config/redis.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development.local' });
const JWT_SECRET = process.env.JWT_SECRET;

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in Redis with 15 minute expiration
export const storeOTP = async (userId, otp) => {
  await redisClient.setEx(`otp:${userId}`, 900, otp);
  return otp;
};

// Verify OTP from Redis
export const verifyOTP = async (userId, userSubmittedOTP) => {
  const storedOTP = await redisClient.get(`otp:${userId}`);
  return storedOTP === userSubmittedOTP;
};

// Generate a secure verification token for magic links
export const generateVerificationToken = (userId) => {
  return jwt.sign(
    { userId, purpose: 'email_verification' }, 
    JWT_SECRET,
    { expiresIn: '15m' }
  );
};

// Store verification token in Redis
export const storeVerificationToken = async (userId, token) => {
  await redisClient.setEx(`verify_token:${token}`, 900, userId);
  return token;
};

// Verify token from Redis
export const verifyToken = async (token) => {
  try {
    // First verify JWT is valid
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Then check if token exists in Redis
    const userId = await redisClient.get(`verify_token:${token}`);
    
    if (!userId) {
      throw new Error('Token has been used or expired');
    }
    
    // Delete token after use (one-time use)
    await redisClient.del(`verify_token:${token}`);
    
    return { valid: true, userId: decoded.userId };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};