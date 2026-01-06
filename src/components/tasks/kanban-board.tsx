"use client";

import {
   DndContext,
   DragOverlay,
   DragStartEvent,
   DragEndEvent,
   MouseSensor,
   TouchSensor,
   useSensor,
   useSensors,
   closestCorners,
} from "@dnd-kit/core";
import { useState } from "react";
import { useTaskStore, Task } from "@/store/use-task-store";
import { KanbanColumn } from "./kanban-column";
import { TaskCard } from "./task-card";
import { createPortal } from "react-dom";

interface KanbanBoardProps {
   onEdit: (task: Task) => void;
}

export function KanbanBoard({ onEdit }: KanbanBoardProps) {
   const { tasks, updateTask, filter, searchQuery } = useTaskStore();
   const [activeTask, setActiveTask] = useState<Task | null>(null);

   const sensors = useSensors(
      useSensor(MouseSensor, {
         activationConstraint: {
            distance: 10,
         },
      }),
      useSensor(TouchSensor, {
         activationConstraint: {
            delay: 250,
            tolerance: 5,
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
      const { active } = event;
      const task = tasks.find((t) => t.id === active.id);
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

      if (newStatus && ["todo", "in_progress", "done"].includes(newStatus)) {
         const task = tasks.find((t) => t.id === taskId);
         if (task && task.status !== newStatus) {
            updateTask(taskId, { status: newStatus });
         }
      }
   };

   return (
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
         <div className="grid gap-4 h-full md:grid-cols-3">
            <KanbanColumn id="todo" title="To Do" tasks={todoTasks} onEdit={onEdit} />
            <KanbanColumn id="in_progress" title="In Progress" tasks={inProgressTasks} onEdit={onEdit} />
            <KanbanColumn id="done" title="Done" tasks={doneTasks} onEdit={onEdit} />
         </div>

         {typeof window !== "undefined" &&
            createPortal(
               <DragOverlay>
                  {activeTask && (
                     <div className="opacity-80 rotate-2 cursor-grabbing">
                        <TaskCard task={activeTask} onEdit={() => {}} />
                     </div>
                  )}
               </DragOverlay>,
               document.body
            )}
      </DndContext>
   );
}
