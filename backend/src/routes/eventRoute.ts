import express from "express"
import { createEvent, getEvents, getSingleEvent } from "../controllers/eventController";
import asyncWrapper from "../utils/asyncWrapper";
import authUser from "../middleware/auth";

const eventRouter = express.Router();

eventRouter.get('/', authUser, asyncWrapper(getEvents));
eventRouter.get('/:eventId', asyncWrapper(getSingleEvent));
eventRouter.post('/', authUser, asyncWrapper(createEvent));


export default eventRouter;