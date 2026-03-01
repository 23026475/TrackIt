"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase/client'
import { Sprint } from '@/app/types/database'
import { Calendar, Target, Plus, Edit, Trash2, Play, CheckCircle, Archive } from 'lucide-react'
import { SprintModal } from './SprintModal'
import { SprintTasks } from './SprintTasks'

interface SprintListProps {
  projectId: string
}

export function SprintList({ projectId }: SprintListProps) {
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null)
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchSprints()
  }, [projectId])

  const fetchSprints = async () => {
    try {
      const { data, error } = await supabase
        .from('sprints')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSprints(data || [])
    } catch (error) {
      console.error('Error fetching sprints:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sprint?')) return

    try {
      const { error } = await supabase
        .from('sprints')
        .delete()
        .eq('id', id)

      if (error) throw error
      setSprints(prev => prev.filter(s => s.id !== id))
      if (selectedSprint?.id === id) {
        setSelectedSprint(null)
      }
    } catch (error) {
      console.error('Error deleting sprint:', error)
    }
  }

  const updateSprintStatus = async (id: string, newStatus: 'planned' | 'active' | 'completed') => {
    try {
      const { error } = await supabase
        .from('sprints')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      
      setSprints(prev => prev.map(s => 
        s.id === id ? { ...s, status: newStatus } : s
      ))
      
      if (selectedSprint?.id === id) {
        setSelectedSprint(prev => prev ? { ...prev, status: newStatus } : null)
      }
    } catch (error) {
      console.error('Error updating sprint status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200'
      case 'planned': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
      case 'completed': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-200'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (selectedSprint) {
    return (
      <SprintTasks
        sprint={selectedSprint}
        onBack={() => setSelectedSprint(null)}
        onSprintUpdated={fetchSprints}
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sprints</h2>
        <button
          onClick={() => {
            setEditingSprint(null)
            setIsModalOpen(true)
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Sprint</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Sprint List */}
      {sprints.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground bg-card border border-border rounded-lg">
          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No sprints yet.</p>
          <p className="text-xs mt-1">Create a sprint to plan your work.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sprints.map((sprint) => (
            <div
              key={sprint.id}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedSprint(sprint)}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-medium text-base">{sprint.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(sprint.status)}`}>
                      {sprint.status}
                    </span>
                  </div>
                  
                  {sprint.goal && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {sprint.goal}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {sprint.start_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(sprint.start_date).toLocaleDateString()}
                      </span>
                    )}
                    {sprint.end_date && (
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {new Date(sprint.end_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 self-end sm:self-center">
                  {sprint.status === 'planned' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        updateSprintStatus(sprint.id, 'active')
                      }}
                      className="p-1.5 sm:p-1 text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                      title="Start sprint"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                  {sprint.status === 'active' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        updateSprintStatus(sprint.id, 'completed')
                      }}
                      className="p-1.5 sm:p-1 text-muted-foreground hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors"
                      title="Complete sprint"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingSprint(sprint)
                      setIsModalOpen(true)
                    }}
                    className="p-1.5 sm:p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                    title="Edit sprint"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(sprint.id)
                    }}
                    className="p-1.5 sm:p-1 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Delete sprint"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <SprintModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingSprint(null)
        }}
        projectId={projectId}
        onSprintAdded={fetchSprints}
        editSprint={editingSprint}
      />
    </div>
  )
}