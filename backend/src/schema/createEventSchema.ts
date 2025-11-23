import { z } from 'zod';

export const createEventSchema = z.object({
    title: z.string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title cannot exceed 100 characters')
        .trim(),
    
    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description cannot exceed 1000 characters')
        .trim(),
    
    tags: z.array(z.string().trim())
        .optional()
        .default([])
        .refine(
            (tags) => tags.every(tag => tag.length > 0 && tag.length <= 30),
            { message: 'Each tag must be between 1 and 30 characters' }
        ),
    
    location: z.string()
        .min(3, 'Location must be at least 3 characters')
        .max(200, 'Location cannot exceed 200 characters')
        .trim(),
    
    date: z.string()
        .refine((dateStr) => !Number.isNaN(Date.parse(dateStr)), {
            message: 'Invalid date format'
        })
        .refine((dateStr) => new Date(dateStr) > new Date(), {
            message: 'Event date must be in the future'
        }),
    
    banner: z.string()
        .url('Banner must be a valid URL')
        .optional()
        .or(z.literal(''))
    
    // NOTE: organizerId will be set from JWT token in controller, not from request body
    // NOTE: participants will be initialized as empty array in controller
});

export type CreateEventInput = z.infer<typeof createEventSchema>;