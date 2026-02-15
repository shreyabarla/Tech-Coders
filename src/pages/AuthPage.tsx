import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const signInSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
    rememberMe: z.boolean().default(false),
});

const signUpSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

const AuthPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const signInForm = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const signUpForm = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSignIn = async (data: SignInValues) => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to sign in");
            }

            // Store token and user data
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            toast.success("Welcome back!", {
                description: "You have successfully signed in.",
            });
            navigate("/dashboard");
        } catch (error: any) {
            toast.error("Sign in failed", {
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onSignUp = async (data: SignUpValues) => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to create account");
            }

            toast.success("Account created!", {
                description: "Please sign in with your new account.",
            });

            // Switch to sign in tab
            // For now, we just let them switch manually or auto-login them?
            // User requirement: "get a mail... separate data". 
            // Better to let them sign in to verify.
        } catch (error: any) {
            toast.error("Sign up failed", {
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent" />

                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-2 mb-10">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-white">FinVault</span>
                    </Link>
                </div>

                <div className="relative z-10 max-w-md">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Manage your finances with confidence and clarity.
                    </h2>
                    <div className="space-y-4">
                        {[
                            "Real-time expense tracking",
                            "Smart investment insights",
                            "Automated tax planning",
                            "Bank-grade security",
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-3 text-zinc-300">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-zinc-400 text-sm">
                    © 2026 FinVault. All rights reserved.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-6 bg-background">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-2xl font-bold tracking-tight">Welcome to FinVault</h1>
                        <p className="text-muted-foreground mt-2">
                            Sign in to access your dashboard or create a new account.
                        </p>
                    </div>

                    <Tabs defaultValue="signin" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="signin">Sign In</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="signin">
                            <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signin-email">Email</Label>
                                    <Input
                                        id="signin-email"
                                        placeholder="name@example.com"
                                        type="email"
                                        {...signInForm.register("email")}
                                    />
                                    {signInForm.formState.errors.email && (
                                        <p className="text-sm text-destructive">{signInForm.formState.errors.email.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="signin-password">Password</Label>
                                        <Link to="#" className="text-sm text-primary hover:underline">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="signin-password"
                                            type={showPassword ? "text" : "password"}
                                            {...signInForm.register("password")}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {signInForm.formState.errors.password && (
                                        <p className="text-sm text-destructive">{signInForm.formState.errors.password.message}</p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        checked={signInForm.watch("rememberMe")}
                                        onCheckedChange={(checked) => signInForm.setValue("rememberMe", checked as boolean)}
                                    />
                                    <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                                        Remember me for 30 days
                                    </Label>
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                    Sign In
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="signup">
                            <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-name">Full Name</Label>
                                    <Input
                                        id="signup-name"
                                        placeholder="John Doe"
                                        {...signUpForm.register("name")}
                                    />
                                    {signUpForm.formState.errors.name && (
                                        <p className="text-sm text-destructive">{signUpForm.formState.errors.name.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <Input
                                        id="signup-email"
                                        placeholder="name@example.com"
                                        type="email"
                                        {...signUpForm.register("email")}
                                    />
                                    {signUpForm.formState.errors.email && (
                                        <p className="text-sm text-destructive">{signUpForm.formState.errors.email.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="signup-password"
                                            type={showPassword ? "text" : "password"}
                                            {...signUpForm.register("password")}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {signUpForm.formState.errors.password && (
                                        <p className="text-sm text-destructive">{signUpForm.formState.errors.password.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                                    <Input
                                        id="signup-confirm"
                                        type="password"
                                        {...signUpForm.register("confirmPassword")}
                                    />
                                    {signUpForm.formState.errors.confirmPassword && (
                                        <p className="text-sm text-destructive">{signUpForm.formState.errors.confirmPassword.message}</p>
                                    )}
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                    Create Account
                                </Button>
                            </form>
                            <p className="text-xs text-muted-foreground text-center mt-4">
                                By clicking "Create Account", you agree to our{" "}
                                <Link to="#" className="underline hover:text-primary">Terms of Service</Link> and{" "}
                                <Link to="#" className="underline hover:text-primary">Privacy Policy</Link>.
                            </p>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
