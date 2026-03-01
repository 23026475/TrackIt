// components/ResearchFileList.tsx
"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase/client'
import { ResearchFile } from '@/app/types/database'
import { FileText, Download, ExternalLink } from 'lucide-react'

interface ResearchFileListProps {
  researchId: string
}

export function ResearchFileList({ researchId }: ResearchFileListProps) {
  const [files, setFiles] = useState<ResearchFile[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchFiles()
  }, [researchId])

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('research_files')
        .select('*')
        .eq('research_id', researchId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFiles(data || [])
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  if (loading) {
    return <div className="text-center py-4">Loading files...</div>
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No files attached yet
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg"
        >
          <FileText className="h-5 w-5 text-muted-foreground" />
          
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
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      ))}
    </div>
  )
}