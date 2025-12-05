import { signupSchema } from '../schema/signupSchema';
import bcrypt from 'bcrypt';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { BadRequestError, ConflictError, NotFoundError } from '../utils/HttpError';

const createToken = (id: mongoose.Types.ObjectId) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    const token = jwt.sign({ id }, secret, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ id }, secret, { expiresIn: '30d' });
    return { token, refreshToken };
}


export const signup = async (request: any, response: any) => {
    const data = signupSchema.parse(request.body);
    const existing = await User.findOne({ email: data.email });
    if (existing) {
        throw ConflictError('User already exists');
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
};


export const signin = async (request: any, response: any) => {

    const { email, password } = request.body;

    if (!email || !password) {
        throw BadRequestError('Email and password are required');
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw NotFoundError('User not found');
    }


    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        const { token, refreshToken } = createToken(user._id);

        return response.json({
            success: true,
            data: {
                token,
                refreshToken,
                expiresIn: '7d'
            }
        })
    }

    return response.json({ success: false, message: "Invalid credentials" });
}



export const getToken = async(request: any, response: any) => {
    const userId = request.user?.id;

    if(!userId){
        throw BadRequestError('Email and password are required');
    }

    const user = await User.findById(userId);

    if(!user){
        throw NotFoundError('User not found');
    }

    const {token} = createToken(user._id);

    return response.status(200).json({
            success: true,
            data: {
                token,
                expiresIn: '7d'
            }
    });
}