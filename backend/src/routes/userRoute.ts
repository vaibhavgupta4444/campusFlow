import express from "express"
import { signin, signup } from "../controllers/userController";
import asyncWrapper from "../utils/asyncWrapper";

const userRouter = express.Router();

userRouter.post('/signup', asyncWrapper(signup));
userRouter.post('/signin', asyncWrapper(signin));

export default userRouter;