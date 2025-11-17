import mongoose from "mongoose";

export interface IUser{
    name: string;
    email: string;
    password: string;
    dob: Date;
    role: 'student' | 'teacher' | 'company' | 'admin';
    department: string;
    year: string;
    avatar: string;
}

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
        enum: ['student', 'teacher', 'company', 'admin'],
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