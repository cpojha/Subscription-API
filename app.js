import express from "express";
import dotenv from "dotenv";

dotenv.config({ path: ".env.development.local" });

const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

export default app;