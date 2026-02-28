// components/Sidebar.tsx
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  FolderKanban, 
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  History,
  BookOpen
} from 'lucide-react'
import { createClient } from '@/app/lib/supabase/client'
import { useTheme } from 'next-themes'

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const [userEmail, setUserEmail] = useState<string>('')
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
    }
    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/project', icon: FolderKanban },
    { name: 'Research', href: '/research', icon: BookOpen },
    { name: 'Kanban', href: '/kanban', icon: Calendar },
    { name: 'History', href: '/history', icon: History },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const getInitial = () => {
    return userEmail ? userEmail.charAt(0).toUpperCase() : '?'
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className={`h-full ${collapsed ? 'w-20' : 'w-64'} bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col`}>
      {/* Header Section */}
      <div className={`p-4 border-b border-border ${collapsed ? 'px-2' : ''}`}>
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TrackIt
            </span>
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setCollapsed(false)}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              {getInitial()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{userEmail}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname?.startsWith(item.href))
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className={`border-t border-border p-4 ${collapsed ? 'px-2' : ''}`}>
        {!collapsed ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Theme</span>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            </div>
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>

            <p className="text-xs text-muted-foreground text-center pt-2">
              TrackIt v1.0.0
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}