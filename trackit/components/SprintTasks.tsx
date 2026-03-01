"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase/client'
import { Sprint, Task } from '@/app/types/database'
import { ArrowLeft, Calendar, Target, Plus, CheckCircle, Circle } from 'lucide-react'

interface SprintTasksProps {
  sprint: Sprint
  onBack: () => void
  onSprintUpdated: () => void
}

export function SprintTasks({ sprint, onBack, onSprintUpdated }: SprintTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [availableTasks, setAvailableTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddTasks, setShowAddTasks] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchTasks()
  }, [sprint.id])

  const fetchTasks = async () => {
    try {
      // Get tasks in this sprint
      const { data: sprintTasks, error: sprintError } = await supabase
        .from('sprint_tasks')
        .select('task_id')
        .eq('sprint_id', sprint.id)

      if (sprintError) throw sprintError

      const taskIds = sprintTasks?.map(st => st.task_id) || []

      // Get all tasks for the project
      const { data: allTasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', sprint.project_id)
        .order('created_at', { ascending: false })

      if (tasksError) throw tasksError

      // Split into sprint tasks and available tasks
      const sprintTaskList = allTasks?.filter(t => taskIds.includes(t.id)) || []
      const availableTaskList = allTasks?.filter(t => !taskIds.includes(t.id)) || []

      setTasks(sprintTaskList)
      setAvailableTasks(availableTaskList)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTaskToSprint = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('sprint_tasks')
        .insert([{ sprint_id: sprint.id, task_id: taskId }])

      if (error) throw error
      
      // Move task from available to sprint tasks
      const task = availableTasks.find(t => t.id === taskId)
      if (task) {
        setTasks(prev => [...prev, task])
        setAvailableTasks(prev => prev.filter(t => t.id !== taskId))
      }
    } catch (error) {
      console.error('Error adding task to sprint:', error)
    }
  }

  const removeTaskFromSprint = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('sprint_tasks')
        .delete()
        .eq('sprint_id', sprint.id)
        .eq('task_id', taskId)

      if (error) throw error
      
      // Move task from sprint tasks to available
      const task = tasks.find(t => t.id === taskId)
      if (task) {
        setAvailableTasks(prev => [...prev, task])
        setTasks(prev => prev.filter(t => t.id !== taskId))
      }
    } catch (error) {
      console.error('Error removing task from sprint:', error)
    }
  }

  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId)

      if (error) throw error
      
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: newStatus } : t
      ))
    } catch (error) {
      console.error('Error updating task status:', error)
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-lg font-semibold">{sprint.name}</h2>
          {sprint.goal && (
            <p className="text-sm text-muted-foreground">{sprint.goal}</p>
          )}
        </div>
      </div>

      {/* Sprint Dates */}
      {(sprint.start_date || sprint.end_date) && (
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          {sprint.start_date && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Start: {new Date(sprint.start_date).toLocaleDateString()}
            </span>
          )}
          {sprint.end_date && (
            <span className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              End: {new Date(sprint.end_date).toLocaleDateString()}
            </span>
          )}
        </div>
      )}

      {/* Add Tasks Button */}
      <button
        onClick={() => setShowAddTasks(!showAddTasks)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm w-full sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        {showAddTasks ? 'Hide Available Tasks' : 'Add Tasks to Sprint'}
      </button>

      {/* Available Tasks */}
      {showAddTasks && (
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Available Tasks</h3>
          {availableTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">No available tasks</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-border rounded-lg">
              {availableTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 hover:bg-muted rounded-lg cursor-pointer"
                  onClick={() => addTaskToSprint(task.id)}
                >
                  <span className="text-sm">{task.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sprint Tasks */}
      <div className="space-y-2">
        <h3 className="font-medium text-sm">Sprint Tasks ({tasks.length})</h3>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center bg-card border border-border rounded-lg">
            No tasks in this sprint yet
          </p>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-card border border-border rounded-lg p-3 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={() => {
                          if (task.status === 'done') {
                            updateTaskStatus(task.id, 'todo')
                          } else {
                            updateTaskStatus(task.id, 'done')
                          }
                        }}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {task.status === 'done' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </button>
                      <span className={`text-sm ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 ml-7">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeTaskFromSprint(task.id)}
                    className="p-1 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Remove from sprint"
                  >
                    <span className="text-xs">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}