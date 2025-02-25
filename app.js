import express from "express";
import dotenv from "dotenv";
import connectToDatabase from "./database/mongodb.js";
// import { NODE_ENV } from './config/env.js';
dotenv.config({ path: ".env.development.local" });

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
import userRouter from "./routes/user.router.js";
import authRouter from "./routes/auth.routes.js";
import subsRouter from "./routes/subs.routes.js";

const app = express();

app.use('/api/v1/useauth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscribers', subsRouter);

app.get("/", (req, res) => {
  res.send("Api running");
});

app.listen(PORT,async () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
 await connectToDatabase();
 console.log(`Connected to database in ${NODE_ENV}`)
});

export default app;