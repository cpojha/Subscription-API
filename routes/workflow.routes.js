import { Router} from 'express';
import { sendReminders } from '../controllers/workflow.controllers.cjs'

const workflowRouter = Router();

workflowRouter.post('/subscription/reminder', sendReminders);

export default workflowRouter;