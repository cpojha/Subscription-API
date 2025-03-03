import { Router } from 'express';
//import { signUp, signIn, signOut } from '../controllers/auth.controller.js';
import { getUsers, getUser } from '../controllers/users.controllers.js';
import authorize from '../middleware/auth.middleware.js';
const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/:id',authorize, getUser);

userRouter.post('/', (req, res) => {
    res.send({ title: 'create all users' });
});
userRouter.put('/:id', (req, res) => {
    res.send({ title: 'update all users' });
});
userRouter.delete('/:id', (req, res) => {
    res.send({ title: 'DEL all users' });
});

export default userRouter;