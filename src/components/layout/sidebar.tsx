"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ListTodo, Calendar, Settings, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navigation = [
   { name: "Board", href: "/dashboard", icon: LayoutDashboard },
   { name: "List", href: "/dashboard/list", icon: ListTodo },
   { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
   { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
   const pathname = usePathname();
   const router = useRouter();
   const supabase = createClient();

   const handleSignOut = async () => {
      await supabase.auth.signOut();
      router.push("/login");
   };

   return (
      <div className="hidden md:flex h-full w-64 flex-col border-r bg-card">
         <div className="flex h-14 items-center border-b px-4">
            <h1 className="text-xl font-bold text-primary">Taskjr</h1>
         </div>

         <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
               const Icon = item.icon;
               const isActive = pathname === item.href;

               return (
                  <Link
                     key={item.name}
                     href={item.href}
                     className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                           ? "bg-primary text-primary-foreground"
                           : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                     )}
                  >
                     <Icon className="h-5 w-5" />
                     {item.name}
                  </Link>
               );
            })}
         </nav>

         <div className="border-t p-4">
            <button
               onClick={handleSignOut}
               className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
               <LogOut className="h-5 w-5" />
               Sign Out
            </button>
         </div>
      </div>
   );
}
