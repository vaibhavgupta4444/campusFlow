import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from "sonner"
import { useState } from "react"

const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';


const formSchema = z.object({ // defining form schema
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});



const SignIn = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const response = await axios.post(`${backend}/api/user/signin`, {
                email: values.email,
                password: values.password
            });

            if (response.data.success) {
                // Store tokens
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
                
                // Show success message
                toast.success('Login successful! Redirecting...');
                
                // Redirect to homepage after a brief delay
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                toast.error(response.data.message || 'Login failed');
            }
        } catch (error: any) {
            // console.error('Login error:', error);
            
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.response?.status === 403) {
                toast.error('Invalid email or password');
            } else if (error.request) {
                toast.error('Cannot connect to server. Please try again.');
            } else {
                toast.error('An error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="w-full flex justify-center items-center mt-8">
            <Card className="w-full md:w-1/2 lg:w-2/5">
                <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>
                        Enter your email below to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="joe@gmail.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Signing in..." : "Submit"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <p className="text-center w-full text-sm">
                        New Here ? <Link to='/signup' className="text-[#6366F1]">Create Account</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default SignIn