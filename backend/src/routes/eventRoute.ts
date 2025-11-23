import express from "express"
import { createEvent } from "../controllers/eventController";
import asyncWrapper from "../utils/asyncWrapper";
import authUser from "../middleware/auth";

const eventRouter = express.Router();

eventRouter.post('/', authUser, asyncWrapper(createEvent));

export default eventRouter;