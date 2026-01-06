"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useTaskStore } from "@/store/use-task-store";
import { TaskForm, KanbanBoard, TimelineView } from "@/components/tasks";
import { TaskList } from "@/components/tasks/task-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function DashboardPage() {
   const { view, fetchTasks } = useTaskStore();
   const router = useRouter();
   const supabase = createClient();
   const [isLoading, setIsLoading] = useState(true);
   const [isFormOpen, setIsFormOpen] = useState(false);
   const [editTask, setEditTask] = useState(null);

   useEffect(() => {
      const checkAuth = async () => {
         const {
            data: { session },
         } = await supabase.auth.getSession();

         if (!session) {
            router.push("/login");
         } else {
            await fetchTasks();
            setIsLoading(false);
         }
      };

      checkAuth();
   }, [router, fetchTasks, supabase]);

   const handleEdit = (task: any) => {
      setEditTask(task);
      setIsFormOpen(true);
   };

   const handleCreate = () => {
      setEditTask(null);
      setIsFormOpen(true);
   };

   if (isLoading) {
      return (
         <div className="flex h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
         </div>
      );
   }

   return (
      <div className="flex h-screen overflow-hidden">
         <Sidebar />
         <div className="flex flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto bg-muted/30 p-3 sm:p-4">
               <div className="flex h-full flex-col">
                  <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                     <div>
                        <h2 className="text-xl sm:text-2xl font-bold">My Tasks</h2>
                        <p className="text-xs sm:text-sm text-muted-foreground">Manage and organize your tasks efficiently</p>
                     </div>

                     <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                           <Button size="sm" onClick={handleCreate}>
                              <Plus className="mr-1.5 h-4 w-4" />
                              <span className="hidden sm:inline">Add Task</span>
                              <span className="sm:hidden">Add</span>
                           </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                           <DialogHeader>
                              <DialogTitle>{editTask ? "Edit Task" : "Create New Task"}</DialogTitle>
                           </DialogHeader>
                           <TaskForm open={isFormOpen} onOpenChange={setIsFormOpen} editTask={editTask} />
                        </DialogContent>
                     </Dialog>
                  </div>

                  <div className="flex-1">
                     {view === "list" && <TaskList onEdit={handleEdit} />}
                     {view === "kanban" && <KanbanBoard onEdit={handleEdit} />}
                     {view === "timeline" && <TimelineView onEdit={handleEdit} />}
                  </div>
               </div>
            </main>
         </div>
      </div>
   );
}
