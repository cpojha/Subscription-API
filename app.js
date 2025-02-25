import express from "express";
import dotenv from "dotenv";
import connectToDatabase from "./database/mongodb.js";
// import { NODE_ENV } from './config/env.js';
dotenv.config({ path: ".env.development.local" });
import errorMiddleware from "./middleware/error.middleware.js";

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
import userRouter from "./routes/user.router.js";
import authRouter from "./routes/auth.routes.js";
import subsRouter from "./routes/subs.routes.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/useauth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscribers', subsRouter);
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Subscrption Api");//
});

app.listen(PORT,async () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
 await connectToDatabase();
 console.log(`Connected to database in ${NODE_ENV}`)
});

export default app;