"use client"

import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { LandingNavbar } from './LandingNavbar'
import { LandingFooter } from './LandingFooter'
import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase/client'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const supabase = createClient()

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }
    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // Define which paths are public (no sidebar)
  const publicPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password']
  const isPublicPath = publicPaths.includes(pathname)

  // Show loading or nothing while checking auth
  if (isAuthenticated === null && !isPublicPath) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Public pages (landing, login, etc.) - show navbar and footer
  if (isPublicPath) {
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

  // Authenticated pages - show sidebar only (header is inside sidebar)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    )
  }

  // Fallback - should not reach here due to middleware
  return null
}