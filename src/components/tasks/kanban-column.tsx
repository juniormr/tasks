"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task } from "@/store/use-task-store";
import { TaskCard } from "./task-card";
import { cn } from "@/lib/utils";

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
         className={cn(
            "flex flex-col rounded-lg border bg-muted/30 transition-colors",
            isOver && "bg-muted/50",
            "h-full min-h-[200px]"
         )}
      >
         <div className="flex items-center justify-between border-b p-3">
            <h3 className="font-semibold">{title}</h3>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">{tasks.length}</span>
         </div>

         <SortableContext id={id} items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
               {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={onEdit} />
               ))}
            </div>
         </SortableContext>
      </div>
   );
}
