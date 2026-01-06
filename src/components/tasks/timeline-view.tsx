"use client";

import { useTaskStore, Task } from "@/store/use-task-store";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineViewProps {
   onEdit: (task: Task) => void;
}

const statusColors = {
   todo: "border-l-blue-500",
   in_progress: "border-l-yellow-500",
   done: "border-l-green-500",
};

export function TimelineView({ onEdit }: TimelineViewProps) {
   const { tasks, filter, searchQuery } = useTaskStore();

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

   return (
      <div className="space-y-4">
         {filteredTasks.map((task) => (
            <Card
               key={task.id}
               className={cn("cursor-pointer border-l-4 transition-all hover:shadow-md", statusColors[task.status])}
               onClick={() => onEdit(task)}
            >
               <CardHeader className="pb-2">
                  <CardTitle className="text-base">{task.title}</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                     <span className="capitalize">{task.status.replace("_", " ")}</span>
                     {task.due_date && <span>Due: {formatRelativeTime(task.due_date)}</span>}
                  </div>
                  {task.description && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>}
               </CardContent>
            </Card>
         ))}
      </div>
   );
}
