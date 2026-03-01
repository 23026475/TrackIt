"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase/client'
import { ResearchTask } from '@/app/types/database'
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Flag,
  Clock
} from 'lucide-react'
import { format } from 'date-fns'

interface ResearchKanbanProps {
  researchId: string
}

// Define the allowed status types
type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: 'gray' },
  { id: 'in_progress', title: 'In Progress', color: 'blue' },
  { id: 'review', title: 'Review', color: 'yellow' },
  { id: 'done', title: 'Done', color: 'green' },
]

const priorityColors = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200',
}

export function ResearchKanban({ researchId }: ResearchKanbanProps) {
  const [tasks, setTasks] = useState<ResearchTask[]>([])
  const [loading, setLoading] = useState(true)
  const [draggedTask, setDraggedTask] = useState<ResearchTask | null>(null)
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

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (task: ResearchTask) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (targetStatus: string) => {
    if (!draggedTask) return

    // Type guard to ensure targetStatus is a valid TaskStatus
    if (!isValidStatus(targetStatus)) {
      console.error('Invalid status:', targetStatus)
      return
    }

    try {
      const { error } = await supabase
        .from('research_tasks')
        .update({ status: targetStatus })
        .eq('id', draggedTask.id)

      if (error) throw error

      setTasks(tasks.map(task =>
        task.id === draggedTask.id
          ? { ...task, status: targetStatus }
          : task
      ))
    } catch (error) {
      console.error('Error moving task:', error)
    } finally {
      setDraggedTask(null)
    }
  }

  // Type guard function
  const isValidStatus = (status: string): status is TaskStatus => {
    return ['todo', 'in_progress', 'review', 'done'].includes(status)
  }

  const getColumnTasks = (columnId: TaskStatus) => {
    return tasks.filter(task => task.status === columnId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Kanban Board</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnTasks = getColumnTasks(column.id)
          
          return (
            <div
              key={column.id}
              className="bg-muted/50 rounded-lg p-3 min-w-[250px]"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-${column.color}-500`} />
                  <h3 className="font-medium text-sm">{column.title}</h3>
                  <span className="text-xs bg-background px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-2 min-h-[200px]">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className={`bg-card border border-border rounded-lg p-3 cursor-move hover:shadow-md transition-shadow ${
                      draggedTask?.id === task.id ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium line-clamp-2">{task.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {task.due_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(task.due_date), 'MMM d')}</span>
                        </div>
                      )}
                      {task.labels && task.labels.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Flag className="h-3 w-3" />
                          <span>{task.labels.length}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {columnTasks.length === 0 && (
                  <div className="text-center py-6 text-xs text-muted-foreground border-2 border-dashed border-border rounded-lg">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}