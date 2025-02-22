import express from "express";;
import  {PORT}  from "./config/env.js";
const app = express();

app.get("/", (req, res) => {
  res.send("Api runnning");
});

app.listen(PORT, () => {
  console.log("Server is running on port http://localhost:3000");
})

export default app;