import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase/client'
import { Project, ProjectInsert, ProjectUpdate } from '@/app/types/database'
import { useRouter } from 'next/navigation'

// Define a type for project creation that doesn't require user_id
type CreateProjectInput = Omit<ProjectInsert, 'user_id' | 'id' | 'created_at' | 'updated_at'>

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getProject = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (err: any) {
      setError(err.message)
      return null
    }
  }

  const createProject = async (projectData: CreateProjectInput) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const projectWithUser = {
        ...projectData,
        user_id: user.id
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([projectWithUser])
        .select()
        .single()

      if (error) throw error
      
      setProjects(prev => [data, ...prev])
      router.push(`/project/${data.id}`)
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateProject = async (id: string, updates: ProjectUpdate) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      setProjects(prev => prev.map(p => p.id === id ? data : p))
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setProjects(prev => prev.filter(p => p.id !== id))
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    fetchProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
  }
}