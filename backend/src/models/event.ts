import mongoose from "mongoose";
import { IEvent } from "../interfaces/event";

const eventSchema = new mongoose.Schema<IEvent>({
    title: {
        type: String,
        required: true
    },

    description: {type: String, required: true},

    tags: { type: [String], default:[]},

    location: {type: String, required: true},

    date: {type: Date, required: true},

    organizerId: { type: String, ref: 'User', required: true},
    banner:{type: String},

    participants: { type: [String], ref:'User', default:[]}
},{timestamps: true});

export const Event = (mongoose.models && mongoose.models.Event) || mongoose.model<IEvent>('Event', eventSchema);