// filepath: f:/MyApis/config/upstash.js
import { Client as WorkflowClient } from "@upstash/workflow";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development.local' });

const QSTASH_TOKEN = process.env.QSTASH_TOKEN;

export const workflowClient = new WorkflowClient({
  token: QSTASH_TOKEN,
});