"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase/client'
import { MessageSquare, Plus, Edit2, Trash2, Calendar, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Comment {
  id: string
  project_id: string
  content: string
  created_at: string
  user_id: string
}

interface ProjectCommentsProps {
  projectId: string
}

export function ProjectComments({ projectId }: ProjectCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchComments()
  }, [projectId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('project_notes')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Fetch error:', error)
        setError(error.message)
        throw error
      }
      
      setComments(data || [])
    } catch (err: any) {
      console.error('Error fetching comments:', err)
      setError(err?.message || 'Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    setError(null)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      console.log('Inserting comment for project:', projectId)
      
      const { data, error } = await supabase
        .from('project_notes')
        .insert([{
          project_id: projectId,
          content: newComment,
          user_id: user.id
        }])
        .select()
        .single()

      if (error) {
        console.error('Insert error:', error)
        throw error
      }

      console.log('Comment added:', data)
      setComments(prev => [data, ...prev])
      setNewComment('')
    } catch (err: any) {
      console.error('Error adding comment:', err)
      setError(err?.message || 'Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (id: string) => {
    if (!editContent.trim()) return

    try {
      setError(null)
      
      const { error } = await supabase
        .from('project_notes')
        .update({ content: editContent })
        .eq('id', id)

      if (error) throw error

      setComments(prev => prev.map(c => 
        c.id === id ? { ...c, content: editContent } : c
      ))
      setEditingId(null)
      setEditContent('')
    } catch (err: any) {
      console.error('Error updating comment:', err)
      setError(err?.message || 'Failed to update comment')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      setError(null)
      
      const { error } = await supabase
        .from('project_notes')
        .delete()
        .eq('id', id)

      if (error) throw error

      setComments(prev => prev.filter(c => c.id !== id))
    } catch (err: any) {
      console.error('Error deleting comment:', err)
      setError(err?.message || 'Failed to delete comment')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Project Updates & Comments</h2>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment or update about this project..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px] resize-y"
              disabled={submitting}
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-start"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No comments yet. Add your first update!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              {editingId === comment.id ? (
                // Edit mode
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingId(null)
                        setEditContent('')
                      }}
                      className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdate(comment.id)}
                      className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <User className="h-3 w-3" />
                      </div>
                      <span className="font-medium">User</span>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={comment.created_at}>
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </time>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingId(comment.id)
                          setEditContent(comment.content)
                        }}
                        className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                        title="Edit comment"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="p-1 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Delete comment"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-foreground whitespace-pre-wrap">{comment.content}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}