import { Router } from 'express';
import { register, login,logout,verifyWithOTP,verifyWithLink,resendVerification } from '../controllers/auth.controllers.js';
import { authRateLimiter } from '../middleware/rate-limit.middleware.js';

const authRouter = Router();
// path: /api/v1/auth/sign-up

authRouter.post('/verify-otp', authRateLimiter, verifyWithOTP);
authRouter.get('/verify-email', verifyWithLink); // For magic links
authRouter.post('/resend-verification', authRateLimiter, resendVerification);


authRouter.post('/register',authRateLimiter,register);
authRouter.post('/login',authRateLimiter,login);
// authRouter.post('/',authRateLimiter,signOut);
authRouter.post('/logout',authRateLimiter,logout);
export default authRouter;