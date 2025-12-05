import express from "express"
import { getToken, signin, signup } from "../controllers/userController";
import asyncWrapper from "../utils/asyncWrapper";
import authUser from "../middleware/auth";

const userRouter = express.Router();

userRouter.post('/signup', asyncWrapper(signup));
userRouter.post('/signin', asyncWrapper(signin));
userRouter.post('/refresh', authUser, asyncWrapper(getToken));

export default userRouter;