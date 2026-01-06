"use client";

import { useState } from "react";
import { Task } from "@/store/use-task-store";
import { TaskForm, TimelineView } from "@/components/tasks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function CalendarPage() {
   const [isFormOpen, setIsFormOpen] = useState(false);
   const [editTask, setEditTask] = useState<Task | null>(null);

   const handleEdit = (task: Task) => {
      setEditTask(task);
      setIsFormOpen(true);
   };

   const handleCreate = () => {
      setEditTask(null);
      setIsFormOpen(true);
   };

   const handleOpenChange = (open: boolean) => {
      setIsFormOpen(open);
      if (!open) {
         setEditTask(null);
      }
   };

   return (
      <>
         <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
               <h2 className="text-xl sm:text-2xl font-bold">Calendar</h2>
               <p className="text-xs sm:text-sm text-black/90">View tasks in chronological order</p>
            </div>

            <Button size="sm" onClick={handleCreate}>
               <Plus className="mr-1.5 h-4 w-4" />
               Add Task
            </Button>
         </div>

         <div className="flex-1">
            <TimelineView onEdit={handleEdit} />
         </div>

         <Dialog open={isFormOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-106.25">
               <DialogHeader>
                  <DialogTitle>{editTask ? "Edit Task" : "Create New Task"}</DialogTitle>
               </DialogHeader>
               <TaskForm open={isFormOpen} onOpenChange={handleOpenChange} editTask={editTask} />
            </DialogContent>
         </Dialog>
      </>
   );
}
