import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
   const d = new Date(date);
   return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
   });
}

export function formatRelativeTime(date: string | Date): string {
   const d = new Date(date);
   const now = new Date();
   const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

   if (Math.abs(diffInSeconds) < 60) {
      return diffInSeconds >= 0 ? "just now" : "in a few seconds";
   }

   const diffInMinutes = Math.floor(diffInSeconds / 60);
   if (Math.abs(diffInMinutes) < 60) {
      if (diffInMinutes >= 0) {
         return diffInMinutes === 1 ? "1m ago" : `${diffInMinutes}m ago`;
      }
      return diffInMinutes === -1 ? "in 1m" : `in ${Math.abs(diffInMinutes)}m`;
   }

   const diffInHours = Math.floor(diffInMinutes / 60);
   if (Math.abs(diffInHours) < 24) {
      if (diffInHours >= 0) {
         return diffInHours === 1 ? "1h ago" : `${diffInHours}h ago`;
      }
      return diffInHours === -1 ? "in 1h" : `in ${Math.abs(diffInHours)}h`;
   }

   const diffInDays = Math.floor(diffInHours / 24);
   if (Math.abs(diffInDays) < 7) {
      if (diffInDays >= 0) {
         return diffInDays === 1 ? "1d ago" : `${diffInDays}d ago`;
      }
      return diffInDays === -1 ? "in 1d" : `in ${Math.abs(diffInDays)}d`;
   }

   return formatDate(d);
}

export function formatDueDate(dateStr: string | null): string {
   if (!dateStr) return "";

   const date = new Date(dateStr);
   const now = new Date();
   const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

   if (diffInDays < -30) {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
   } else if (diffInDays < -1) {
      return `${Math.abs(diffInDays)}d ago`;
   } else if (diffInDays === -1) {
      return "Yesterday";
   } else if (diffInDays === 0) {
      return "Today";
   } else if (diffInDays === 1) {
      return "Tomorrow";
   } else if (diffInDays < 14) {
      return `in ${diffInDays}d`;
   } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
   }
}
