"use client";

import { useTaskStore, Task } from "@/store/use-task-store";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, Flag, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TaskCardProps {
   task: Task;
   onEdit: (task: Task) => void;
}

const priorityColors = {
   low: "text-blue-500 bg-blue-50",
   medium: "text-yellow-500 bg-yellow-50",
   high: "text-red-500 bg-red-50",
};

const statusLabels = {
   todo: "To Do",
   in_progress: "In Progress",
   done: "Done",
};

export function TaskCard({ task, onEdit }: TaskCardProps) {
   const { updateTask } = useTaskStore();

   return (
      <Card className="group relative transition-all hover:shadow-md">
         <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
               <CardTitle className="line-clamp-2 text-sm font-medium" onClick={() => onEdit(task)}>
                  {task.title}
               </CardTitle>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100">
                        <MoreVertical className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem onClick={() => onEdit(task)}>Edit</DropdownMenuItem>
                     <DropdownMenuItem onClick={() => useTaskStore.getState().deleteTask(task.id)} className="text-destructive">
                        Delete
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </CardHeader>
         <CardContent className="space-y-3">
            {task.description && <p className="line-clamp-2 text-xs text-muted-foreground">{task.description}</p>}

            <div className="flex flex-wrap items-center gap-2">
               <TooltipProvider>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <div
                           className={cn(
                              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                              priorityColors[task.priority]
                           )}
                        >
                           <Flag className="h-3 w-3" />
                           {task.priority}
                        </div>
                     </TooltipTrigger>
                     <TooltipContent>Priority</TooltipContent>
                  </Tooltip>

                  {task.due_date && (
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {formatRelativeTime(task.due_date)}
                           </div>
                        </TooltipTrigger>
                        <TooltipContent>Due Date</TooltipContent>
                     </Tooltip>
                  )}

                  <Tooltip>
                     <TooltipTrigger asChild>
                        <div className="text-xs text-muted-foreground">{formatRelativeTime(task.created_at)}</div>
                     </TooltipTrigger>
                     <TooltipContent>Created</TooltipContent>
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
   );
}
