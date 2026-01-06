"use client";

import { useTaskStore } from "@/store/use-task-store";
import { TaskCard } from "./task-card";
import { Task } from "@/store/use-task-store";

interface TaskListProps {
   onEdit: (task: Task) => void;
}

export function TaskList({ onEdit }: TaskListProps) {
   const { tasks, filter, searchQuery, isLoading } = useTaskStore();

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
         {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} />
         ))}
      </div>
   );
}
