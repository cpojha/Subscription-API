import { Router } from 'express';
import { signUp, signIn, signOut } from '../controllers/auth.controllers.js';

const authRouter = Router();
// path: /api/v1/auth/sign-up
authRouter.post('/sign-up',signUp);
authRouter.post('/sign-in',signIn);
authRouter.post('/sign-out',signOut);

export default authRouter;