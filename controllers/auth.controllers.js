/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import user from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: ".env.development.local" });

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const signUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409; // 409 is for conflict
            throw error;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new user({ name, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(201).json({
            message: 'User created successfully',
            success: true,
            data: {
                token,
                user: newUser
            }
        });
    } catch (error) {
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401; // 401 is for unauthorized
            throw error;
        }

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401; // 401 is for unauthorized
            throw error;
        }

        // Generate JWT token
        const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({
            message: 'User logged in successfully',
            success: true,
            data: {
                token,
                user: existingUser
            }
        });
    } catch (error) {
        next(error);
    }
};

export const signOut = async (req, res, next) => {

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