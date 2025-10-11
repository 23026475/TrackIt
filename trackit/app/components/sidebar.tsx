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
  className={`h-screen bg-background border-r border-border text-foreground shadow-lg transition-all duration-300
  ${isOpen ? "w-64" : "w-20"} flex flex-col`}
>
  {/* Toggle Button */}
  <div className="flex justify-center py-2 border-b border-border">
    <button
      onClick={toggleSidebar}
      className="p-2 rounded hover:bg-accent-light dark:hover:bg-accent-dark transition-colors"
      aria-label="Toggle sidebar"
    >
      {isOpen ? <X size={18} /> : <Menu size={18} />}
    </button>
  </div>

  {/* Nav Links */}
  <nav className="flex-1 border-t border-border overflow-y-auto">
    {navItems.map((item) => (
      <Link
        key={item.name}
        href={item.href}
        className={`flex items-center px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent-light dark:hover:bg-accent-dark transition-colors rounded-md mx-2 ${
          !isOpen && "justify-center"
        }`}
      >
        <item.icon size={20} className="shrink-0" />
        {isOpen && <span className="ml-3 text-sm font-medium">{item.name}</span>}
      </Link>
    ))}
  </nav>

  {/* Bottom Gradient Indicator */}
  <div className="h-1 bg-gradient-to-r from-primary to-secondary rounded-full m-2 mt-auto opacity-50 transition-all"></div>
</aside>

  );
}
