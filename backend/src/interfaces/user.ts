export interface IUser{
    name: string;
    email: string;
    password: string;
    dob: Date;
    role: 'student' | 'council' | 'teacher' | 'company' | 'admin';
    department: string;
    year: string;
    avatar: string;
}