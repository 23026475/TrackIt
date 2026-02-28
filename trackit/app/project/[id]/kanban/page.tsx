"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/app/lib/supabase/client'
import { KanbanBoard } from '@/components/KanbanBoard'
import { Project } from '@/app/types/database'
import { ArrowLeft, Calendar } from 'lucide-react'

export default function ProjectKanbanPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

      if (error) throw error
      setProject(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!projectId) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Project not found'}</p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </div>
    )
  }

  // Check if project is archived
  if (project.archived) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-muted-foreground mb-4">This project is archived. Restore it to view the Kanban board.</p>
        <Link
          href={`/project/${projectId}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Project
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{project.name}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Kanban Board</p>
          </div>
        </div>

        <Link
          href={`/project/${projectId}/sprints`}
          className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 sm:py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto text-sm"
        >
          <Calendar className="h-4 w-4" />
          <span>Sprints</span>
        </Link>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4 -mx-2 sm:mx-0 px-2 sm:px-0">
        <div className="min-w-[800px] lg:min-w-0">
          <KanbanBoard projectId={projectId} />
        </div>
      </div>
    </div>
  )
}