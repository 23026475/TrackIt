import { createClient } from './supabase/client'

export interface UploadOptions {
  researchId: string
  file: File
  category: 'image' | 'document' | 'spreadsheet' | 'pdf' | 'handwritten' | 'other'
  description?: string
  tags?: string[]
}

export async function uploadResearchFile({
  researchId,
  file,
  category,
  description,
  tags = []
}: UploadOptions) {
  const supabase = createClient()
  
  try {
    console.log('1. Starting upload for file:', file.name)
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('User error:', userError)
      throw new Error('Authentication error: ' + userError.message)
    }
    if (!user) throw new Error('Not authenticated')
    
    console.log('2. User authenticated:', user.id)

    // Generate unique file path
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
    const filePath = `${user.id}/${researchId}/${timestamp}_${sanitizedFileName}`
    console.log('3. File path:', filePath)

    // Upload file to Supabase Storage
    console.log('4. Attempting to upload to Supabase Storage...')
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('research-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('5. Storage upload error:', uploadError)
      throw new Error(`Storage error: ${uploadError.message}`)
    }
    
    console.log('6. Upload successful:', uploadData)

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('research-files')
      .getPublicUrl(filePath)
    
    console.log('7. Public URL:', publicUrl)

    // Save metadata to database
    console.log('8. Saving to database...')
    const { data: fileRecord, error: dbError } = await supabase
      .from('research_files')
      .insert({
        research_id: researchId,
        user_id: user.id,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        storage_path: filePath,
        cloud_url: publicUrl,
        cloud_provider: 'local',
        category,
        description,
        tags
      })
      .select()
      .single()

    if (dbError) {
      console.error('9. Database error:', dbError)
      throw new Error(`Database error: ${dbError.message}`)
    }

    console.log('10. Success! File record:', fileRecord)
    return { success: true, data: fileRecord }
  } catch (error: any) {
    console.error('Error uploading file:', {
      message: error.message,
      stack: error.stack,
      error
    })
    return { success: false, error: error.message }
  }
}

export async function deleteResearchFile(fileId: string) {
  const supabase = createClient()
  
  try {
    // First, get the file record to get storage_path
    // Type assertion to fix TypeScript error
    const { data: file, error: fetchError } = await supabase
      .from('research_files')
      .select('storage_path')
      .eq('id', fileId)
      .single() as { data: { storage_path: string } | null, error: any }

    if (fetchError || !file) {
      console.error('Error fetching file:', fetchError)
      throw new Error('File not found')
    }

    if (!file.storage_path) {
      throw new Error('No storage path found for file')
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('research-files')
      .remove([file.storage_path])

    if (storageError) {
      console.error('Storage deletion error:', storageError)
      throw new Error(`Storage error: ${storageError.message}`)
    }

    // Delete metadata from database
    const { error: dbError } = await supabase
      .from('research_files')
      .delete()
      .eq('id', fileId)

    if (dbError) {
      console.error('Database deletion error:', dbError)
      throw new Error(`Database error: ${dbError.message}`)
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting file:', error)
    return { success: false, error: error.message }
  }
}

export function getFileCategory(file: File): UploadOptions['category'] {
  const type = file.type
  const name = file.name.toLowerCase()

  if (type.startsWith('image/')) return 'image'
  if (type === 'application/pdf') return 'pdf'
  if (type.includes('spreadsheet') || 
      type.includes('excel') || 
      name.endsWith('.xlsx') || 
      name.endsWith('.xls') || 
      name.endsWith('.csv')) return 'spreadsheet'
  if (type.startsWith('text/') || 
      type.includes('document') ||
      name.endsWith('.docx') || 
      name.endsWith('.doc') || 
      name.endsWith('.txt')) return 'document'
  
  return 'other'
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
}