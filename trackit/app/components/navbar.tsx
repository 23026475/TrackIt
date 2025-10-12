"use client";

import { useState, useEffect } from "react";
import { useTheme } from "./theme-provider";
import { Sun, Moon, Search, ChevronDown } from "lucide-react";
import Image from "next/image";
import logo from "../components/images/logo.png";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase"; // ✅ your auth instance
import { onAuthStateChanged, signOut, type User } from "firebase/auth";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  // State for Firebase user
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const userEmail = user?.email || "User";
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <nav className="flex items-center justify-between px-6 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-colors shadow-sm relative">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <Image src={logo} alt="TrackIt Logo" width={48} height={48} />
      </div>

      {/* Center: Search */}
      <div className="mx-6 w-80">
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects or tasks..."
            className="w-full py-1.5 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
            size={18}
          />
        </div>
      </div>

      {/* Right: Theme toggle + User */}
      <div className="flex items-center gap-4 relative">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-gray-700 dark:text-gray-200 font-semibold"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-bold">
              {userInitial}
            </span>
            <ChevronDown size={14} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
              <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">
                {userEmail}
              </div>
              <button
                onClick={() => router.push("/account")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Account
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
