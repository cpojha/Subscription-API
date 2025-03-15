import { Router } from 'express';
import { signUp, signIn, signOut,logout } from '../controllers/auth.controllers.js';
import { authRateLimiter } from '../middleware/rate-limit.middleware.js';

const authRouter = Router();
// path: /api/v1/auth/sign-up
authRouter.post('/sign-up',authRateLimiter,signUp);
authRouter.post('/sign-in',authRateLimiter,signIn);
authRouter.post('/sign-out',authRateLimiter,signOut);
authRouter.post('/logout',authRateLimiter,logout);
export default authRouter;