"use client"

import { useState } from 'react'
import { X, Archive } from 'lucide-react'
import { createClient } from '@/app/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface ArchiveProjectModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  projectName: string
}

export function ArchiveProjectModal({ isOpen, onClose, projectId, projectName }: ArchiveProjectModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  if (!isOpen) return null

  const handleArchive = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          status: 'archived',
          archived: true,
          archived_at: new Date().toISOString()
        })
        .eq('id', projectId)

      if (error) throw error

      router.push('/history')
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
          <div className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Archive Project</h2>
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
              Are you sure you want to archive <span className="font-bold">{projectName}</span>?
            </p>
            <p className="text-sm text-muted-foreground">
              Archived projects will be moved to the History page. You can restore them later if needed.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleArchive}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Archiving...' : 'Archive Project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}