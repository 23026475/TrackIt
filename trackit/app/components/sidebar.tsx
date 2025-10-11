"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, FolderKanban, CheckSquare, Settings, Menu, X } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside
  className={`h-screen bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 shadow-lg transition-all duration-300
  ${isOpen ? "w-64" : "w-20"} flex flex-col`}
>
  {/* Toggle Button */}
  <div className="flex justify-center py-2 border-b border-gray-200 dark:border-gray-700">
    <button
      onClick={toggleSidebar}
      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      {isOpen ? <X size={18} /> : <Menu size={18} />}
    </button>
  </div>

  {/* Nav Links */}
  <nav className="flex-1 border-t border-gray-200 dark:border-gray-700 overflow-y-auto">
  {navItems.map((item) => (
    <div key={item.name} className="relative group">
      <Link
        href={item.href}
        className={`flex items-center px-4 py-3 hover:text-gray-900 hover:bg-gray-200 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md mx-2 ${
          !isOpen && "justify-center"
        }`}
      >
        <item.icon size={20} />
        {isOpen && <span className="ml-3 text-sm font-medium">{item.name}</span>}
      </Link>

      {/* Tooltip when collapsed */}
      {!isOpen && (
        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          {item.name}
        </span>
      )}
    </div>
  ))}
</nav>

</aside>


  );
}
