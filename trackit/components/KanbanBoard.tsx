"use client"

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { createClient } from '@/app/lib/supabase/client'
import { Plus, MoreVertical, Edit, Trash2, Calendar, Flag } from 'lucide-react'
import { TaskModal } from './TaskModal'

interface Task {
  id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  labels: string[] | null
  position: number
}

interface KanbanBoardProps {
  projectId: string
}

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/30' },
  { id: 'review', title: 'Review', color: 'bg-yellow-100 dark:bg-yellow-900/30' },
  { id: 'done', title: 'Done', color: 'bg-green-100 dark:bg-green-900/30' }
]

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Record<string, Task[]>>({
    todo: [],
    in_progress: [],
    review: [],
    done: []
  })
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchTasks()
  }, [projectId])

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('position', { ascending: true })

      if (error) throw error

      // Group tasks by status
      const grouped = {
        todo: data?.filter(t => t.status === 'todo') || [],
        in_progress: data?.filter(t => t.status === 'in_progress') || [],
        review: data?.filter(t => t.status === 'review') || [],
        done: data?.filter(t => t.status === 'done') || []
      }

      setTasks(grouped)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    // Same column
    if (source.droppableId === destination.droppableId) {
      const column = tasks[source.droppableId as keyof typeof tasks]
      const newTasks = [...column]
      const [removed] = newTasks.splice(source.index, 1)
      newTasks.splice(destination.index, 0, removed)

      // Update positions
      setTasks({
        ...tasks,
        [source.droppableId]: newTasks
      })

      // Update positions in database
      for (let i = 0; i < newTasks.length; i++) {
        await supabase
          .from('tasks')
          .update({ position: i })
          .eq('id', newTasks[i].id)
      }
    } else {
      // Different column
      const sourceColumn = [...tasks[source.droppableId as keyof typeof tasks]]
      const destColumn = [...tasks[destination.droppableId as keyof typeof tasks]]
      const [removed] = sourceColumn.splice(source.index, 1)
      
      // Update task status
      removed.status = destination.droppableId as Task['status']
      destColumn.splice(destination.index, 0, removed)

      setTasks({
        ...tasks,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn
      })

      // Update status and positions
      await supabase
        .from('tasks')
        .update({ 
          status: destination.droppableId,
          position: destination.index 
        })
        .eq('id', draggableId)

      // Update positions in destination column
      for (let i = 0; i < destColumn.length; i++) {
        await supabase
          .from('tasks')
          .update({ position: i })
          .eq('id', destColumn[i].id)
      }
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

      // Remove from state
      const newTasks = { ...tasks }
      for (const column in newTasks) {
        newTasks[column as keyof typeof tasks] = newTasks[column as keyof typeof tasks].filter(t => t.id !== taskId)
      }
      setTasks(newTasks)
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kanban Board</h2>
        <button
          onClick={() => {
            setEditingTask(null)
            setIsModalOpen(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {columns.map((column) => (
            <div key={column.id} className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-4 flex justify-between items-center">
                <span>{column.title}</span>
                <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {tasks[column.id as keyof typeof tasks].length}
                </span>
              </h3>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] space-y-2 p-2 rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? column.color : ''
                    }`}
                  >
                    {tasks[column.id as keyof typeof tasks].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white dark:bg-gray-800 border border-border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow ${
                              snapshot.isDragging ? 'shadow-lg rotate-1' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-sm">{task.title}</h4>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    setEditingTask(task)
                                    setIsModalOpen(true)
                                  }}
                                  className="p-1 hover:bg-muted rounded transition-colors"
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="p-1 hover:bg-muted rounded transition-colors text-red-600"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>

                            {task.description && (
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                {task.description}
                              </p>
                            )}

                            <div className="flex items-center gap-2 text-xs">
                              <span className={`px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                              
                              {task.due_date && (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(task.due_date).toLocaleDateString()}
                                </span>
                              )}
                            </div>

                            {task.labels && task.labels.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {task.labels.slice(0, 2).map((label) => (
                                  <span
                                    key={label}
                                    className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[10px]"
                                  >
                                    {label}
                                  </span>
                                ))}
                                {task.labels.length > 2 && (
                                  <span className="text-[10px] text-muted-foreground">
                                    +{task.labels.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

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
    </>
  )
}