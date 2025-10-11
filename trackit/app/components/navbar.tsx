"use client";

import { useTheme } from "./theme-provider";
import { Sun, Moon, User, Search } from "lucide-react";
import Image from "next/image";
import logo from "../components/images/logo.png";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="flex items-center justify-between px-6 py-2 border-b border-muted bg-surface dark:bg-surface-dark transition-colors shadow-sm">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-2">
        <Image src={logo} alt="TrackIt Logo" width={32} height={32} />
        <h1 className="text-lg font-bold text-primary dark:text-primary-dark">TrackIt</h1>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 mx-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects or tasks..."
            className="w-full py-1.5 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark transition-colors"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
        </div>
      </div>

      {/* Right: Theme toggle + User */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-accent-light dark:hover:bg-accent-dark transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button className="p-2 rounded-full bg-accent-light dark:bg-accent-dark shadow hover:shadow-md transition-all">
          <User size={18} />
        </button>
      </div>
    </nav>
  );
}
