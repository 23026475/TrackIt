"use client"

import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { LandingNavbar } from './LandingNavbar'
import { LandingFooter } from './LandingFooter'
import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase/client'
import { MobileBottomNav } from './MobileBottomNav'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const publicPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password']
  const isPublicPath = publicPaths.includes(pathname)

  if (isAuthenticated === null && !isPublicPath) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (pathname === '/') {
    return (
      <div className="min-h-screen flex flex-col">
        <LandingNavbar />
        <main className="flex-1">
          {children}
        </main>
        <LandingFooter />
      </div>
    )
  }

  if (isPublicPath) {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block fixed left-0 top-0 h-screen z-40">
          <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        </div>

        {/* Main Content - with left margin on desktop */}
        <div className="lg:ml-[256px] transition-all duration-300 ease-in-out">
          <main className="min-h-screen p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
            <div className="container mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Navigation - Shown on mobile, hidden on desktop */}
        <div className="lg:hidden">
          <MobileBottomNav />
        </div>
      </div>
    )
  }

  return null
}