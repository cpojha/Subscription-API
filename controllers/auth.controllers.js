/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { redisClient } from '../config/redis.js';
import { 
  generateOTP, storeOTP, verifyOTP,
  generateVerificationToken, storeVerificationToken, verifyToken
} from '../utils/send-otp.js';
import { sendVerificationEmail } from '../utils/send-email.js';

dotenv.config({ path: ".env.development.local" });

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';

// Generate auth token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Register a new user
export const register = async (req, res, next) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ 
          success: false, 
          message: 'User with this email already exists' 
        });
      } else {
        // User exists but isn't verified, we'll send a new verification
      }
    }

    // Create user or update existing unverified user
    let user = existingUser;
    
    if (!user) {
      // Create new user
      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isVerified: false
      });
      await user.save();
    }

    // Generate and store OTP
    const otp = await storeOTP(user._id.toString(), generateOTP());
    
    // Generate and store verification token for magic link
    const verificationToken = generateVerificationToken(user._id.toString());
    await storeVerificationToken(user._id.toString(), verificationToken);
    
    // Create verification link
    const verificationLink = `${SERVER_URL}/api/v1/auth/verify-email?token=${verificationToken}`;
    
    // Send verification email
    await sendVerificationEmail({
      to: user.email,
      userName: user.name,
      otp,
      verificationLink
    });
    
    // Create a temporary token valid only for verification
    const temporaryToken = jwt.sign(
      { userId: user._id, purpose: 'verification_only' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration initiated. Please verify your email.',
      userId: user._id,
      tempToken: temporaryToken
    });
    
  } catch (e) {
    next(e);
  }
};

// Verify with OTP
export const verifyWithOTP = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;
    
    if (!userId || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID and OTP are required' 
      });
    }
    
    // Check if OTP is valid
    const isValidOTP = await verifyOTP(userId, otp);
    
    if (!isValidOTP) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired OTP' 
      });
    }
    
    // Update user to verified
    const user = await User.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Delete OTP after successful verification
    await redisClient.del(`otp:${userId}`);
    
    // Generate auth token
    const token = generateToken(user._id);
    
    // Return success with user info and token
    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (e) {
    next(e);
  }
};

// Verify with magic link
export const verifyWithLink = async (req, res, next) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Verification token is required' 
      });
    }
    
    // Verify token
    const { valid, userId, error } = await verifyToken(token);
    
    if (!valid) {
      return res.status(400).json({ 
        success: false, 
        message: error || 'Invalid or expired verification link' 
      });
    }
    
    // Update user to verified
    const user = await User.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Delete any stored OTP for this user
    await redisClient.del(`otp:${userId}`);
    
    // For API requests, return JSON
    if (req.headers['content-type'] === 'application/json') {
      // Generate auth token
      const authToken = generateToken(user._id);
      
      return res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        token: authToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    }
    
    // For browser requests, redirect to frontend with success message
    // You should change this to your frontend URL
    res.redirect(`${process.env.FRONTEND_URL || SERVER_URL}/login?verified=true`);
    
  } catch (e) {
    next(e);
  }
};

// Resend verification email
export const resendVerification = async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }
    
    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ 
        success: false, 
        message: 'User is already verified' 
      });
    }
    
    // Generate and store new OTP
    const otp = await storeOTP(userId, generateOTP());
    
    // Generate and store new verification token
    const verificationToken = generateVerificationToken(userId);
    await storeVerificationToken(userId, verificationToken);
    
    // Create verification link
    const verificationLink = `${SERVER_URL}/api/v1/auth/verify-email?token=${verificationToken}`;
    
    // Send verification email
    await sendVerificationEmail({
      to: user.email,
      userName: user.name,
      otp,
      verificationLink
    });
    
    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully'
    });
    
  } catch (e) {
    next(e);
  }
};

// Login (make sure only verified users can log in)
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    
    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    // Check if user is verified
    if (!user.isVerified) {
      // Generate temporary token for verification purposes
      const tempToken = jwt.sign(
        { userId: user._id, purpose: 'verification_only' },
        JWT_SECRET,
        { expiresIn: '15m' }
      );
      
      return res.status(403).json({
        success: false,
        message: 'Email not verified. Please verify your email before logging in.',
        userId: user._id,
        tempToken
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    // Return success with user info and token
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (e) {
    next(e);
  }
};

// export const signUp = async (req, res, next) => {//depreciated
//     try {
//         const { name, email, password } = req.body;

//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ success: false, message: 'Email already in use' });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create new user
//         const user = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//         });

//         // Generate JWT token
//         const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

//         res.status(201).json({
//             success: true,
//             data: {
//                 token,
//                 user: {
//                     _id: user._id,
//                     name: user.name,
//                     email: user.email,
//                     createdAt: user.createdAt,
//                     updatedAt: user.updatedAt,
//                 },
//             },
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const signIn = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;

//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ success: false, message: 'Invalid email or password' });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ success: false, message: 'Invalid email or password' });
//         }

//         const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

//         res.status(200).json({
//             success: true,
//             data: {
//                 token,
//                 user: {
//                     _id: user._id,
//                     name: user.name,
//                     email: user.email,
//                     createdAt: user.createdAt,
//                     updatedAt: user.updatedAt,
//                 },
//             },
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const signOut = async (req, res, next) => { // will be deprecated
//     try {
//         res.clearCookie('token');
//         res.status(200).json({
//             message: 'User logged out successfully',
//             success: true,
//             data: {}
//         });
//     } catch (error) {
//         next(error);
//     }
// };

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