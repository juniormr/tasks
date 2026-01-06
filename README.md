# Taskjr - Task Management Application

A modern, full-stack task management application built with Next.js 15+, Supabase, and Tailwind CSS 4.0. Features include user authentication, Kanban board with drag-and-drop, timeline view, and responsive design.

## 🚀 Features

### Core Features

-  **User Authentication** - Secure sign up and sign in with Supabase Auth
-  **Task CRUD Operations** - Create, read, update, and delete tasks
-  **Multiple Views**:
   -  **Kanban Board** - Drag-and-drop task management with dnd-kit
   -  **List View** - Compact task list with easy editing
   -  **Timeline View** - Chronological task display grouped by date
-  **Responsive Design** - Optimized for both desktop and mobile devices

### Optional Enhancements

-  **Dark Mode Toggle** - Manual dark/light mode switching with persistence
-  **Task Filtering** - Filter tasks by status (All, Todo, In Progress, Done)
-  **Task Search** - Real-time search across task titles
-  **Priority Levels** - Low, Medium, and High priority tasks
-  **Optimistic UI Updates** - Instant feedback using Zustand state management

## 🛠️ Tech Stack

-  **Framework**: Next.js 15+ (App Router)
-  **Language**: TypeScript
-  **Database & Auth**: Supabase
-  **Styling**: Tailwind CSS 4.0
-  **State Management**: Zustand
-  **UI Components**: shadcn/ui
-  **Drag & Drop**: dnd-kit
-  **Icons**: Lucide React
-  **Toast Notifications**: Sonner

## 📋 Prerequisites

Before you begin, ensure you have:

-  Node.js 18.17 or later
-  A Supabase account (free tier is sufficient)
-  Git installed

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Navigate to the SQL Editor and run the following schema:

```sql
-- Create the tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Enable realtime for tasks table (optional)
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
```

#### Get Your Credentials

1. Go to Project Settings → API
2. Copy your Project URL and anon public key

### 4. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Design Decisions

### Architecture & Routing

-  **App Router**: Used Next.js 15 App Router with route groups for better organization
-  **Route Groups**: Dashboard routes grouped under `(dashboard)` for layout separation
-  **Server vs Client Components**: Auth checks handled client-side in shared layout for simplicity

### State Management

-  **Zustand**: Chosen for its simplicity and excellent TypeScript support
-  **Centralized Store**: All task state managed in single store for predictable updates
-  **Optimistic Updates**: UI updates immediately while async operations complete in background

### UI/UX Choices

-  **Tailwind CSS 4.0**: Latest Tailwind version with `@theme` directive for cleaner configuration
-  **shadcn/ui**: Reusable, accessible components that can be customized and maintained
-  **Manual Dark Mode**: Implemented without next-themes for better control and learning experience
-  **Mobile-First**: Responsive design with collapsible sidebar and touch-friendly interactions

### Database & Auth

-  **Supabase RLS**: Row Level Security policies ensure data isolation between users
-  **Anonymous Keys**: Used Supabase anon key for client-side operations (safe with RLS)

### Drag & Drop

-  **dnd-kit**: Modern, accessible drag-and-drop library
-  **Drag Overlay**: Smooth visual feedback during drag operations
-  **Cross-column Support**: Tasks can be moved between todo, in_progress, and done columns

## 🔮 What I Would Improve With More Time

### Features

-  **Real-time Updates**: Implement Supabase Realtime for live task synchronization across devices
-  **Task Categories/Tags**: Allow users to organize tasks with custom tags
-  **Due Date Reminders**: Email or browser notifications for upcoming deadlines
-  **Drag & Drop Persistence**: Save drag-and-drop order changes to the database
-  **Task Comments**: Allow users to add comments and discussions on tasks

### Technical Improvements

-  **Server Actions**: Replace client-side mutations with Next.js Server Actions for better performance and security
-  **Error Boundaries**: Add proper error handling with error boundary components
-  **Loading Skeletons**: Improve perceived performance with loading states
-  **Unit Tests**: Add Jest and React Testing Library tests for critical functionality
-  **Accessibility Audit**: WCAG compliance review and improvements

### UI/UX Enhancements

-  **Keyboard Shortcuts**: Add keyboard navigation for power users
-  **Bulk Actions**: Select and perform actions on multiple tasks
-  **Export Features**: Export tasks to CSV or PDF
-  **Drag & Drop Sorting**: Allow reordering within same column

## 📦 Environment Variables

| Variable                        | Description               |
| ------------------------------- | ------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key  |

## 📝 License

This project is for educational and assessment purposes.

## 🙏 Acknowledgments

-  [Next.js Documentation](https://nextjs.org/docs)
-  [Supabase Documentation](https://supabase.com/docs)
-  [Tailwind CSS](https://tailwindcss.com/docs)
-  [shadcn/ui](https://ui.shadcn.com/)
-  [dnd-kit](https://dndkit.com/)
-  [Zustand](https://github.com/pmndrs/zustand)
