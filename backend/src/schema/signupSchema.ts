import { z } from 'zod'

export const signupSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    dob: z.string().refine((d) => !Number.isNaN(Date.parse(d)), { message: 'Invalid date' }),
    role: z.enum(['student', 'teacher', 'company', 'admin']).optional(),
    department: z.string().min(1, 'Department is required'),
    year: z.string().min(1, 'Year is required'),
    avatar: z.string().optional()
});