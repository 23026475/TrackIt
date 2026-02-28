"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase/client'
import { Lock, AlertCircle, CheckCircle, Moon, Sun, Shield, User, Bell, ChevronRight, ArrowLeft } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('')
  const { theme, setTheme } = useTheme()
  const supabase = createClient()

  // Mobile state
  const [mobileView, setMobileView] = useState<'menu' | 'account' | 'appearance' | 'security'>('menu')

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
    }
    getUser()
  }, [supabase])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match")
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      setTimeout(() => setSuccess(false), 3000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Mobile Menu View
  if (mobileView === 'menu') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Settings</h1>
        
        {/* Mobile Menu - Card based navigation */}
        <div className="sm:hidden space-y-2">
          <button
            onClick={() => setMobileView('account')}
            className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-medium">Account</p>
                <p className="text-xs text-muted-foreground">Profile information</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => setMobileView('appearance')}
            className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Sun className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-medium">Appearance</p>
                <p className="text-xs text-muted-foreground">Theme and display</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => setMobileView('security')}
            className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-medium">Security</p>
                <p className="text-xs text-muted-foreground">Password and security</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Desktop View - Original Design */}
        <div className="hidden sm:block">
          {/* Account Settings */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={userEmail}
                    disabled
                    className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="mt-6 bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Appearance</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">Theme</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex items-center gap-3 px-4 py-2 border rounded-lg transition-colors ${
                      theme === 'light'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <Sun className="h-5 w-5" />
                    <span className="text-sm">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex items-center gap-3 px-4 py-2 border rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <Moon className="h-5 w-5" />
                    <span className="text-sm">Dark</span>
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`flex items-center gap-3 px-4 py-2 border rounded-lg transition-colors ${
                      theme === 'system'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <Shield className="h-5 w-5" />
                    <span className="text-sm">System</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="mt-6 bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm text-green-700 dark:text-green-200">Password updated successfully!</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder="Enter new password"
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Must be at least 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm font-medium"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Mobile Detail Views
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-0">
      {/* Mobile Header with Back Button */}
      <div className="sm:hidden flex items-center gap-4 mb-6">
        <button
          onClick={() => setMobileView('menu')}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold">
          {mobileView === 'account' && 'Account Settings'}
          {mobileView === 'appearance' && 'Appearance Settings'}
          {mobileView === 'security' && 'Security Settings'}
        </h1>
      </div>

      {/* Desktop Header - Hidden on mobile */}
      <h1 className="hidden sm:block text-2xl sm:text-3xl font-bold mb-6">Settings</h1>

      {/* Mobile Account View */}
      {mobileView === 'account' && (
        <div className="sm:hidden">
          {/* Back button is already in the header above */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={userEmail}
                disabled
                className="w-full px-3 py-3 border border-border rounded-lg bg-muted text-muted-foreground text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">Email cannot be changed</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Appearance View */}
      {mobileView === 'appearance' && (
        <div className="sm:hidden">
          {/* Back button is already in the header above */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Theme</h2>
            <div className="space-y-3">
              <button
                onClick={() => setTheme('light')}
                className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors ${
                  theme === 'light'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sun className={`h-5 w-5 ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="font-medium">Light</span>
                </div>
                {theme === 'light' && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Moon className={`h-5 w-5 ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="font-medium">Dark</span>
                </div>
                {theme === 'dark' && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </button>

              <button
                onClick={() => setTheme('system')}
                className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors ${
                  theme === 'system'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Shield className={`h-5 w-5 ${theme === 'system' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="font-medium">System</span>
                </div>
                {theme === 'system' && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Security View */}
      {mobileView === 'security' && (
        <div className="sm:hidden">
          {/* Back button is already in the header above */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Change Password</h2>
            </div>
            
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm text-green-700 dark:text-green-200">Password updated!</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder="Enter new password"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setMobileView('menu')}
                  className="flex-1 py-3 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm font-medium"
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Desktop View - Original Design (unchanged) */}
      <div className="hidden sm:block">
        {/* Account Settings */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="mt-6 bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-3">Theme</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-3 px-4 py-2 border rounded-lg transition-colors ${
                    theme === 'light'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  <Sun className="h-5 w-5" />
                  <span className="text-sm">Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-3 px-4 py-2 border rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  <Moon className="h-5 w-5" />
                  <span className="text-sm">Dark</span>
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`flex items-center gap-3 px-4 py-2 border rounded-lg transition-colors ${
                    theme === 'system'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  <Shield className="h-5 w-5" />
                  <span className="text-sm">System</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="mt-6 bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <p className="text-sm text-green-700 dark:text-green-200">Password updated successfully!</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  placeholder="Enter new password"
                  minLength={6}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Must be at least 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm font-medium"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}