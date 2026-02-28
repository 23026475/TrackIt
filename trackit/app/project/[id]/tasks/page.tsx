"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/app/lib/supabase/client'
import { Project, Task } from '@/app/types/database'
import { ArrowLeft, Plus, Calendar, Flag, Edit, Trash2, Eye, EyeOff, Code, Database, Globe } from 'lucide-react'
import { TaskModal } from '@/components/TaskModal'

export default function ProjectTasksPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [updatingVisibility, setUpdatingVisibility] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (projectId) {
      fetchProject()
      fetchTasks()
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
    }
  }

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (err: any) {
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error
      setTasks(prev => prev.filter(t => t.id !== taskId))
    } catch (err: any) {
      console.error('Error deleting task:', err)
    }
  }

  const toggleKanbanVisibility = async (task: Task) => {
    setUpdatingVisibility(task.id)
    try {
      const newPosition = task.position === -1 ? 0 : -1
      const updates: any = { position: newPosition }
      
      // If showing in kanban, set a default status
      if (newPosition !== -1 && !task.status) {
        updates.status = 'todo'
      }

      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', task.id)

      if (error) throw error

      // Update local state
      setTasks(prev => prev.map(t => 
        t.id === task.id ? { ...t, position: newPosition } : t
      ))
    } catch (err: any) {
      console.error('Error toggling visibility:', err)
    } finally {
      setUpdatingVisibility(null)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
      case 'in_progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
      case 'review': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200'
      case 'done': return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  // Get background color based on task labels
  const getTaskBackgroundColor = (labels: string[] | null) => {
    if (!labels || labels.length === 0) return 'bg-card'
    
    const labelSet = new Set(labels.map(l => l.toLowerCase().trim()))
    
    if (labelSet.has('frontend') || labelSet.has('front-end') || labelSet.has('ui') || labelSet.has('ux')) {
      return 'bg-blue-50 dark:bg-blue-950/30 border-l-4 border-l-blue-500'
    }
    if (labelSet.has('backend') || labelSet.has('back-end') || labelSet.has('api') || labelSet.has('server')) {
      return 'bg-green-50 dark:bg-green-950/30 border-l-4 border-l-green-500'
    }
    if (labelSet.has('database') || labelSet.has('db') || labelSet.has('data') || labelSet.has('sql')) {
      return 'bg-purple-50 dark:bg-purple-950/30 border-l-4 border-l-purple-500'
    }
    if (labelSet.has('bug') || labelSet.has('fix') || labelSet.has('issue')) {
      return 'bg-red-50 dark:bg-red-950/30 border-l-4 border-l-red-500'
    }
    if (labelSet.has('feature') || labelSet.has('enhancement') || labelSet.has('new')) {
      return 'bg-yellow-50 dark:bg-yellow-950/30 border-l-4 border-l-yellow-500'
    }
    if (labelSet.has('documentation') || labelSet.has('docs') || labelSet.has('readme')) {
      return 'bg-orange-50 dark:bg-orange-950/30 border-l-4 border-l-orange-500'
    }
    
    return 'bg-card'
  }

  // Get icon based on task labels
  const getTaskIcon = (labels: string[] | null) => {
    if (!labels || labels.length === 0) return null
    
    const labelSet = new Set(labels.map(l => l.toLowerCase().trim()))
    
    if (labelSet.has('frontend') || labelSet.has('front-end') || labelSet.has('ui') || labelSet.has('ux')) {
      return <Globe className="h-4 w-4 text-blue-500" />
    }
    if (labelSet.has('backend') || labelSet.has('back-end') || labelSet.has('api') || labelSet.has('server')) {
      return <Code className="h-4 w-4 text-green-500" />
    }
    if (labelSet.has('database') || labelSet.has('db') || labelSet.has('data') || labelSet.has('sql')) {
      return <Database className="h-4 w-4 text-purple-500" />
    }
    
    return null
  }

  if (!projectId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
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
          href="/projects"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
            <p className="text-sm text-muted-foreground">Tasks</p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingTask(null)
            setIsModalOpen(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground mb-4">No tasks yet. Create your first task!</p>
          <button
            onClick={() => {
              setEditingTask(null)
              setIsModalOpen(true)
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Task
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`${getTaskBackgroundColor(task.labels)} border border-border rounded-lg p-4 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getTaskIcon(task.labels)}
                    <h3 className="font-semibold">{task.title}</h3>
                    {task.position === -1 ? (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center gap-1">
                        <EyeOff className="h-3 w-3" />
                        Hidden
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        On Kanban
                      </span>
                    )}
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className={`px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    
                    {task.due_date && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                    
                    {task.estimated_hours && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Flag className="h-3 w-3" />
                        {task.estimated_hours}h
                      </span>
                    )}
                  </div>

                  {task.labels && task.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {task.labels.map((label) => (
                        <span
                          key={label}
                          className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => toggleKanbanVisibility(task)}
                    disabled={updatingVisibility === task.id}
                    className="p-1 hover:bg-muted rounded transition-colors"
                    title={task.position === -1 ? "Show in Kanban" : "Hide from Kanban"}
                  >
                    {updatingVisibility === task.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : task.position === -1 ? (
                      <Eye className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditingTask(task)
                      setIsModalOpen(true)
                    }}
                    className="p-1 hover:bg-muted rounded transition-colors"
                    title="Edit task"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1 hover:bg-muted rounded transition-colors text-red-600"
                    title="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        projectId={projectId}
        onTaskAdded={fetchTasks}
        editTask={editingTask}
      />
    </div>
  )
}