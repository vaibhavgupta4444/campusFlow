import { Request, Response } from 'express';
import { Event } from "../models/event";
import { createEventSchema } from "../schema/createEventSchema";
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/HttpError';
import User from '../models/user';

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



export const getEvents = async (request: Request, response: Response) => {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filters: any = {};
    if (request.query.tag) {
        filters.tags = request.query.tag; // Filter by tag
    }
    if (request.query.upcoming === 'true') {
        filters.date = { $gte: new Date() }; // Only future events
    }

    const events = await Event.find(filters)
        .sort({ date: 1 }) // Sort by date ascending
        .limit(limit)
        .skip(skip)
        .select('-__v')
        .populate('organizerId', 'name email')
        .populate('participants', 'name email');

    const total = await Event.countDocuments(filters);

    return response.status(200).json({
        success: true,
        data: {
            events,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        }
    });
};

export const joinEvent = async (request: AuthenticatedRequest, response: Response) => {
    const { eventId } = request.body;
    const userId = request.user?.id;

    if(!eventId || !userId){
        throw BadRequestError('Event ID is required');
    }

    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if(!user){
        throw NotFoundError('User not found');
    }
    
    if(!event){
        throw NotFoundError('Event not found');
    }

 
    if(event.date < new Date()){
        throw BadRequestError('Cannot join past events');
    }

    if(event.organizerId.toString() === userId){
        throw BadRequestError('Organizer cannot join their own event');
    }

    if(event.participants.includes(userId)){
        throw BadRequestError('You have already joined this event');
    }

    event.participants.push(userId);
    await event.save();

    return response.status(200).json({
        success: true,
        message: "You successfully joined the event"
    });
}


export const leaveEvent = async (request: AuthenticatedRequest, response: Response) => {
    const eventId = request.body.eventId;
    const userId = request.user?.id;

    if(!userId || !eventId){
        throw BadRequestError('EventId is missing');
    }

    const event = await Event.findById(eventId);

    if(!event){
        throw NotFoundError('Event not exist');
    }

    const user = await User.findById(userId);

    if(!user){
        throw NotFoundError('User not exist');
    }

    if(!event.participants.includes(userId)){
        throw BadRequestError('You are not participants of this event');
    }

    event.participants = event.participants.filter((id: any) => id.toString() !== userId);
    await event.save();

    return response.status(200).json({
        success: true,
        message: "You successfully left the event"
    });
}