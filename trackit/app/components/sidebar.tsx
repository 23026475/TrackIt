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
      className={`h-screen bg-background border-r border-border text-foreground transition-all duration-300 
      ${isOpen ? "w-64" : "w-20"} flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2
          className={`font-bold text-lg transition-all duration-200 ${
            !isOpen && "opacity-0 hidden"
          }`}
        >
          TrackIt
        </h2>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded hover:bg-muted transition"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted transition rounded-md mx-2"
          >
            <item.icon size={20} className="mr-3 shrink-0" />
            {isOpen && <span className="text-sm font-medium">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
