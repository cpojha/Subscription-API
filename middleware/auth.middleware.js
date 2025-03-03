/* eslint-disable no-unused-vars */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: ".env.development.local" });
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
import User from '../models/user.model.js';
const authorize = async (req, res, next) => {

try {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        throw error;

    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if(!user) {
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        throw error;
    }
    req.user = user;
    next();
} catch (error) {
    res.status(401).json({
        success: false,
        message: 'Unauthorized',
        error: error.message
    });
   // next(error);
    
}
}

export default authorize;