"use client";

import { useTheme } from "./theme-provider";
import { Sun, Moon, User } from "lucide-react";
import Image from "next/image";
import logo from "../components/images/logo.png"; // path to your logo


export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
  {/* Left: Logo + Title */}
  <div className="flex items-center gap-2">
    <Image src={logo} alt="TrackIt Logo" width={40} height={40} />
    <h1 className="text-xl font-bold dark:text-white">TrackIt</h1>
  </div>

  {/* Right: Theme toggle + User */}
  <div className="flex items-center gap-4">
    <button
      onClick={toggleTheme}
      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
    <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
      <User size={20} />
    </button>
  </div>
</nav>
  );
}
