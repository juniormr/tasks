"use client";

import { useState, useEffect } from "react";
import { useTaskStore, Task } from "@/store/use-task-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface TaskFormProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   editTask?: Task | null;
}

export function TaskForm({ open, onOpenChange, editTask }: TaskFormProps) {
   const { addTask, updateTask } = useTaskStore();
   const [isSubmitting, setIsSubmitting] = useState(false);

   const [formData, setFormData] = useState({
      title: "",
      description: "",
      priority: "medium" as Task["priority"],
      due_date: "",
      status: "todo" as Task["status"],
   });

   useEffect(() => {
      if (editTask) {
         setFormData({
            title: editTask.title,
            description: editTask.description || "",
            priority: editTask.priority,
            due_date: editTask.due_date ? new Date(editTask.due_date).toISOString().split("T")[0] : "",
            status: editTask.status,
         });
      } else {
         setFormData({
            title: "",
            description: "",
            priority: "medium",
            due_date: "",
            status: "todo",
         });
      }
   }, [editTask]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
         if (editTask) {
            await updateTask(editTask.id, {
               ...formData,
               due_date: formData.due_date || null,
            });
            toast.success("Task updated", {
               description: "Your task has been updated successfully.",
            });
         } else {
            await addTask({
               ...formData,
               due_date: formData.due_date || null,
            });
            toast.success("Task created", {
               description: "Your new task has been created successfully.",
            });
         }

         onOpenChange(false);
      } catch {
         toast.error("Something went wrong", {
            description: "Please try again.",
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
               <DialogHeader>
                  <DialogTitle>{editTask ? "Edit Task" : "Create New Task"}</DialogTitle>
               </DialogHeader>

               <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                     <Label htmlFor="title">Title</Label>
                     <Input
                        id="title"
                        placeholder="Enter task title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                     />
                  </div>

                  <div className="grid gap-2">
                     <Label htmlFor="description">Description</Label>
                     <Textarea
                        id="description"
                        placeholder="Enter task description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="grid gap-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                           value={formData.priority}
                           onValueChange={(value) => setFormData({ ...formData, priority: value as Task["priority"] })}
                        >
                           <SelectTrigger>
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>

                     <div className="grid gap-2">
                        <Label htmlFor="due_date">Due Date</Label>
                        <Input
                           id="due_date"
                           type="date"
                           value={formData.due_date}
                           onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                        />
                     </div>
                  </div>

                  {editTask && (
                     <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                           value={formData.status}
                           onValueChange={(value) => setFormData({ ...formData, status: value as Task["status"] })}
                        >
                           <SelectTrigger>
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="todo">To Do</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="done">Done</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                  )}
               </div>

               <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                     Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                     {isSubmitting ? "Saving..." : editTask ? "Update" : "Create"}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
