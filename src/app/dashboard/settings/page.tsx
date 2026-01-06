"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
   const [isLoading, setIsLoading] = useState(true);
   const [user, setUser] = useState<any>(null);
   const router = useRouter();
   const supabase = createClient();

   useEffect(() => {
      const checkAuth = async () => {
         const {
            data: { session },
         } = await supabase.auth.getSession();

         if (!session) {
            router.push("/login");
         } else {
            const {
               data: { user },
            } = await supabase.auth.getUser();
            setUser(user);
            setIsLoading(false);
         }
      };

      checkAuth();
   }, [router, supabase]);

   const handleSignOut = async () => {
      await supabase.auth.signOut();
      router.push("/login");
   };

   if (isLoading) {
      return (
         <div className="flex h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
         </div>
      );
   }

   return (
      <div className="flex h-screen overflow-hidden">
         <Sidebar />
         <div className="flex flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto bg-muted/30 p-4">
               <div className="max-w-2xl space-y-6">
                  <div>
                     <h2 className="text-2xl font-bold">Settings</h2>
                     <p className="text-muted-foreground">Manage your account and preferences</p>
                  </div>

                  <Card>
                     <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>Your account information and settings</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="font-medium">Email</p>
                              <p className="text-sm text-muted-foreground">{user?.email || "Loading..."}</p>
                           </div>
                        </div>

                        <div className="pt-4">
                           <Button variant="destructive" onClick={handleSignOut}>
                              Sign Out
                           </Button>
                        </div>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle>About Taskjr</CardTitle>
                        <CardDescription>Information about the application</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <p className="text-sm text-muted-foreground">
                           Taskjr is a simple and intuitive task management application built with Next.js, Supabase, and Tailwind
                           CSS.
                        </p>
                     </CardContent>
                  </Card>
               </div>
            </main>
         </div>
      </div>
   );
}
