"use client";

import { useTaskStore } from "@/store/use-task-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, List, LayoutGrid, Calendar, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Header() {
   const { searchQuery, setSearchQuery, view, setView, filter, setFilter, fetchTasks } = useTaskStore();

   return (
      <TooltipProvider>
         <header className="flex h-14 items-center justify-between border-b bg-card px-4">
            <div className="flex items-center gap-4">
               <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                     placeholder="Search tasks..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-64 pl-8"
                  />
               </div>

               <Select value={filter} onValueChange={(value: "all" | "todo" | "in_progress" | "done") => setFilter(value)}>
                  <SelectTrigger className="w-40">
                     <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">All Tasks</SelectItem>
                     <SelectItem value="todo">To Do</SelectItem>
                     <SelectItem value="in_progress">In Progress</SelectItem>
                     <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div className="flex items-center gap-2">
               <div className="flex items-center gap-1 rounded-md border bg-muted/50 p-1">
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           variant={view === "list" ? "default" : "ghost"}
                           size="icon"
                           className="h-8 w-8"
                           onClick={() => setView("list")}
                        >
                           <List className="h-4 w-4" />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>List View</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           variant={view === "kanban" ? "default" : "ghost"}
                           size="icon"
                           className="h-8 w-8"
                           onClick={() => setView("kanban")}
                        >
                           <LayoutGrid className="h-4 w-4" />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>Kanban Board</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           variant={view === "timeline" ? "default" : "ghost"}
                           size="icon"
                           className="h-8 w-8"
                           onClick={() => setView("timeline")}
                        >
                           <Calendar className="h-4 w-4" />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>Timeline View</TooltipContent>
                  </Tooltip>
               </div>

               <Button onClick={fetchTasks} variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Refresh
               </Button>
            </div>
         </header>
      </TooltipProvider>
   );
}
