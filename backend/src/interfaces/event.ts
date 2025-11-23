export interface IEvent{
    _id?: string;

    title: string;
    description: string;

    tags?: string[];

    location: string;
    date: Date;

    organizerId: string;

    banner?: string;

    participants?: string[];

    createdAt?: Date;
    updatedAt?: Date;
}