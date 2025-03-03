import express from "express";
import dotenv from "dotenv";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middleware/error.middleware.js";
import userRouter from "./routes/user.router.js";
import authRouter from "./routes/auth.routes.js";
import subsRouter from "./routes/subs.routes.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middleware/arcjet.middleware.js";

dotenv.config({ path: ".env.development.local" });

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Register routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscribers', subsRouter);
app.use(errorMiddleware);
app.use(arcjetMiddleware);

app.get('/', (req, res) => {
  res.send('Subscription API');
});

app.listen(PORT, async () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  await connectToDatabase();
  console.log(`Connected to database in ${NODE_ENV}`);
});

export default app;