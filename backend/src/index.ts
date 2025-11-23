import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import dbConnect from "./config/dbConnect";
import cors from 'cors'
import userRouter from "./routes/userRoute";
import { ZodError } from 'zod';
import { HttpError } from './utils/HttpError';
import eventRouter from './routes/eventRoute';

const port = 3000;
const app = express();

dbConnect();

app.use(express.json());
app.use(cors());

app.use('/api/user', userRouter);

app.use('/api/event', eventRouter);

app.get("/", (req, res) => {
  res.send("Hello from TypeScript + Express!");
});

// Central Error Handler - MUST be after all routes
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // console.error('Error caught by middleware:', err);

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.issues
    });
  }

  // Custom HttpError
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details })
    });
  }

  // MongoDB duplicate key error
  if (err.name === 'MongoServerError' && err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      details: err.keyValue
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(err.errors).map((e: any) => e.message)
    });
  }

  // Default server error
  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
