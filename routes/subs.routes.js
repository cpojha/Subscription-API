import { Router } from 'express';

const subsRouter = Router();

subsRouter.get('/',(req,res)=>{
    res.send({title: 'GET Subscribe route'});
});

subsRouter.get('/:id',(req,res)=>{
    res.send({title: 'GET Subscribe details'});
});

subsRouter.post('/',(req,res)=>{
    res.send({title: 'create Subscriber details'});
});

subsRouter.put('/:id',(req,res)=>{
    res.send({title: 'UPDATE Subscribe route'});
});

subsRouter.delete('/',(req,res)=>{
    res.send({title: 'DELETE Subscribe route'});
});

subsRouter.get('/user/:id',(req,res)=>{
    res.send({title: 'GET all Subscribe route'});
});
subsRouter.get('/:id/cancel',(req,res)=>{
    res.send({title: 'cancel all  Subscribe route'});
});

subsRouter.get('/upcoming-renewals',(req,res)=>{
    res.send({title: 'GET upcoming renewals'});
});
export default subsRouter;