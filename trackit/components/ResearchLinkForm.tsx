"use client"

import { useState } from 'react'
import { X } from 'lucide-react'

interface ResearchLinkFormProps {
  onSave: (title: string, url: string) => void
  onCancel: () => void
}

export function ResearchLinkForm({ onSave, onCancel }: ResearchLinkFormProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onSave(title.trim() || url, url)
      setTitle('')
      setUrl('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-muted rounded-lg">
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-1">Title (optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Google Doc, Research Paper, etc."
            className="w-full px-3 py-2 text-sm border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">URL *</label>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 text-sm border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-background transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Link
          </button>
        </div>
      </div>
    </form>
  )
}