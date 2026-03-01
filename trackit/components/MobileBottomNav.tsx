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

  // Fixed order:
  // Left: Projects, Research
  // Center: Dashboard
  // Right: History, Settings
  const navItems = [
    { href: '/project', icon: FolderKanban, label: 'Projects', position: 'left' },
    { href: '/research', icon: BookOpen, label: 'Research', position: 'left' },
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', position: 'center' },
    { href: '/history', icon: History, label: 'History', position: 'right' },
    { href: '/settings', icon: Settings, label: 'Settings', position: 'right' },
  ]

  // Don't show on landing page or auth pages
  if (pathname === '/' || pathname === '/login' || pathname === '/register' ||
      pathname === '/forgot-password' || pathname === '/reset-password') {
    return null
  }

  // Split items by position
  const leftItems = navItems.filter(item => item.position === 'left')
  const centerItems = navItems.filter(item => item.position === 'center')
  const rightItems = navItems.filter(item => item.position === 'right')

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="flex items-center justify-between h-16 px-2 max-w-screen-sm mx-auto">
        {/* Left Section - Projects & Research */}
        <div className="flex items-center gap-1">
          {leftItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname?.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center px-2 py-1 group min-w-[60px]"
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
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Center Section - Dashboard (prominent) */}
        <div className="flex items-center justify-center">
          {centerItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center px-3 py-1 group min-w-[70px]"
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

                {/* Icon - Keep same size as others for consistency */}
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

                {/* Label - Keep same size */}
                <span className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-blue-500 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Right Section - History & Settings */}
        <div className="flex items-center gap-1">
          {rightItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname?.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center px-2 py-1 group min-w-[60px]"
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
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}