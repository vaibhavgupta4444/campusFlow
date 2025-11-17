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
import { Link, useNavigate } from "react-router-dom"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import axios from "axios"
import { toast } from "sonner"
import { useState } from "react"

const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';



const formSchema = z.object({ // defining form schema
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  dob: z.string().refine((d) => !Number.isNaN(Date.parse(d)), { message: 'Invalid date' }),
  role: z.enum(['student', 'teacher', 'company', 'admin']).optional(),
  department: z.string().min(1, 'Department is required'),
  year: z.string().min(1, 'Year is required'),
})

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      dob: "",
      role: "student",
      department: "",
      year: ""
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await axios.post(`${backend}/api/user/signup`, {
        name: values.name,
        email: values.email,
        password: values.password,
        dob: values.dob,
        role: values.role || "student",
        department: values.department,
        year: values.year
      });

      if (response.data.success) {
        toast.success('Account created successfully! Redirecting to sign in...');
        
        // Redirect to signin page after successful signup
        setTimeout(() => {
          navigate('/signin');
        }, 1500);
      } else {
        toast.error(response.data.message || 'Signup failed');
      }
    } catch (error: any) {
      // console.error('Signup error:', error);
      
      if (error.response?.data?.errors) {
        // Handle Zod validation errors from backend
        const errors = error.response.data.errors;
        errors.forEach((err: any) => {
          toast.error(`${err.path.join('.')}: ${err.message}`);
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 409) {
        toast.error('An account with this email already exists');
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
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Join the campus community today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Joe Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      <Input type="password" placeholder="xS5Qd@3#" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />



              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1st">1st Year</SelectItem>
                          <SelectItem value="2nd">2nd Year</SelectItem>
                          <SelectItem value="3rd">3rd Year</SelectItem>
                          <SelectItem value="4th">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              field.onChange(date ? date.toISOString() : "")
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Computer Science And Engineering" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I am a</FormLabel>
                    <FormControl>
                      <RadioGroup defaultValue="student" onValueChange={field.onChange}>
                        <Label htmlFor="student" className="cursor-pointer">
                          <RadioGroupItem value="student" id="student" className="w-full">
                            <span className="text-sm font-medium">Student</span>
                          </RadioGroupItem>
                        </Label>
                        <Label htmlFor="teacher" className="cursor-pointer">
                          <RadioGroupItem value="teacher" id="teacher" className="w-full">
                            <span className="text-sm font-medium">Teacher</span>
                          </RadioGroupItem>
                        </Label>
                        <Label htmlFor="company" className="cursor-pointer">
                          <RadioGroupItem value="company" id="company" className="w-full">
                            <span className="text-sm font-medium">Company</span>
                          </RadioGroupItem>
                        </Label>
                        <Label htmlFor="admin" className="cursor-pointer">
                          <RadioGroupItem value="admin" id="admin" className="w-full">
                            <span className="text-sm font-medium">Admin</span>
                          </RadioGroupItem>
                        </Label>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-center w-full text-sm">
            Already have an account? <Link to='/signin' className="text-[#6366F1]">Sign In</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignUp