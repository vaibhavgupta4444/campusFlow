import { z, ZodError } from 'zod';
import bcrypt from 'bcrypt';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const createToken = (id: mongoose.Types.ObjectId) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    const token = jwt.sign({ id }, secret, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ id }, secret, { expiresIn: '30d' });
    return {token, refreshToken};
}

const signupSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    dob: z.string().refine((d) => !Number.isNaN(Date.parse(d)), { message: 'Invalid date' }),
    role: z.enum(['student', 'teacher', 'company', 'admin']).optional(),
    department: z.string().min(1, 'Department is required'),
    year: z.string().min(1, 'Year is required'),
    avatar: z.string().optional()
});

export const signup = async (request: any, response: any) => {
    try {
        const data = signupSchema.parse(request.body);
        const existing = await User.findOne({ email: data.email });
        if (existing) {
            return response.status(409).json({ 
                success: false, 
                message: 'User with this email already exists' 
            });
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = new User({
            name: data.name,
            email: data.email.toLowerCase().trim(),
            password: hashedPassword,
            dob: new Date(data.dob),
            role: data.role || 'student',
            department: data.department,
            year: data.year,
            avatar: data.avatar || ''
        });

        await user.save();

        return response.status(201).json({ 
            success: true, 
            message: `SignUp successfully`
        });

    } catch (error: any) {
        if (error instanceof ZodError) {
            return response.status(400).json({ 
                success: false, 
                errors: error.issues 
            });
        }
        
        return response.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

export const signin = async(request: any, response: any) => {
    try {
        const { email, password } = request.body;

        if(!email || !password){
            return response.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        const user = await User.findOne({email});

        if (!user) {
            return response.status(403).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch){
            const {token, refreshToken} = createToken(user._id);

            return response.json({
                success: true,
                data: {
                    token,
                    refreshToken,
                    expiresIn: '7d'
                }
            })
        }
            
        return response.json({success:false,message:"Invalid credentials"});


    } catch (error: any) {
        if (error instanceof ZodError) {
            return response.status(400).json({ 
                success: false, 
                errors: error.issues 
            });
        }
        
        return response.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
}