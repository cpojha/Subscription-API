/* eslint-disable no-unused-vars */
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redisClient } from '../config/redis.js';

const apiLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rate_limit:api',
  points: 100, // Number of points
  duration: 60, // Per 60 seconds
});

// Auth rate limiter: 10 login attempts per minute
const authLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rate_limit:auth',
  points: 10, // Number of points
  duration: 60, // Per 60 seconds
  blockDuration: 300, // Block for 5 minutes if exceeded
});

export const apiRateLimiter = async (req, res, next) => {
  try {
    const key = req.ip;
    await apiLimiter.consume(key);
    next();
  } catch (err) {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.'
    });
  }
};

export const authRateLimiter = async (req, res, next) => {
  try {
    const key = req.ip;
    await authLimiter.consume(key);
    next();
  } catch (err) {
    res.status(429).json({
      success: false,
      message: 'Too many login attempts, please try again later.'
    });
  }
};