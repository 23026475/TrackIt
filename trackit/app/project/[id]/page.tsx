"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'
import { Project } from '@/app/types/database'
import { ProjectComments } from '@/components/ProjectComments'
import { ArrowLeft, Edit, Trash2, Github, Globe, Calendar, Code2, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { ProjectComponents } from '@/components/ProjectComponents'

export default function ProjectPage() {
  const { id } = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setProject(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return

    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200'
      case 'planning': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
      case 'paused': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200'
      case 'completed': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-200'
      case 'maintenance': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-200'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Project not found'}</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        
        <div className="flex items-center gap-2">
          <Link
            href={`/project/${id}/edit`}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <Edit className="h-5 w-5" />
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Project Info Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{project.name}</h1>
            {project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(project.priority)}`}>
              {project.priority} priority
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
        </div>

        {/* Project Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Created:</span>
            <span>{new Date(project.created_at).toLocaleDateString()}</span>
          </div>
          
          {project.deadline && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Deadline:</span>
              <span className={new Date(project.deadline) < new Date() ? 'text-red-600' : ''}>
                {new Date(project.deadline).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Links */}
        {(project.github_url || project.live_url) && (
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                <Github className="h-4 w-4" />
                <span>GitHub Repository</span>
              </a>
            )}
            
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                <Globe className="h-4 w-4" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Tech Stack */}
      {project.tech_stack && project.tech_stack.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Tech Stack</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-foreground rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <ProjectComments projectId={project.id} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href={`/project/${id}/tasks`}
          className="p-4 bg-card border border-border rounded-lg hover:shadow-lg transition-all hover:border-primary text-center group"
        >
          <CheckCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
          <h3 className="font-semibold">Tasks</h3>
          <p className="text-sm text-muted-foreground">Manage project tasks</p>
        </Link>
        
        <Link
          href={`/project/${id}/kanban`}
          className="p-4 bg-card border border-border rounded-lg hover:shadow-lg transition-all hover:border-primary text-center group"
        >
          <svg className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
          </svg>
          <h3 className="font-semibold">Kanban Board</h3>
          <p className="text-sm text-muted-foreground">Visual task management</p>
        </Link>
        
        <Link
          href={`/project/${id}/sprints`}
          className="p-4 bg-card border border-border rounded-lg hover:shadow-lg transition-all hover:border-primary text-center group"
        >
          <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
          <h3 className="font-semibold">Sprints</h3>
          <p className="text-sm text-muted-foreground">Plan and track sprints</p>
        </Link>
      </div>

      {/* Tech Stack */}
      {project.tech_stack && project.tech_stack.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Tech Stack</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-foreground rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Components Section */}
      <ProjectComponents projectId={project.id} />

      {/* Comments Section */}
      <ProjectComments projectId={project.id} />
    </div>
  )
}