"use client"

import { useState } from 'react'
import { createClient } from '@/app/lib/supabase/client'
import { ResearchFile } from '@/app/types/database'
import { 
  FileText,
  Image,
  FileSpreadsheet,
  File,
  Download,
  Trash2,
  ExternalLink,
  Calendar,
  Tag
} from 'lucide-react'
import { deleteResearchFile, formatFileSize } from '@/app/lib/storage'
import { format } from 'date-fns'

interface ResearchFileListProps {
  files: ResearchFile[]
  onFileDeleted?: () => void
}

export function ResearchFileList({ files, onFileDeleted }: ResearchFileListProps) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  const handleDelete = async (file: ResearchFile) => {
    if (!confirm('Are you sure you want to delete this file?')) return
    
    setDeleting(file.id)
    const result = await deleteResearchFile(file.id)
    setDeleting(null)
    
    if (result.success) {
      onFileDeleted?.()
    } else {
      alert('Failed to delete file: ' + result.error)
    }
  }

  const getFileIcon = (category: string) => {
    switch (category) {
      case 'image': return <Image className="h-5 w-5" />
      case 'spreadsheet': return <FileSpreadsheet className="h-5 w-5" />
      case 'pdf': return <FileText className="h-5 w-5" />
      default: return <File className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'image': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-200'
      case 'spreadsheet': return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200'
      case 'pdf': return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
        <File className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No files attached yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:shadow-sm transition-shadow group"
        >
          {/* Icon with category color */}
          <div className={`p-2 rounded-lg ${getCategoryColor(file.category)}`}>
            {getFileIcon(file.category)}
          </div>
          
          {/* File Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground truncate">
                {file.file_name}
              </p>
              {file.cloud_provider === 'local' && (
                <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200 rounded">
                  local
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <span>{formatFileSize(file.file_size)}</span>
              <span>•</span>
              <span className="capitalize">{file.category}</span>
              {file.created_at && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(file.created_at), 'MMM d, yyyy')}</span>
                  </div>
                </>
              )}
            </div>

            {file.tags && file.tags.length > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <Tag className="h-3 w-3 text-muted-foreground" />
                <div className="flex flex-wrap gap-1">
                  {file.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {file.cloud_url && (
              <a
                href={file.cloud_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                title="Download/View"
              >
                <Download className="h-4 w-4" />
              </a>
            )}
            <button
              onClick={() => handleDelete(file)}
              disabled={deleting === file.id}
              className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
              title="Delete"
            >
              {deleting === file.id ? (
                <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}