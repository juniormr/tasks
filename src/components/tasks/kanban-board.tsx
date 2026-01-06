"use client";

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import { useTaskStore, Task } from "@/store/use-task-store";
import { KanbanColumn } from "./kanban-column";
import { TaskCard } from "./task-card";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

interface KanbanBoardProps {
   onEdit: (task: Task) => void;
}

export function KanbanBoard({ onEdit }: KanbanBoardProps) {
   const { tasks, updateTask, filter, searchQuery } = useTaskStore();
   const [activeTask, setActiveTask] = useState<Task | null>(null);
   const isMobile = useMediaQuery("(max-width: 768px)");

   const sensors = useSensors(
      useSensor(PointerSensor, {
         activationConstraint: {
            distance: 8,
         },
      })
   );

   const filteredTasks = tasks.filter((task) => {
      const matchesFilter = filter === "all" || task.status === filter;
      const matchesSearch =
         task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
   });

   const todoTasks = filteredTasks.filter((t) => t.status === "todo");
   const inProgressTasks = filteredTasks.filter((t) => t.status === "in_progress");
   const doneTasks = filteredTasks.filter((t) => t.status === "done");

   const handleDragStart = (event: DragStartEvent) => {
      const task = tasks.find((t) => t.id === event.active.id);
      if (task) {
         setActiveTask(task);
      }
   };

   const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);

      if (!over) return;

      const taskId = active.id as string;
      const newStatus = over.id as Task["status"];

      const task = tasks.find((t) => t.id === taskId);
      if (task && task.status !== newStatus) {
         updateTask(taskId, { status: newStatus });
      }
   };

   return (
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
         <div className={cn("grid gap-4 h-full", isMobile ? "grid-cols-1" : "md:grid-cols-3")}>
            <KanbanColumn id="todo" title="To Do" tasks={todoTasks} onEdit={onEdit} />
            <KanbanColumn id="in_progress" title="In Progress" tasks={inProgressTasks} onEdit={onEdit} />
            <KanbanColumn id="done" title="Done" tasks={doneTasks} onEdit={onEdit} />
         </div>

         <DragOverlay>
            {activeTask && (
               <div className={cn("rotate-2 cursor-grabbing opacity-80", isMobile && "scale-105")}>
                  <TaskCard task={activeTask} onEdit={() => {}} />
               </div>
            )}
         </DragOverlay>
      </DndContext>
   );
}
