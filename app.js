import express from "express";
import dotenv from "dotenv";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middleware/error.middleware.js";
import userRouter from "./routes/user.router.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subs.routes.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middleware/arcjet.middleware.js";
import workflowRouter from   "./routes/workflow.routes.js";
import { connectRedis } from "./config/redis.js";
import { apiRateLimiter } from './middleware/rate-limit.middleware.js';

dotenv.config({ path: ".env.development.local" });

const PORT = process.env.PORT || 3000;
//const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

app.use('/api', apiRateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Welcome to the Subscription Tracker API!');
});

app.listen(PORT, async () => {
  console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);

  await connectToDatabase();
  console.log('Connected to MongoDB');
  await connectRedis();
  console.log('Connected to Redis');
});

export default app;