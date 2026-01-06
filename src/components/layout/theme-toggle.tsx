"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
   const [isDark, setIsDark] = useState(false);
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
      // Check system preference and stored preference
      const isDarkMode =
         localStorage.getItem("theme") === "dark" ||
         (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
      setIsDark(isDarkMode);
      if (isDarkMode) {
         document.documentElement.classList.add("dark");
      }
   }, []);

   const toggleTheme = () => {
      const newIsDark = !isDark;
      setIsDark(newIsDark);
      if (newIsDark) {
         document.documentElement.classList.add("dark");
         localStorage.setItem("theme", "dark");
      } else {
         document.documentElement.classList.remove("dark");
         localStorage.setItem("theme", "light");
      }
   };

   // Prevent hydration mismatch
   if (!mounted) {
      return (
         <Button variant="ghost" size="icon" disabled>
            <Sun className="h-5 w-5" />
         </Button>
      );
   }

   return (
      <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
         {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </Button>
   );
}
