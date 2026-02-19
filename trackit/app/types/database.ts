export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          priority: 'low' | 'medium' | 'high'
          status: 'planning' | 'active' | 'paused' | 'completed' | 'maintenance'
          tech_stack: string[] | null
          github_url: string | null
          live_url: string | null
          deadline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          priority?: 'low' | 'medium' | 'high'
          status?: 'planning' | 'active' | 'paused' | 'completed' | 'maintenance'
          tech_stack?: string[] | null
          github_url?: string | null
          live_url?: string | null
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          priority?: 'low' | 'medium' | 'high'
          status?: 'planning' | 'active' | 'paused' | 'completed' | 'maintenance'
          tech_stack?: string[] | null
          github_url?: string | null
          live_url?: string | null
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'review' | 'done'
          priority: 'low' | 'medium' | 'high'
          assignee_id: string | null
          position: number
          estimated_hours: number | null
          labels: string[] | null
          due_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'review' | 'done'
          priority?: 'low' | 'medium' | 'high'
          assignee_id?: string | null
          position?: number
          estimated_hours?: number | null
          labels?: string[] | null
          due_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'review' | 'done'
          priority?: 'low' | 'medium' | 'high'
          assignee_id?: string | null
          position?: number
          estimated_hours?: number | null
          labels?: string[] | null
          due_date?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}