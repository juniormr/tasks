"use client";

import { useTaskStore, Task } from "@/store/use-task-store";
import { cn, formatDueDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TaskListProps {
   onEdit: (task: Task) => void;
}

const priorityColors = {
   low: "bg-blue-500",
   medium: "bg-yellow-500",
   high: "bg-red-500",
};

const statusLabels: Record<Task["status"], string> = {
   todo: "To Do",
   in_progress: "In Progress",
   done: "Done",
};

export function TaskList({ onEdit }: TaskListProps) {
   const { tasks, filter, searchQuery, isLoading, updateTask, deleteTask } = useTaskStore();

   const filteredTasks = tasks.filter((task) => {
      const matchesFilter = filter === "all" || task.status === filter;
      const matchesSearch =
         task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
   });

   if (isLoading) {
      return (
         <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
         </div>
      );
   }

   if (filteredTasks.length === 0) {
      return (
         <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
            <p>No tasks found</p>
            {searchQuery && <p className="text-sm">Try adjusting your search or filter</p>}
         </div>
      );
   }

   return (
      <div className="space-y-2">
         {filteredTasks.map((task) => (
            <div
               key={task.id}
               className="group flex items-center gap-4 rounded-lg border bg-card p-3 transition-all hover:shadow-md"
            >
               <div className={cn("flex h-10 w-1 rounded-full self-stretch", priorityColors[task.priority])} />

               <div className="flex-1 min-w-0">
                  <h3
                     className="text-primary font-medium truncate cursor-pointer hover:text-primary/90"
                     onClick={() => onEdit(task)}
                  >
                     {task.title}
                  </h3>
                  {task.description && <p className="text-sm text-muted-foreground truncate">{task.description}</p>}
               </div>

               <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                  {task.due_date && (
                     <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDueDate(task.due_date)}</span>
                     </div>
                  )}
                  <div
                     className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                        task.priority === "high" && "text-red-600 dark:text-red-400",
                        task.priority === "medium" && "text-yellow-600 dark:text-yellow-400",
                        task.priority === "low" && "text-blue-600 dark:text-blue-400"
                     )}
                  >
                     {task.priority}
                  </div>
               </div>

               <div className="flex items-center gap-2">
                  <Select value={task.status} onValueChange={(value: Task["status"]) => updateTask(task.id, { status: value })}>
                     <SelectTrigger className="w-32 h-8 text-xs text-primary">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="todo">{statusLabels.todo}</SelectItem>
                        <SelectItem value="in_progress">{statusLabels.in_progress}</SelectItem>
                        <SelectItem value="done">{statusLabels.done}</SelectItem>
                     </SelectContent>
                  </Select>

                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                           <MoreVertical className="h-4 w-4" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(task)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-destructive">
                           Delete
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </div>
         ))}
      </div>
   );
}
