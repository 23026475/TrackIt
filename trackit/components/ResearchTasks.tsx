"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase/client'
import { ResearchTask } from '@/app/types/database'
import { 
  CheckCircle, 
  Circle, 
  Plus, 
  Trash2, 
  Edit,
  Calendar,
  Flag,
  Tag,
  ChevronDown,
  ChevronRight,
  Clock,
  Loader2
} from 'lucide-react'
import { format } from 'date-fns'

interface ResearchTasksProps {
  researchId: string
}

const statusColors = {
  todo: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200',
  review: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200',
  done: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200',
}

const priorityColors = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200',
}

export function ResearchTasks({ researchId }: ResearchTasksProps) {
  const [tasks, setTasks] = useState<ResearchTask[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<ResearchTask | null>(null)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: '',
  })
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())
  const supabase = createClient()

  useEffect(() => {
    fetchTasks()
  }, [researchId])

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('research_tasks')
        .select('*')
        .eq('research_id', researchId)
        .order('position', { ascending: true })
        .order('created_at', { ascending: true })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get max position for new task
      const maxPosition = tasks.length > 0 
        ? Math.max(...tasks.map(t => t.position)) + 1 
        : 0

      const { data, error } = await supabase
        .from('research_tasks')
        .insert({
          research_id: researchId,
          user_id: user.id,
          title: newTask.title,
          description: newTask.description || null,
          priority: newTask.priority,
          due_date: newTask.due_date || null,
          position: maxPosition,
          status: 'todo',
        })
        .select()
        .single()

      if (error) throw error

      setTasks([...tasks, data])
      setNewTask({ title: '', description: '', priority: 'medium', due_date: '' })
      setShowNewTaskForm(false)
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const handleUpdateTask = async (taskId: string, updates: Partial<ResearchTask>) => {
    try {
      const { error } = await supabase
        .from('research_tasks')
        .update(updates)
        .eq('id', taskId)

      if (error) throw error

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      ))
      setEditingTask(null)
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const { error } = await supabase
        .from('research_tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error

      setTasks(tasks.filter(task => task.id !== taskId))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleToggleStatus = async (task: ResearchTask) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done'
    const completedAt = newStatus === 'done' ? new Date().toISOString() : null
    
    await handleUpdateTask(task.id, { 
      status: newStatus,
      completed_at: completedAt
    })
  }

  const toggleTaskExpand = (taskId: string) => {
    const newExpanded = new Set(expandedTasks)
    if (expandedTasks.has(taskId)) {
      newExpanded.delete(taskId)
    } else {
      newExpanded.add(taskId)
    }
    setExpandedTasks(newExpanded)
  }

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    review: tasks.filter(t => t.status === 'review'),
    done: tasks.filter(t => t.status === 'done'),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks & Action Items</h2>
        <button
          onClick={() => setShowNewTaskForm(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      {/* New Task Form */}
      {showNewTaskForm && (
        <form onSubmit={handleCreateTask} className="bg-muted p-4 rounded-lg space-y-3">
          <input
            type="text"
            placeholder="Task title..."
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          <textarea
            placeholder="Description (optional)"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex flex-wrap gap-3">
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
              className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <input
              type="date"
              value={newTask.due_date}
              onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowNewTaskForm(false)}
              className="px-3 py-2 border border-border rounded-lg hover:bg-background transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Task
            </button>
          </div>
        </form>
      )}

      {/* Tasks by Status */}
      {tasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No tasks yet. Click "Add Task" to get started.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Todo Section */}
          {tasksByStatus.todo.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">To Do</h3>
              {tasksByStatus.todo.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => handleToggleStatus(task)}
                  onEdit={() => setEditingTask(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                  isExpanded={expandedTasks.has(task.id)}
                  onToggleExpand={() => toggleTaskExpand(task.id)}
                  onUpdate={handleUpdateTask}
                />
              ))}
            </div>
          )}

          {/* In Progress Section */}
          {tasksByStatus.in_progress.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">In Progress</h3>
              {tasksByStatus.in_progress.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => handleToggleStatus(task)}
                  onEdit={() => setEditingTask(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                  isExpanded={expandedTasks.has(task.id)}
                  onToggleExpand={() => toggleTaskExpand(task.id)}
                  onUpdate={handleUpdateTask}
                />
              ))}
            </div>
          )}

          {/* Review Section */}
          {tasksByStatus.review.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Review</h3>
              {tasksByStatus.review.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => handleToggleStatus(task)}
                  onEdit={() => setEditingTask(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                  isExpanded={expandedTasks.has(task.id)}
                  onToggleExpand={() => toggleTaskExpand(task.id)}
                  onUpdate={handleUpdateTask}
                />
              ))}
            </div>
          )}

          {/* Done Section */}
          {tasksByStatus.done.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Done</h3>
              {tasksByStatus.done.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => handleToggleStatus(task)}
                  onEdit={() => setEditingTask(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                  isExpanded={expandedTasks.has(task.id)}
                  onToggleExpand={() => toggleTaskExpand(task.id)}
                  onUpdate={handleUpdateTask}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface TaskItemProps {
  task: ResearchTask
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
  isExpanded: boolean
  onToggleExpand: () => void
  onUpdate: (id: string, updates: Partial<ResearchTask>) => Promise<void>
}

function TaskItem({ 
  task, 
  onToggle, 
  onEdit, 
  onDelete, 
  isExpanded, 
  onToggleExpand,
  onUpdate 
}: TaskItemProps) {
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    due_date: task.due_date ? task.due_date.split('T')[0] : '',
  })

  const handleSaveEdit = async () => {
    await onUpdate(task.id, {
      title: editForm.title,
      description: editForm.description || null,
      priority: editForm.priority,
      due_date: editForm.due_date || null,
    })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="bg-muted p-4 rounded-lg space-y-3">
        <input
          type="text"
          value={editForm.title}
          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg"
          placeholder="Task title"
        />
        <textarea
          value={editForm.description}
          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg"
          placeholder="Description"
        />
        <div className="flex flex-wrap gap-3">
          <select
            value={editForm.priority}
            onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as 'low' | 'medium' | 'high' })}
            className="px-3 py-2 bg-background border border-border rounded-lg"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            value={editForm.due_date}
            onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
            className="px-3 py-2 bg-background border border-border rounded-lg"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setEditing(false)}
            className="px-3 py-2 border border-border rounded-lg hover:bg-background"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-card border border-border rounded-lg hover:shadow-sm transition-shadow ${
      task.status === 'done' ? 'opacity-60' : ''
    }`}>
      <div className="p-3">
        <div className="flex items-start gap-2">
          <button onClick={onToggle} className="mt-0.5">
            {task.status === 'done' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground hover:text-blue-500" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}>
                {task.title}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              {task.due_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(task.due_date), 'MMM d, yyyy')}</span>
                </div>
              )}
              {task.completed_at && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Completed {format(new Date(task.completed_at), 'MMM d')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onToggleExpand}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => setEditing(true)}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isExpanded && task.description && (
          <div className="mt-3 pl-7 text-sm text-muted-foreground border-t border-border pt-3">
            {task.description}
          </div>
        )}
      </div>
    </div>
  )
}