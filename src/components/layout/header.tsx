"use client";

import { useTaskStore } from "@/store/use-task-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "./theme-toggle";
import { MobileSidebar } from "./mobile-sidebar";

export function Header() {
   const { searchQuery, setSearchQuery, filter, setFilter, fetchTasks } = useTaskStore();

   return (
      <header className="flex h-14 items-center justify-between gap-2 border-b bg-card px-4">
         {/* Left side - Mobile menu + Search */}
         <div className="flex items-center gap-2 flex-1 min-w-0">
            <MobileSidebar />

            <div className="relative hidden sm:block flex-1 max-w-md">
               <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
               <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
               />
            </div>
         </div>

         {/* Right side - Filter + Theme */}
         <div className="flex items-center gap-2 text-primary">
            <Select value={filter} onValueChange={(value: "all" | "todo" | "in_progress" | "done") => setFilter(value)}>
               <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
               </SelectContent>
            </Select>

            <Button onClick={fetchTasks} variant="outline" size="sm">
               <Filter className="mr-2 h-4 w-4" />
               Refresh
            </Button>

            <ThemeToggle />
         </div>
      </header>
   );
}
