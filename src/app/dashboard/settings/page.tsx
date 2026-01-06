"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

export default function SettingsPage() {
   const [user, setUser] = useState<User | null>(null);
   const supabase = createClient();

   useEffect(() => {
      const getUser = async () => {
         const {
            data: { user },
         } = await supabase.auth.getUser();
         setUser(user);
      };
      getUser();
   }, [supabase]);

   const handleSignOut = async () => {
      await supabase.auth.signOut();
      window.location.href = "/login";
   };

   return (
      <div className="max-w-2xl space-y-6">
         <div>
            <h2 className="text-2xl font-bold">Settings</h2>
            <p className="text-black/90">Manage your account and preferences</p>
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
                     <p className="text-sm text-muted-foreground">{user?.email ?? "Loading..."}</p>
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
                  Taskjr is a simple and intuitive task management application built with Next.js, Supabase, and Tailwind CSS.
               </p>
            </CardContent>
         </Card>
      </div>
   );
}
