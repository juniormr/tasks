"use client";

import { useState } from "react";
import { TaskForm, TaskList } from "@/components/tasks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ListPage() {
   const [isFormOpen, setIsFormOpen] = useState(false);
   const [editTask, setEditTask] = useState(null);

   const handleEdit = (task: any) => {
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
               <h2 className="text-xl sm:text-2xl font-bold">List</h2>
               <p className="text-xs sm:text-sm text-muted-foreground">View all tasks in a list format</p>
            </div>

            <Button size="sm" onClick={handleCreate}>
               <Plus className="mr-1.5 h-4 w-4" />
               Add Task
            </Button>
         </div>

         <div className="flex-1">
            <TaskList onEdit={handleEdit} />
         </div>

         <Dialog open={isFormOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
               <DialogHeader>
                  <DialogTitle>{editTask ? "Edit Task" : "Create New Task"}</DialogTitle>
               </DialogHeader>
               <TaskForm open={isFormOpen} onOpenChange={handleOpenChange} editTask={editTask} />
            </DialogContent>
         </Dialog>
      </>
   );
}
