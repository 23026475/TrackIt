"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { ProjectModal } from '@/components/ProjectModal'
import { useProjects } from '@/app/hooks/useProjects'
import { createClient } from '@/app/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { projects, loading, error } = useProjects()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      }
    }
    checkUser()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Projects</p>
          <p className="text-2xl font-bold">{projects?.length || 0}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Active Projects</p>
          <p className="text-2xl font-bold">
            {projects?.filter(p => p.status === 'active').length || 0}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold">
            {projects?.filter(p => p.status === 'completed').length || 0}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">High Priority</p>
          <p className="text-2xl font-bold">
            {projects?.filter(p => p.priority === 'high').length || 0}
          </p>
        </div>
      </div>

      {/* Recent Projects */}
      <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
      
      {projects && projects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 6).map((project) => (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className="block bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${project.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200' :
                    project.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200' :
                    'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200'}`}>
                  {project.priority}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${project.status === 'active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200' :
                    project.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200' :
                    project.status === 'paused' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-200' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                  {project.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground mb-4">You haven't created any projects yet</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create your first project
          </button>
        </div>
      )}

      <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}