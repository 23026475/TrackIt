"use client";

import { useTheme } from "./theme-provider";
import { Sun, Moon, User } from "lucide-react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <h1 className="text-xl font-bold">TrackIt</h1>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition">
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
          <User size={20} />
        </button>
      </div>
    </nav>
  );
}
