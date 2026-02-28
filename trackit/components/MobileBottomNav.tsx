// components/MobileBottomNav.tsx
"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FolderKanban, 
  BookOpen,
  Settings,
  History,
  Calendar
} from 'lucide-react'

export function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/project', icon: FolderKanban, label: 'Projects' },
    { href: '/research', icon: BookOpen, label: 'Research' },
    { href: '/history', icon: History, label: 'History' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  // Don't show on landing page or auth pages
  if (pathname === '/' || pathname === '/login' || pathname === '/register' || 
      pathname === '/forgot-password' || pathname === '/reset-password') {
    return null
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname?.startsWith(item.href))
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}