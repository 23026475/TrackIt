"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'
import { Project } from '@/app/types/database'
import { Archive, RotateCcw, Calendar, FolderKanban, ArrowLeft } from 'lucide-react'

export default function HistoryPage() {
  const [archivedProjects, setArchivedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [restoring, setRestoring] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchArchivedProjects()
  }, [])

  const fetchArchivedProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('archived', true)  // Only fetch archived projects
        .order('archived_at', { ascending: false })

      if (error) throw error
      setArchivedProjects(data || [])
    } catch (err: any) {
      console.error('Error fetching archived projects:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (projectId: string) => {
    setRestoring(projectId)
    setError(null)
    
    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          archived: false,
          archived_at: null,
          status: 'active'  // Restore to active status
        })
        .eq('id', projectId)

      if (error) throw error

      // Remove from list
      setArchivedProjects(prev => prev.filter(p => p.id !== projectId))
      
      // Show success message or toast here
    } catch (err: any) {
      console.error('Error restoring project:', err)
      setError(err.message)
    } finally {
      setRestoring(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Archive className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Archived Projects</h1>
        </div>
        <Link
          href="/projects"
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {archivedProjects.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <Archive className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No archived projects</h3>
          <p className="text-muted-foreground mb-4">
            When you complete or archive a project, it will appear here.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            View Active Projects
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {archivedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold">{project.name}</h2>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full">
                      Archived
                    </span>
                  </div>
                  
                  {project.description && (
                    <p className="text-muted-foreground text-sm mb-3">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Archived: {project.archived_at ? new Date(project.archived_at).toLocaleDateString() : 'Unknown'}</span>
                    </div>
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex items-center gap-1">
                        <FolderKanban className="h-4 w-4" />
                        <span>{project.tech_stack.length} technologies</span>
                      </div>
                    )}
                  </div>

                  {/* Original status and priority for reference */}
                  <div className="flex gap-2 mt-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${project.priority === 'high' ? 'bg-red-100 text-red-700' :
                        project.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'}`}>
                      {project.priority}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestore(project.id)}
                    disabled={restoring === project.id}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {restoring === project.id ? 'Restoring...' : 'Restore Project'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}