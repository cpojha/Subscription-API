import { Router } from 'express';

const subsRouter = Router();


subsRouter.post('/',(req,res)=>{
    res.send({title: 'GET Subscribe route'});
});