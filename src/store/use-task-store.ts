import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";

export interface Task {
   id: string;
   user_id: string;
   title: string;
   description: string | null;
   status: "todo" | "in_progress" | "done";
   priority: "low" | "medium" | "high";
   due_date: string | null;
   created_at: string;
   updated_at: string;
}

interface TaskState {
   tasks: Task[];
   isLoading: boolean;
   error: string | null;
   filter: "all" | "todo" | "in_progress" | "done";
   searchQuery: string;
   view: "list" | "kanban" | "timeline";
   fetchTasks: () => Promise<void>;
   addTask: (task: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => Promise<void>;
   updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
   deleteTask: (id: string) => Promise<void>;
   setFilter: (filter: "all" | "todo" | "in_progress" | "done") => void;
   setSearchQuery: (query: string) => void;
   setView: (view: "list" | "kanban" | "timeline") => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
   tasks: [],
   isLoading: false,
   error: null,
   filter: "all",
   searchQuery: "",
   view: "list",

   fetchTasks: async () => {
      set({ isLoading: true, error: null });
      try {
         const supabase = createClient();
         const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });

         if (error) throw error;
         set({ tasks: data as Task[], isLoading: false });
      } catch (error) {
         set({ error: (error as Error).message, isLoading: false });
      }
   },

   addTask: async (taskData) => {
      const supabase = createClient();
      const tempId = crypto.randomUUID();
      const optimisticTask: Task = {
         ...taskData,
         id: tempId,
         user_id: "",
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
      };

      set((state) => ({
         tasks: [optimisticTask, ...state.tasks],
      }));

      try {
         const { data, error } = await supabase.from("tasks").insert(taskData).select().single();

         if (error) throw error;

         set((state) => ({
            tasks: state.tasks.map((t) => (t.id === tempId ? (data as Task) : t)),
         }));
      } catch (error) {
         set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== tempId),
            error: (error as Error).message,
         }));
      }
   },

   updateTask: async (id, updates) => {
      const originalTask = get().tasks.find((t) => t.id === id);
      if (!originalTask) return;

      set((state) => ({
         tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t)),
      }));

      try {
         const supabase = createClient();
         const { error } = await supabase.from("tasks").update(updates).eq("id", id);

         if (error) throw error;
      } catch (error) {
         set((state) => ({
            tasks: state.tasks.map((t) => (t.id === id ? originalTask : t)),
            error: (error as Error).message,
         }));
      }
   },

   deleteTask: async (id) => {
      const originalTasks = get().tasks;
      set((state) => ({
         tasks: state.tasks.filter((t) => t.id !== id),
      }));

      try {
         const supabase = createClient();
         const { error } = await supabase.from("tasks").delete().eq("id", id);

         if (error) throw error;
      } catch (error) {
         set({ tasks: originalTasks, error: (error as Error).message });
      }
   },

   setFilter: (filter) => set({ filter }),
   setSearchQuery: (searchQuery) => set({ searchQuery }),
   setView: (view) => set({ view }),
}));
