import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import dbConnect from "./config/dbConnect";
import cors from 'cors'
import userRouter from "./routes/userRoute";

const port = 3000;
const app = express();

dbConnect();

app.use(express.json());
app.use(cors());

app.use('/api/user', userRouter);

app.get("/", (req, res) => {
  res.send("Hello from TypeScript + Express!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
