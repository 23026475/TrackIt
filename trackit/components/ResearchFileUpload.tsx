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
  X,
  FileText,
  Image,
  FileSpreadsheet,
  File
} from 'lucide-react'
import { uploadResearchFile, getFileCategory, formatFileSize } from '@/app/lib/storage'

interface ResearchFileUploadProps {
  researchId: string
  onUploadComplete: (file: ResearchFile) => void
}

export function ResearchFileUpload({ researchId, onUploadComplete }: ResearchFileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadQueue, setUploadQueue] = useState<File[]>([])
  const [uploadStatus, setUploadStatus] = useState<Record<string, {
    status: 'pending' | 'uploading' | 'success' | 'error'
    progress?: number
    error?: string
  }>>({})
  
  const supabase = createClient()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadQueue(prev => [...prev, ...acceptedFiles])
    
    // Initialize status for each file
    const newStatus: Record<string, any> = {}
    acceptedFiles.forEach(file => {
      newStatus[file.name] = { status: 'pending' }
    })
    setUploadStatus(prev => ({ ...prev, ...newStatus }))

    // Upload each file
    for (const file of acceptedFiles) {
      setUploadStatus(prev => ({
        ...prev,
        [file.name]: { status: 'uploading', progress: 0 }
      }))

      try {
        const category = getFileCategory(file)
        
        const result = await uploadResearchFile({
          researchId,
          file,
          category,
        })

        if (result.success && result.data) {
          setUploadStatus(prev => ({
            ...prev,
            [file.name]: { status: 'success' }
          }))
          onUploadComplete(result.data)
        } else {
          throw new Error(result.error || 'Upload failed')
        }
      } catch (error: any) {
        setUploadStatus(prev => ({
          ...prev,
          [file.name]: { 
            status: 'error', 
            error: error.message || 'Upload failed'
          }
        }))
      }
    }

    // Remove from queue after processing
    setUploadQueue([])
  }, [researchId, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 50 * 1024 * 1024, // 50MB max
  })

  const removeFromQueue = (fileName: string) => {
    setUploadQueue(prev => prev.filter(f => f.name !== fileName))
    setUploadStatus(prev => {
      const newStatus = { ...prev }
      delete newStatus[fileName]
      return newStatus
    })
  }

  const getFileIcon = (file: File) => {
    const category = getFileCategory(file)
    switch (category) {
      case 'image': return <Image className="h-4 w-4" />
      case 'spreadsheet': return <FileSpreadsheet className="h-4 w-4" />
      case 'pdf': return <FileText className="h-4 w-4" />
      default: return <File className="h-4 w-4" />
    }
  }

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

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploading...</h4>
          {uploadQueue.map((file) => {
            const status = uploadStatus[file.name]
            
            return (
              <div key={file.name} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="text-muted-foreground">
                  {getFileIcon(file)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <button
                      onClick={() => removeFromQueue(file.name)}
                      className="p-1 hover:bg-background rounded"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                <div>
                  {status?.status === 'uploading' && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  )}
                  {status?.status === 'success' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {status?.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}