import mongoose from "mongoose";
import { IUser } from "../interfaces/user";

const userSchema = new mongoose.Schema<IUser>({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        lowercase: true,
        unique: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please fill a valid email address']
    },
    password:{
        type: String,
        required: true
    },
    dob:{
        type:Date,
        required: true
    },
    role:{
        type: String,
        enum: ['student', 'teacher', 'company', 'admin', 'council'],
        default: 'student'
    },
    department:{
        type: String,
        required: true
    },
    year:{
        type: String,
        required: true
    },
    avatar:{
        type: String
    }
},{
    timestamps: true
});

const User = (mongoose.models && mongoose.models.User) || mongoose.model<IUser>('User', userSchema);

export default User;