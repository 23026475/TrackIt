"use client";

import { useTheme } from "./theme-provider";
import { Sun, Moon, User, Search } from "lucide-react";
import Image from "next/image";
import logo from "../components/images/logo.png";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="flex items-center justify-between px-6 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-colors shadow-sm">
  {/* Left: Logo */}
  <div className="flex items-center gap-2">
    <Image src={logo} alt="TrackIt Logo" width={48} height={48} /> {/* increased */}
  </div>

  {/* Center: Search */}
  <div className="mx-6 w-80">
    <div className="relative">
      <input
        type="text"
        placeholder="Search projects or tasks..."
        className="w-full py-1.5 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
    </div>
  </div>

  {/* Right: Theme toggle + User */}
  <div className="flex items-center gap-3">
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
    <button className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 shadow hover:shadow-md transition-all text-gray-700 dark:text-gray-200">
      <User size={18} />
    </button>
  </div>
</nav>

  );
}
