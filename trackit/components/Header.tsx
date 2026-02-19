"use client"

import { useRouter } from 'next/navigation'
import { createClient } from '../app/lib/supabase/client'
import { ThemeToggle } from './ThemeToggle'
import { LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Header() {
  const [userEmail, setUserEmail] = useState<string>('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
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

  // Get first letter of email for avatar
  const getInitial = () => {
    return userEmail ? userEmail.charAt(0).toUpperCase() : '?'
  }

  return (
    <header className="border-b border-border bg-background/95">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - No click functionality */}
          <div className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TrackIt
            </span>
          </div>

          {/* Right section - Email initial, theme toggle, logout */}
          <div className="flex items-center gap-3">
            {/* Email initial avatar */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {getInitial()}
              </div>
              <span className="text-sm text-foreground hidden sm:inline-block">
                {userEmail}
              </span>
            </div>

            <ThemeToggle />
            
            <button
              onClick={handleSignOut}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}