"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Search, Filter, X, Grid, List } from 'lucide-react'
import { ProjectModal } from '@/components/ProjectModal'
import { createClient } from '@/app/lib/supabase/client'
import { Project } from '@/app/types/database'

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('archived', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (err: any) {
      console.error('Error fetching projects:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm === '' || 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    
    const matchesPriority = filterPriority === 'all' || project.priority === filterPriority
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus
    
    return matchesSearch && matchesPriority && matchesStatus
  })

  const statusOptions = ['all', ...new Set(projects.map(p => p.status))]

  const clearFilters = () => {
    setSearchTerm('')
    setFilterPriority('all')
    setFilterStatus('all')
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="space-y-3">
        {/* Search input with view toggle */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          
          {/* View toggle - hidden on mobile, shown on tablet/desktop */}
          <div className="hidden sm:flex items-center gap-1 border border-border rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
              title="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Filter toggle for mobile */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filters</span>
          </button>
        </div>

        {/* Filter options - visible on desktop, toggle on mobile */}
        <div className={`
          ${showFilters ? 'flex' : 'hidden'} 
          sm:flex flex-col sm:flex-row gap-2 sm:items-center
          p-3 sm:p-0 bg-muted/50 sm:bg-transparent rounded-lg
        `}>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2.5 sm:py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 sm:py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto"
          >
            <option value="all">All Statuses</option>
            {statusOptions.filter(s => s !== 'all').map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          {(searchTerm || filterPriority !== 'all' || filterStatus !== 'all') && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 sm:py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Filter className="h-4 w-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Projects Grid/List */}
      {filteredProjects.length > 0 ? (
        <div className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' 
            : 'flex flex-col gap-3'
          }`}
        >
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className={`
                block bg-card border border-border rounded-lg hover:shadow-lg transition-shadow
                ${viewMode === 'list' ? 'p-4' : 'p-4 sm:p-6'}
              `}
            >
              <div className={viewMode === 'list' ? 'flex flex-col sm:flex-row sm:items-center gap-4' : ''}>
                {/* Main content */}
                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-2 line-clamp-1">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-muted-foreground text-xs sm:text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  
                  {/* Tech Stack Pills - Show fewer on mobile */}
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tech_stack.slice(0, 2).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs text-gray-800 dark:text-gray-200 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 2 && (
                        <span className="px-2 py-0.5 text-xs text-muted-foreground">
                          +{project.tech_stack.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Status and Priority */}
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm mt-2 sm:mt-0">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                {/* Deadline - Show on all screens */}
                {project.deadline && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-lg px-4">
          <p className="text-muted-foreground mb-4">
            {projects.length === 0 
              ? "You haven't created any projects yet" 
              : "No projects match your filters"}
          </p>
          {projects.length === 0 ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              Create your first project
            </button>
          ) : (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm sm:text-base"
            >
              <Filter className="w-4 h-4" />
              Clear filters
            </button>
          )}
        </div>
      )}

      <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}