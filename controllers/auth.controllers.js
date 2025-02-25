/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import user from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';  // JWT_SECRET is defined in env.js
import { JWT_EXPIRES_IN } from '../config/env.js'; // JWT_EXPIRES_IN is defined in env.js               

export const signUp = async (req, res,next) => {

const session = await mongoose.startSession();
session.startTransaction();
try {
    // logic goes here
    // to create new user
    const {name,email,password} = req.body;
    //if user already exists
    const existingUser = await user.findOne({email});
    if(existingUser){
        const error = new Error('User already exists');
        error.statusCode = 409; // 409 is for conflict
        throw error;
    }
// Hash the password

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

const newUsers = await user.create([{name,email,password:hashedPassword}],{session:session});
// Generate JWT token
const token = jwt.sign({userId: newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
        message: 'User created successfully', 
        success: true,
        data: {
            token,
            user: newUsers[0]
        }
        
    });
} catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
}
}

export const signIn = async (req, res,next) => {}

export const signOut = async (req, res,next) => {}