"use client";

import { useTaskStore, Task } from "@/store/use-task-store";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Flag, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TimelineViewProps {
   onEdit: (task: Task) => void;
}

const priorityColors = {
   low: "border-l-blue-500 bg-blue-50 dark:bg-blue-950",
   medium: "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950",
   high: "border-l-red-500 bg-red-50 dark:bg-red-950",
};

const statusLabels = {
   todo: "To Do",
   in_progress: "In Progress",
   done: "Done",
};

function getDateLabel(dateStr: string | null): { label: string; date: Date | null } {
   if (!dateStr) return { label: "No Date", date: null };

   const date = new Date(dateStr);
   const now = new Date();
   const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
   const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

   const diffInDays = Math.floor((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

   if (diffInDays === -1) return { label: "Yesterday", date: date };
   if (diffInDays === 0) return { label: "Today", date: date };
   if (diffInDays === 1) return { label: "Tomorrow", date: date };
   if (diffInDays > 1 && diffInDays <= 7) return { label: `This Week`, date: date };
   if (diffInDays > 7 && diffInDays <= 14) return { label: "Next Week", date: date };
   if (diffInDays > 14 && diffInDays <= 30) return { label: "This Month", date: date };

   return { label: formatDate(date), date: date };
}

export function TimelineView({ onEdit }: TimelineViewProps) {
   const { tasks, filter, searchQuery, updateTask } = useTaskStore();

   const filteredTasks = tasks
      .filter((task) => {
         const matchesFilter = filter === "all" || task.status === filter;
         const matchesSearch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase());
         return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
         if (a.due_date && b.due_date) {
            return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
         }
         if (a.due_date) return -1;
         if (b.due_date) return 1;
         return 0;
      });

   if (filteredTasks.length === 0) {
      return (
         <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
            <p>No tasks found</p>
         </div>
      );
   }

   // Group tasks by date
   const groupedTasks = filteredTasks.reduce((groups, task) => {
      const { label } = getDateLabel(task.due_date);
      if (!groups[label]) {
         groups[label] = [];
      }
      groups[label].push(task);
      return groups;
   }, {} as Record<string, Task[]>);

   // Sort groups by date
   const sortedGroups = Object.entries(groupedTasks).sort((a, b) => {
      const dateA = a[1][0].due_date ? new Date(a[1][0].due_date).getTime() : Infinity;
      const dateB = b[1][0].due_date ? new Date(b[1][0].due_date).getTime() : Infinity;
      return dateA - dateB;
   });

   return (
      <div className="space-y-6">
         {sortedGroups.map(([dateLabel, dateTasks]) => (
            <div key={dateLabel}>
               {/* Date separator */}
               <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                     <Calendar className="h-4 w-4" />
                     {dateLabel}
                  </div>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">
                     {dateTasks.length} {dateTasks.length === 1 ? "task" : "tasks"}
                  </span>
               </div>

               {/* Tasks for this date */}
               <div className="space-y-3">
                  {dateTasks.map((task) => (
                     <Card
                        key={task.id}
                        className={cn("cursor-pointer border-l-4 transition-all hover:shadow-md", priorityColors[task.priority])}
                        onClick={() => onEdit(task)}
                     >
                        <CardHeader className="pb-2">
                           <div className="flex items-start justify-between">
                              <CardTitle className="text-base">{task.title}</CardTitle>
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button
                                       variant="ghost"
                                       size="icon"
                                       className="h-8 w-8 -mr-2 -mt-2"
                                       onClick={(e) => e.stopPropagation()}
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
                        <CardContent>
                           <div className="flex items-center justify-between gap-4">
                              {task.description && (
                                 <p className="line-clamp-1 text-sm text-muted-foreground flex-1">{task.description}</p>
                              )}

                              <div className="flex items-center gap-2">
                                 <div
                                    className={cn(
                                       "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                                       task.priority === "high" && "text-red-600 dark:text-red-400",
                                       task.priority === "medium" && "text-yellow-600 dark:text-yellow-400",
                                       task.priority === "low" && "text-blue-600 dark:text-blue-400"
                                    )}
                                 >
                                    <Flag className="h-3 w-3 inline mr-1" />
                                    {task.priority}
                                 </div>

                                 <Select
                                    value={task.status}
                                    onValueChange={(value: Task["status"]) => {
                                       updateTask(task.id, { status: value });
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                 >
                                    <SelectTrigger className="w-28 h-7 text-xs" onClick={(e) => e.stopPropagation()}>
                                       <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="todo">{statusLabels.todo}</SelectItem>
                                       <SelectItem value="in_progress">{statusLabels.in_progress}</SelectItem>
                                       <SelectItem value="done">{statusLabels.done}</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </div>
         ))}
      </div>
   );
}
