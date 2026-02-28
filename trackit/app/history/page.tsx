"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'
import { Project } from '@/app/types/database'
import { Archive, RotateCcw, Calendar, FolderKanban, ArrowLeft, Search } from 'lucide-react'

export default function HistoryPage() {
  const [archivedProjects, setArchivedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [restoring, setRestoring] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
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
        .eq('archived', true)
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
          status: 'active'
        })
        .eq('id', projectId)

      if (error) throw error

      setArchivedProjects(prev => prev.filter(p => p.id !== projectId))
    } catch (err: any) {
      console.error('Error restoring project:', err)
      setError(err.message)
    } finally {
      setRestoring(null)
    }
  }

  const filteredProjects = archivedProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/projects"
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            title="Back to Projects"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Archive className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Archived Projects</h1>
          </div>
        </div>
        
        {/* Desktop back button */}
        <Link
          href="/projects"
          className="hidden lg:flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm w-full sm:w-auto md:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* Search Bar */}
      {archivedProjects.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search archived projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg px-4">
          <Archive className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">
            {archivedProjects.length === 0 ? 'No archived projects' : 'No matching projects'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {archivedProjects.length === 0 
              ? 'When you complete or archive a project, it will appear here.'
              : 'Try adjusting your search term'}
          </p>
          {archivedProjects.length === 0 ? (
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 md:py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm w-full sm:w-auto md:w-auto"
            >
              View Active Projects
            </Link>
          ) : (
            <button
              onClick={() => setSearchTerm('')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 md:py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm w-full sm:w-auto md:w-auto"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-card border border-border rounded-lg p-4 sm:p-5 md:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-1">{project.name}</h2>
                  
                  {project.description && (
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>Archived: {project.archived_at ? new Date(project.archived_at).toLocaleDateString() : 'Unknown'}</span>
                    </div>
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex items-center gap-1">
                        <FolderKanban className="h-4 w-4 flex-shrink-0" />
                        <span>{project.tech_stack.length} technologies</span>
                      </div>
                    )}
                  </div>

                  {/* Status and priority pills */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${project.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200' :
                        project.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200' :
                        'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200'}`}>
                      {project.priority}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-full text-xs font-medium">
                      {project.status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRestore(project.id)}
                  disabled={restoring === project.id}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 md:py-2.5 lg:py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm w-full sm:w-auto md:w-28 lg:w-auto"
                >
                  <RotateCcw className="h-4 w-4" />
                  {restoring === project.id ? 'Restoring...' : 'Restore'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}