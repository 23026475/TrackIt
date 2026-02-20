"use client"

import { useState } from 'react'
import { X, Server, Database, Zap } from 'lucide-react'
import { createClient } from '@/app/lib/supabase/client'

interface ComponentModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  onComponentAdded: () => void
}

type ComponentType = 'service' | 'database' | 'integration'

export function ComponentModal({ isOpen, onClose, projectId, onComponentAdded }: ComponentModalProps) {
  const [step, setStep] = useState<'select' | 'form'>('select')
  const [selectedType, setSelectedType] = useState<ComponentType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Common fields
  const [name, setName] = useState('')
  
  // Service fields
  const [serviceType, setServiceType] = useState<'api' | 'frontend' | 'worker'>('api')
  const [runtime, setRuntime] = useState('')
  const [repoUrl, setRepoUrl] = useState('')
  const [deploymentProvider, setDeploymentProvider] = useState('')
  const [serviceNotes, setServiceNotes] = useState('')
  
  // Database fields
  const [dbType, setDbType] = useState('')
  const [host, setHost] = useState('')
  const [managed, setManaged] = useState(false)
  
  // Integration fields (simplified for now)
  const [integrationType, setIntegrationType] = useState('')
  const [integrationConfig, setIntegrationConfig] = useState('')
  
  const supabase = createClient()

  if (!isOpen) return null

  const resetForm = () => {
    setStep('select')
    setSelectedType(null)
    setName('')
    setServiceType('api')
    setRuntime('')
    setRepoUrl('')
    setDeploymentProvider('')
    setServiceNotes('')
    setDbType('')
    setHost('')
    setManaged(false)
    setIntegrationType('')
    setIntegrationConfig('')
    setError(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleTypeSelect = (type: ComponentType) => {
    setSelectedType(type)
    setStep('form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedType || !name.trim()) return

    setLoading(true)
    setError(null)

    try {
      // Build metadata based on type
      let metadata = {}
      
      switch (selectedType) {
        case 'service':
          metadata = {
            serviceType,
            runtime,
            repositoryUrl: repoUrl,
            deploymentProvider,
            notes: serviceNotes
          }
          break
        case 'database':
          metadata = {
            databaseType: dbType,
            host,
            managed
          }
          break
        case 'integration':
          metadata = {
            integrationType,
            config: integrationConfig
          }
          break
      }

      const { error } = await supabase
        .from('components')
        .insert([{
          project_id: projectId,
          type: selectedType,
          name: name.trim(),
          metadata
        }])

      if (error) throw error

      onComponentAdded()
      handleClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const renderTypeIcon = (type: ComponentType) => {
    switch (type) {
      case 'service':
        return <Server className="h-6 w-6" />
      case 'database':
        return <Database className="h-6 w-6" />
      case 'integration':
        return <Zap className="h-6 w-6" />
    }
  }

  const renderTypeLabel = (type: ComponentType) => {
    switch (type) {
      case 'service':
        return 'Service'
      case 'database':
        return 'Database'
      case 'integration':
        return 'Integration'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {step === 'select' ? 'Add Component' : `Add ${renderTypeLabel(selectedType!)}`}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {step === 'select' ? (
          <div className="p-6">
            <p className="text-sm text-muted-foreground mb-6">
              What type of component would you like to add?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleTypeSelect('service')}
                className="p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <Server className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Service</h3>
                <p className="text-xs text-muted-foreground mt-1">API, Frontend, Worker</p>
              </button>

              <button
                onClick={() => handleTypeSelect('database')}
                className="p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <Database className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Database</h3>
                <p className="text-xs text-muted-foreground mt-1">PostgreSQL, MongoDB, etc.</p>
              </button>

              <button
                onClick={() => handleTypeSelect('integration')}
                className="p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <Zap className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Integration</h3>
                <p className="text-xs text-muted-foreground mt-1">APIs, Webhooks, Tools</p>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Common Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={`${renderTypeLabel(selectedType!)} name`}
              />
            </div>

            {/* Service Fields */}
            {selectedType === 'service' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="api">API</option>
                    <option value="frontend">Frontend</option>
                    <option value="worker">Worker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Runtime
                  </label>
                  <input
                    type="text"
                    value={runtime}
                    onChange={(e) => setRuntime(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Node.js 18, Python 3.9, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Repository URL
                  </label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Deployment Provider
                  </label>
                  <input
                    type="text"
                    value={deploymentProvider}
                    onChange={(e) => setDeploymentProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Vercel, Render, AWS, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={serviceNotes}
                    onChange={(e) => setServiceNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={2}
                    placeholder="Additional notes about this service"
                  />
                </div>
              </>
            )}

            {/* Database Fields */}
            {selectedType === 'database' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Database Type
                  </label>
                  <input
                    type="text"
                    value={dbType}
                    onChange={(e) => setDbType(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="PostgreSQL, MongoDB, Redis, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Host
                  </label>
                  <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="localhost, remote-host.com, etc."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="managed"
                    checked={managed}
                    onChange={(e) => setManaged(e.target.checked)}
                    className="rounded border-border"
                  />
                  <label htmlFor="managed" className="text-sm text-gray-700 dark:text-gray-300">
                    Managed (cloud database)
                  </label>
                </div>
              </>
            )}

            {/* Integration Fields */}
            {selectedType === 'integration' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Integration Type
                  </label>
                  <input
                    type="text"
                    value={integrationType}
                    onChange={(e) => setIntegrationType(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Stripe, SendGrid, Auth0, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Configuration
                  </label>
                  <textarea
                    value={integrationConfig}
                    onChange={(e) => setIntegrationConfig(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="API keys, endpoints, or configuration details..."
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setStep('select')}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Component'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}