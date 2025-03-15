/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { redisClient } from '../config/redis.js';


dotenv.config({ path: ".env.development.local" });

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const signUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(201).json({
            success: true,
            data: {
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({
            success: true,
            data: {
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

export const signOut = async (req, res, next) => { // will be deprecated
    try {
        res.clearCookie('token');
        res.status(200).json({
            message: 'User logged out successfully',
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      
      // Get token payload without verification
      const decoded = jwt.decode(token);
      const expiryTimeInSeconds = decoded.exp - Math.floor(Date.now() / 1000);
      
      if (expiryTimeInSeconds > 0) {
        // Add token to blacklist until its expiration
        await redisClient.setEx(`blacklist:${token}`, expiryTimeInSeconds, '1');
      }
      
      res.status(200).json({
        success: true,
        message: 'Successfully logged out'
      });
    } catch (e) {
      next(e);
    }
  };