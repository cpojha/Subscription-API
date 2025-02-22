import { Router } from 'express';

const authRouter = Router();

authRouter.post('/sign-up',(req,res)=>{
    res.send({title: 'Sign up route'});
});

authRouter.post('/sign-in',(req,res)=>{
    res.send({title: 'Sign in route'});
});

authRouter.post('/sign-out',(req,res)=>{
    res.send({title: 'Sign out route'});
});

export default authRouter;