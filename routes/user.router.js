import { Router } from 'express';
//import { signUp, signIn, signOut } from '../controllers/auth.controller.js';

const userRouter = Router();

userRouter.get('/', (req, res) => {
    res.send({ title: 'Get all users' });
});

userRouter.get('/:id', (req, res) => {
    res.send({ title: 'Get users details' });
});
userRouter.post('/', (req, res) => {
    res.send({ title: 'create all users' });
});
userRouter.put('/:id', (req, res) => {
    res.send({ title: 'update all users' });
});
userRouter.delete('/:id', (req, res) => {
    res.send({ title: 'DEL all users' });
});