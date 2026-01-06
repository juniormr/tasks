"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useTaskStore } from "@/store/use-task-store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
   const [isLoading, setIsLoading] = useState(true);
   const router = useRouter();
   const supabase = createClient();
   const { fetchTasks } = useTaskStore();

   useEffect(() => {
      const checkAuth = async () => {
         const {
            data: { session },
         } = await supabase.auth.getSession();

         if (!session) {
            router.push("/login");
         } else {
            await fetchTasks();
            setIsLoading(false);
         }
      };

      checkAuth();
   }, [router, fetchTasks, supabase]);

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
            <main className="flex-1 overflow-y-auto bg-muted/30 p-3 sm:p-4">{children}</main>
         </div>
      </div>
   );
}
