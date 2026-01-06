"use client";

import { useDroppable } from "@dnd-kit/core";
import { Task } from "@/store/use-task-store";
import { TaskCard } from "./task-card";

interface KanbanColumnProps {
   id: string;
   title: string;
   tasks: Task[];
   onEdit: (task: Task) => void;
}

export function KanbanColumn({ id, title, tasks, onEdit }: KanbanColumnProps) {
   const { setNodeRef, isOver } = useDroppable({ id });

   return (
      <div
         ref={setNodeRef}
         className={`flex flex-col rounded-lg border bg-muted/30 transition-colors min-h-50 ${
            isOver ? "bg-muted/50 ring-2 ring-primary" : ""
         }`}
      >
         <div className="flex items-center justify-between border-b p-3">
            <h3 className="font-semibold">{title}</h3>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-primary">{tasks.length}</span>
         </div>

         <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {tasks.map((task) => (
               <TaskCard key={task.id} task={task} onEdit={onEdit} />
            ))}
         </div>
      </div>
   );
}
