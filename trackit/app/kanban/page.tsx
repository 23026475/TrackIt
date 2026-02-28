"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'
import { KanbanBoard } from '@/components/KanbanBoard'
import { Project } from '@/app/types/database'
import { ChevronDown } from 'lucide-react'

export default function KanbanPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('archived', false)
        .order('name')

      if (error) throw error
      setProjects(data || [])
      
      if (data && data.length > 0 && !selectedProject) {
        setSelectedProject(data[0].id)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedProjectName = projects.find(p => p.id === selectedProject)?.name || 'Select a project'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Kanban Board</h1>
      </div>

      {/* Project Selector */}
      {projects.length > 0 ? (
        <div className="relative">
          {/* Mobile dropdown button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="sm:hidden w-full flex items-center justify-between px-4 py-3 bg-card border border-border rounded-lg"
          >
            <span className="text-sm font-medium">{selectedProjectName}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Mobile dropdown menu */}
          {isDropdownOpen && (
            <div className="sm:hidden absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setSelectedProject(project.id)
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-muted transition-colors ${
                    selectedProject === project.id ? 'bg-primary/10 text-primary' : ''
                  }`}
                >
                  {project.name}
                </button>
              ))}
            </div>
          )}

          {/* Desktop select */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="hidden sm:block w-full sm:w-auto px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12 bg-card border border-border rounded-lg px-4">
          <p className="text-muted-foreground mb-4">No projects found. Create a project first to start using Kanban.</p>
          <button
            onClick={() => router.push('/projects')}
            className="px-4 py-2.5 sm:py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
          >
            Go to Projects
          </button>
        </div>
      )}

      {/* Kanban Board */}
      {selectedProject ? (
        <div className="overflow-x-auto pb-4 -mx-2 sm:mx-0 px-2 sm:px-0">
          <div className="min-w-[800px] sm:min-w-0">
            <KanbanBoard projectId={selectedProject} />
          </div>
        </div>
      ) : (
        projects.length > 0 && (
          <div className="text-center py-8 sm:py-12 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground">Select a project to view its Kanban board.</p>
          </div>
        )
      )}
    </div>
  )
}