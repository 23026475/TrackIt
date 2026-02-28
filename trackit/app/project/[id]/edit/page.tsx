"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type ProjectStatus = 'planning' | 'active' | 'paused' | 'completed' | 'maintenance'
type Priority = 'low' | 'medium' | 'high'

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [status, setStatus] = useState<ProjectStatus>('planning')
  const [techStack, setTechStack] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [deadline, setDeadline] = useState('')
  
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

      setName(data.name)
      setDescription(data.description || '')
      setPriority(data.priority)
      // Ensure status is not 'archived' for editing
      if (data.status !== 'archived') {
        setStatus(data.status as ProjectStatus)
      }
      setTechStack(data.tech_stack?.join(', ') || '')
      setGithubUrl(data.github_url || '')
      setLiveUrl(data.live_url || '')
      setDeadline(data.deadline || '')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name,
          description: description || null,
          priority,
          status,
          tech_stack: techStack.split(',').map(t => t.trim()).filter(t => t),
          github_url: githubUrl || null,
          live_url: liveUrl || null,
          deadline: deadline || null,
        })
        .eq('id', projectId)

      if (error) throw error
      router.push(`/project/${projectId}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
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

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/project/${projectId}`}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold">Edit Project</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Project Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 sm:py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            placeholder="Enter project name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2.5 sm:py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            placeholder="Describe your project..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-2.5 sm:py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full px-3 py-2.5 sm:py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tech Stack (comma separated)</label>
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className="w-full px-3 py-2.5 sm:py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            placeholder="React, TypeScript, Node.js"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">GitHub URL</label>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="w-full px-3 py-2.5 sm:py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            placeholder="https://github.com/username/repo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Live URL</label>
          <input
            type="url"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            className="w-full px-3 py-2.5 sm:py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            placeholder="https://myapp.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-3 py-2.5 sm:py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Link
            href={`/project/${projectId}`}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 border border-border rounded-lg hover:bg-muted transition-colors text-center text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}