"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase/client'
import { Component } from '@/app/types/database'
import { Server, Database, Zap, Plus, Trash2, ExternalLink } from 'lucide-react'
import { ComponentModal } from './ComponentModal'

interface ProjectComponentsProps {
  projectId: string
}

export function ProjectComponents({ projectId }: ProjectComponentsProps) {
  const [components, setComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchComponents()
  }, [projectId])

  const fetchComponents = async () => {
    try {
      const { data, error } = await supabase
        .from('components')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setComponents(data || [])
    } catch (error) {
      console.error('Error fetching components:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this component?')) return

    try {
      const { error } = await supabase
        .from('components')
        .delete()
        .eq('id', id)

      if (error) throw error
      setComponents(prev => prev.filter(c => c.id !== id))
    } catch (error) {
      console.error('Error deleting component:', error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'service':
        return <Server className="h-4 w-4" />
      case 'database':
        return <Database className="h-4 w-4" />
      case 'integration':
        return <Zap className="h-4 w-4" />
      default:
        return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'service':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
      case 'database':
        return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200'
      case 'integration':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
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
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Components</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Component
        </button>
      </div>

      {components.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Server className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No components added yet.</p>
          <p className="text-sm mt-1">Add services, databases, or integrations to track your stack.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {components.map((component) => (
            <div
              key={component.id}
              className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(component.type)}`}>
                    {getTypeIcon(component.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{component.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(component.type)}`}>
                        {component.type}
                      </span>
                    </div>
                    
                    {/* Service Details */}
                    {component.type === 'service' && component.metadata && (
                      <div className="mt-2 text-sm text-muted-foreground space-y-1">
                        {component.metadata.serviceType && (
                          <p>Type: {component.metadata.serviceType}</p>
                        )}
                        {component.metadata.runtime && (
                          <p>Runtime: {component.metadata.runtime}</p>
                        )}
                        {component.metadata.repositoryUrl && (
                          <a
                            href={component.metadata.repositoryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:underline"
                          >
                            Repository <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {component.metadata.deploymentProvider && (
                          <p>Deployed on: {component.metadata.deploymentProvider}</p>
                        )}
                        {component.metadata.notes && (
                          <p className="text-xs italic mt-1">{component.metadata.notes}</p>
                        )}
                      </div>
                    )}

                    {/* Database Details */}
                    {component.type === 'database' && component.metadata && (
                      <div className="mt-2 text-sm text-muted-foreground space-y-1">
                        {component.metadata.databaseType && (
                          <p>Type: {component.metadata.databaseType}</p>
                        )}
                        {component.metadata.host && (
                          <p>Host: {component.metadata.host}</p>
                        )}
                        {component.metadata.managed && (
                          <p className="text-green-600">✓ Managed Database</p>
                        )}
                      </div>
                    )}

                    {/* Integration Details */}
                    {component.type === 'integration' && component.metadata && (
                      <div className="mt-2 text-sm text-muted-foreground space-y-1">
                        {component.metadata.integrationType && (
                          <p>Type: {component.metadata.integrationType}</p>
                        )}
                        {component.metadata.config && (
                          <p className="text-xs italic mt-1">{component.metadata.config}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(component.id)}
                  className="p-1 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  title="Remove component"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ComponentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
        onComponentAdded={fetchComponents}
      />
    </div>
  )
}