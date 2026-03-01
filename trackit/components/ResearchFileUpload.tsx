"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/app/lib/supabase/client'
import { ResearchFile } from '@/app/types/database'
import { 
  Upload, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  X 
} from 'lucide-react'

interface ResearchFileUploadProps {
  researchId: string
  onUploadComplete: (file: ResearchFile) => void
}

export function ResearchFileUpload({ researchId, onUploadComplete }: ResearchFileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'uploading' | 'success' | 'error'>>({})
  const supabase = createClient()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    
    for (const file of acceptedFiles) {
      const fileId = `${file.name}-${Date.now()}`
      setUploadStatus(prev => ({ ...prev, [fileId]: 'uploading' }))

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        // For now, we'll just store metadata (you can add cloud storage later)
        const category = file.type.startsWith('image/') ? 'image' :
                        file.type.includes('pdf') ? 'pdf' :
                        file.type.includes('spreadsheet') || file.type.includes('excel') ? 'spreadsheet' :
                        'document'

        const { data, error } = await supabase
          .from('research_files')
          .insert({
            research_id: researchId,
            user_id: user.id,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            category,
            cloud_provider: 'local',
            cloud_url: URL.createObjectURL(file), // Temporary URL
          })
          .select()
          .single()

        if (error) throw error

        setUploadStatus(prev => ({ ...prev, [fileId]: 'success' }))
        onUploadComplete(data)
      } catch (error) {
        console.error('Upload failed:', error)
        setUploadStatus(prev => ({ ...prev, [fileId]: 'error' }))
      }
    }
    
    setUploading(false)
  }, [researchId, supabase, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 50 * 1024 * 1024, // 50MB max
  })

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-border hover:border-blue-400 hover:bg-muted/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        {isDragActive ? (
          <p className="text-blue-600 dark:text-blue-400">Drop files here...</p>
        ) : (
          <div>
            <p className="text-sm text-foreground mb-1">
              Drag & drop files here, or click to select
            </p>
            <p className="text-xs text-muted-foreground">
              Images, PDFs, Excel, Word (max 50MB)
            </p>
          </div>
        )}
      </div>

      {/* Upload status */}
      {Object.entries(uploadStatus).map(([fileId, status]) => (
        <div key={fileId} className="flex items-center gap-2 p-2 bg-muted rounded-lg text-sm">
          {status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
          {status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
          {status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
          <span className="flex-1 truncate">{fileId.replace(/-.*$/, '')}</span>
          {status === 'success' && (
            <button className="p-1 hover:bg-background rounded">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}