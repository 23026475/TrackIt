"use client"

import { useState, useEffect } from 'react'
import { X, Calendar, Flag, Tag, Layers, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/app/lib/supabase/client'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  onTaskAdded: () => void
  editTask?: any
}

export function TaskModal({ isOpen, onClose, projectId, onTaskAdded, editTask }: TaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'todo' | 'in_progress' | 'review' | 'done'>('todo')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [dueDate, setDueDate] = useState('')
  const [estimatedHours, setEstimatedHours] = useState('')
  const [labels, setLabels] = useState('')
  const [showInKanban, setShowInKanban] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title)
      setDescription(editTask.description || '')
      setStatus(editTask.status)
      setPriority(editTask.priority)
      setDueDate(editTask.due_date || '')
      setEstimatedHours(editTask.estimated_hours?.toString() || '')
      setLabels(editTask.labels?.join(', ') || '')
      setShowInKanban(editTask.position !== -1)
    }
  }, [editTask])

  if (!isOpen) return null

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setStatus('todo')
    setPriority('medium')
    setDueDate('')
    setEstimatedHours('')
    setLabels('')
    setShowInKanban(true)
    setError(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    setError(null)

    try {
      const taskData: any = {
        project_id: projectId,
        title: title.trim(),
        description: description.trim() || null,
        priority,
        due_date: dueDate || null,
        estimated_hours: estimatedHours ? parseInt(estimatedHours) : null,
        labels: labels.split(',').map(l => l.trim()).filter(l => l)
      }

      if (!editTask) {
        // New task
        if (showInKanban) {
          taskData.status = status
          // Get max position for this status
          const { data: maxPositionTask } = await supabase
            .from('tasks')
            .select('position')
            .eq('project_id', projectId)
            .eq('status', status)
            .order('position', { ascending: false })
            .limit(1)

          const maxPosition = maxPositionTask && maxPositionTask.length > 0 ? maxPositionTask[0].position : -1
          taskData.position = maxPosition + 1
        } else {
          taskData.status = 'todo'
          taskData.position = -1
        }

        const { error } = await supabase
          .from('tasks')
          .insert([taskData])

        if (error) throw error
      } else {
        // Update existing task
        if (showInKanban && editTask.position === -1) {
          // Task was hidden, now showing in kanban
          const { data: maxPositionTask } = await supabase
            .from('tasks')
            .select('position')
            .eq('project_id', projectId)
            .eq('status', status)
            .order('position', { ascending: false })
            .limit(1)

          const maxPosition = maxPositionTask && maxPositionTask.length > 0 ? maxPositionTask[0].position : -1
          taskData.position = maxPosition + 1
          taskData.status = status
        } else if (!showInKanban && editTask.position !== -1) {
          // Task was showing, now hide
          taskData.position = -1
        } else if (showInKanban) {
          // Task remains in kanban, may have status change
          taskData.status = status
        }

        const { error } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', editTask.id)

        if (error) throw error
      }

      onTaskAdded()
      handleClose()
    } catch (err: any) {
      console.error('Error saving task:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600'
      case 'in_progress': return 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700'
      case 'review': return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700'
      case 'done': return 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700'
      default: return 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {editTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Task title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Add details..."
            />
          </div>

          {/* Show in Kanban Toggle */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <input
              type="checkbox"
              id="showInKanban"
              checked={showInKanban}
              onChange={(e) => setShowInKanban(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="showInKanban" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              {showInKanban ? (
                <Eye className="h-4 w-4 text-primary" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              )}
              Show in Kanban board
            </label>
          </div>

          {/* Status Selection - Only shown if showing in kanban */}
          {showInKanban && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(['todo', 'in_progress', 'review', 'done'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      status === s
                        ? getStatusColor(s) + ' ring-2 ring-primary ring-offset-2'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Estimated Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estimated Hours
              </label>
              <input
                type="number"
                min="0"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 4"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Labels */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Labels (comma separated)
              </label>
              <input
                type="text"
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="frontend, backend, database"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : editTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}