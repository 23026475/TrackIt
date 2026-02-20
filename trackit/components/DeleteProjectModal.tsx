"use client"

import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { createClient } from '@/app/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface DeleteProjectModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  projectName: string
}

export function DeleteProjectModal({ isOpen, onClose, projectId, projectName }: DeleteProjectModalProps) {
  const [confirmName, setConfirmName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  if (!isOpen) return null

  const handleDelete = async () => {
    if (confirmName !== projectName) {
      setError(`Project name does not match. Please type "${projectName}" to confirm.`)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) throw error

      router.push('/dashboard')
      router.refresh()
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Delete Project</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <p className="text-foreground">
              This action <span className="font-bold text-red-600">cannot be undone</span>. This will permanently delete:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>The project "{projectName}"</li>
              <li>All tasks associated with this project</li>
              <li>All components (services, databases, integrations)</li>
              <li>All comments and project history</li>
            </ul>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-700 dark:text-red-300">
              Please type <span className="font-mono font-bold">{projectName}</span> to confirm deletion.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <input
            type="text"
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder={`Type "${projectName}" to confirm`}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-red-500"
            autoFocus
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading || confirmName !== projectName}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Deleting...' : 'Permanently Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}