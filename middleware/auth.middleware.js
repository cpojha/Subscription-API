import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { redisClient } from '../config/redis.js';

dotenv.config({ path: '.env.development.local' });

const JWT_SECRET = process.env.JWT_SECRET;

const authorize = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  const token = authHeader.replace('Bearer ', '');
  const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new Error('Token has been invalidated');
    }
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Ensure this sets the correct property
    next();
  } catch (error) {
    console.error(`Auth failed: ${error}`);
    res.status(400).json({ success: false, message: 'Invalid token.' });
  }
};

export default authorize;