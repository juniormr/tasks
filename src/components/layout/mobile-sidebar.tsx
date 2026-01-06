"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ListTodo, Calendar, Settings, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navigation = [
   { name: "Board", href: "/dashboard", icon: LayoutDashboard },
   { name: "List", href: "/dashboard/list", icon: ListTodo },
   { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
   { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function MobileSidebar() {
   const pathname = usePathname();

   return (
      <Sheet>
         <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
               <LayoutDashboard className="h-5 w-5" />
            </Button>
         </SheetTrigger>
         <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-full flex-col">
               <div className="flex h-14 items-center justify-between border-b px-4">
                  <h1 className="text-xl font-bold">Taskjr</h1>
                  <SheetTrigger asChild>
                     <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                     </Button>
                  </SheetTrigger>
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
            </div>
         </SheetContent>
      </Sheet>
   );
}
