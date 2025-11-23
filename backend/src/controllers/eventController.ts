import { Request, Response } from 'express';
import { Event } from "../models/event";
import { createEventSchema } from "../schema/createEventSchema";
import { UnauthorizedError } from '../utils/HttpError';

// Extend Request interface to match auth middleware
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

export const createEvent = async (request: AuthenticatedRequest, response: Response) => {
    const data = createEventSchema.parse(request.body);

    const organizerId = request.user?.id;
    if (!organizerId) {
        throw UnauthorizedError('Unauthorized User');
    }

    const event = new Event({
        title: data.title,
        description: data.description,
        tags: data.tags || [],
        location: data.location,
        date: new Date(data.date), // Convert string to Date
        banner: data.banner || '',
        organizerId,
        participants: [] // Initialize empty participants array
    });

    await event.save();

    return response.status(201).json({
        success: true,
        message: 'Event created successfully',
        event: {
            id: event._id,
            title: event.title,
            description: event.description,
            location: event.location,
            date: event.date,
            tags: event.tags,
            banner: event.banner
        }
    });
};