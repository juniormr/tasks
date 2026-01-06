"use client";

import { useTaskStore, Task } from "@/store/use-task-store";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, Flag, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDraggable } from "@dnd-kit/core";

interface TaskCardProps {
   task: Task;
   onEdit: (task: Task) => void;
}

const priorityColors = {
   low: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950",
   medium: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950",
   high: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950",
};

const statusLabels = {
   todo: "To Do",
   in_progress: "In Progress",
   done: "Done",
};

function formatDueDate(dateStr: string | null): string {
   if (!dateStr) return "";

   const date = new Date(dateStr);
   const now = new Date();
   const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

   if (diffInDays < -30) {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
   } else if (diffInDays < -1) {
      return `${Math.abs(diffInDays)}d ago`;
   } else if (diffInDays === -1) {
      return "Yesterday";
   } else if (diffInDays === 0) {
      return "Today";
   } else if (diffInDays === 1) {
      return "Tomorrow";
   } else if (diffInDays < 14) {
      return `in ${diffInDays}d`;
   } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
   }
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
   const { updateTask } = useTaskStore();

   const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
      id: task.id,
   });

   return (
      <div
         ref={setNodeRef}
         {...listeners}
         {...attributes}
         className={cn(
            "group relative transition-all hover:shadow-md touch-manipulation",
            isDragging && "opacity-50 cursor-grabbing"
         )}
      >
         <Card className="cursor-grab active:cursor-grabbing">
            <CardHeader className="pb-2">
               <div className="flex items-start justify-between gap-2">
                  <CardTitle
                     className="line-clamp-2 text-sm font-medium leading-snug cursor-pointer"
                     onClick={() => onEdit(task)}
                  >
                     {task.title}
                  </CardTitle>
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button
                           variant="ghost"
                           size="icon"
                           className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 -mr-1 -mt-1"
                        >
                           <MoreVertical className="h-4 w-4" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(task)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                           onClick={() => useTaskStore.getState().deleteTask(task.id)}
                           className="text-destructive"
                        >
                           Delete
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
               {task.description && <p className="line-clamp-2 text-xs text-muted-foreground">{task.description}</p>}

               <div className="flex flex-wrap items-center gap-2">
                  <TooltipProvider>
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <div
                              className={cn(
                                 "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                                 priorityColors[task.priority]
                              )}
                           >
                              <Flag className="h-3 w-3" />
                              <span className="capitalize">{task.priority}</span>
                           </div>
                        </TooltipTrigger>
                        <TooltipContent>Priority</TooltipContent>
                     </Tooltip>

                     {task.due_date && (
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                 <Calendar className="h-3 w-3" />
                                 <span>{formatDueDate(task.due_date)}</span>
                              </div>
                           </TooltipTrigger>
                           <TooltipContent>
                              Due:{" "}
                              {new Date(task.due_date).toLocaleDateString("en-US", {
                                 weekday: "short",
                                 month: "short",
                                 day: "numeric",
                                 year: "numeric",
                              })}
                           </TooltipContent>
                        </Tooltip>
                     )}

                     <Tooltip>
                        <TooltipTrigger asChild>
                           <div className="text-xs text-muted-foreground ml-auto">{formatRelativeTime(task.created_at)}</div>
                        </TooltipTrigger>
                        <TooltipContent>
                           Created:{" "}
                           {new Date(task.created_at).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                           })}
                        </TooltipContent>
                     </Tooltip>
                  </TooltipProvider>
               </div>

               <Select value={task.status} onValueChange={(value: Task["status"]) => updateTask(task.id, { status: value })}>
                  <SelectTrigger className="h-8 text-xs">
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="todo">{statusLabels.todo}</SelectItem>
                     <SelectItem value="in_progress">{statusLabels.in_progress}</SelectItem>
                     <SelectItem value="done">{statusLabels.done}</SelectItem>
                  </SelectContent>
               </Select>
            </CardContent>
         </Card>
      </div>
   );
}
