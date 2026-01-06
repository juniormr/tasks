"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function LoginPage() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [isSignUp, setIsSignUp] = useState(false);
   const [error, setError] = useState("");
   const router = useRouter();
   const supabase = createClient();

   useEffect(() => {
      const checkSession = async () => {
         const {
            data: { session },
         } = await supabase.auth.getSession();
         if (session) {
            router.push("/dashboard");
         }
      };
      checkSession();
   }, [router, supabase]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      try {
         if (isSignUp) {
            const { error } = await supabase.auth.signUp({
               email,
               password,
            });
            if (error) throw error;
            setError("Check your email for the confirmation link!");
         } else {
            const { error } = await supabase.auth.signInWithPassword({
               email,
               password,
            });
            if (error) throw error;
            router.push("/dashboard");
         }
      } catch (err) {
         setError((err as Error).message);
      } finally {
         setIsLoading(false);
      }
   };

   const handleMagicLink = async () => {
      if (!email) {
         setError("Please enter your email address");
         return;
      }

      setIsLoading(true);
      setError("");

      try {
         const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
               emailRedirectTo: `${location.origin}/auth/callback`,
            },
         });
         if (error) throw error;
         setError("Check your email for the magic link!");
      } catch (err) {
         setError((err as Error).message);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
         <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
               <CardTitle className="text-2xl">Taskjr</CardTitle>
               <CardDescription>{isSignUp ? "Create your account" : "Sign in to your account"}</CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="email">Email</Label>
                     <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="password">Password</Label>
                     <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                     />
                  </div>

                  {error && <p className={`text-sm ${error.includes("Check") ? "text-green-600" : "text-red-600"}`}>{error}</p>}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                     {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
                  </Button>

                  <Button type="button" variant="outline" className="w-full" onClick={handleMagicLink} disabled={isLoading}>
                     Send Magic Link
                  </Button>
               </form>

               <div className="mt-4 text-center text-sm">
                  <button
                     type="button"
                     onClick={() => setIsSignUp(!isSignUp)}
                     className="text-primary underline-offset-4 hover:underline"
                  >
                     {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                  </button>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
