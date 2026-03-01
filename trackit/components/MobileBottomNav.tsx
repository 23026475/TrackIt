"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  Settings,
  History
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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname?.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-full group"
            >
              {/* Active Indicator Dot */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -top-1 w-1 h-1 rounded-full bg-blue-500 dark:bg-blue-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>

              {/* Icon */}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`p-1.5 rounded-full transition-colors duration-200 ${
                  isActive
                    ? 'text-blue-500 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                }`}
              >
                <Icon className="h-5 w-5" />
              </motion.div>

              {/* Label */}
              <span className={`text-[10px] font-medium transition-colors duration-200 ${
                isActive
                  ? 'text-blue-500 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
              }`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}