"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ResearchTasks } from '@/components/ResearchTasks'
import { ResearchKanban } from '@/components/ResearchKanban'
import { useRouter } from 'next/navigation'
import { Research, ResearchFile } from '@/app/types/database'
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  Clock,
  Tag,
  FolderOpen,
  FileText,
  Image,
  FileSpreadsheet,
  File,
  Link as LinkIcon,
  ExternalLink
} from 'lucide-react'

interface ResearchDetailClientProps {
  research: Research
  initialFiles: ResearchFile[]
}

export function ResearchDetailClient({ research, initialFiles }: ResearchDetailClientProps) {
  const router = useRouter()
  const [files] = useState<ResearchFile[]>(initialFiles)
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')

  // Safely parse content - it might be a string, JSON, or null
  const renderContent = () => {
    if (!research.content) return null

    // If it's a string, display it directly
    if (typeof research.content === 'string') {
      // Check if it looks like JSON (starts with { or [)
      if (research.content.trim().startsWith('{') || research.content.trim().startsWith('[')) {
        try {
          const parsed = JSON.parse(research.content)
          // If it's an object with a text property, display that
          if (parsed.text) return parsed.text
          // Otherwise stringify it nicely
          return JSON.stringify(parsed, null, 2)
        } catch {
          // Not valid JSON, display as plain text
          return research.content
        }
      }
      // Plain text
      return research.content
    }

    // If it's already an object
    if (typeof research.content === 'object') {
      return JSON.stringify(research.content, null, 2)
    }

    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200'
      case 'in_progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
      case 'archived': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
      default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'image': return <Image className="h-4 w-4" />
      case 'spreadsheet': return <FileSpreadsheet className="h-4 w-4" />
      case 'pdf': return <FileText className="h-4 w-4" />
      default: return <File className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/research"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Research
        </Link>
        
        <Link
          href={`/research/${research.id}/edit`}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
        >
          <Edit className="h-4 w-4" />
          Edit
        </Link>
      </div>

      {/* Research Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{research.title}</h1>
            {research.description && (
              <p className="text-muted-foreground">{research.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(research.status)}`}>
              {research.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border-t border-border pt-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Created: {new Date(research.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Updated: {new Date(research.updated_at).toLocaleDateString()}</span>
          </div>
          {research.tags && research.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span>{research.tags.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      {research.content && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Notes</h2>
          <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
            {renderContent()}
          </div>
        </div>
      )}

      {/* Files Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Attachments ({files.length})
        </h2>

        {files.length > 0 ? (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="text-muted-foreground">
                  {getCategoryIcon(file.category)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.file_name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatFileSize(file.file_size)}</span>
                    <span>•</span>
                    <span>{file.cloud_provider || 'local'}</span>
                  </div>
                </div>

                {file.cloud_url && (
                  <a
                    href={file.cloud_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors"
                    title="Open file"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No files attached yet
          </p>
        )}
      </div>

      {/* Tasks Section */}
<div className="bg-card border border-border rounded-lg p-6">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-4">
      <h2 className="text-lg font-semibold">Tasks</h2>
      <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
        <button
          onClick={() => setViewMode('list')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            viewMode === 'list'
              ? 'bg-background shadow-sm'
              : 'hover:bg-background/50'
          }`}
        >
          List
        </button>
        <button
          onClick={() => setViewMode('kanban')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            viewMode === 'kanban'
              ? 'bg-background shadow-sm'
              : 'hover:bg-background/50'
          }`}
        >
          Kanban
        </button>
      </div>
    </div>
  </div>

  {viewMode === 'list' ? (
    <ResearchTasks researchId={research.id} />
  ) : (
    <ResearchKanban researchId={research.id} />
  )}
</div>
    </div>
  )
}