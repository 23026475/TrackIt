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
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      sprints: {
        Row: {
          id: string
          project_id: string
          name: string
          goal: string | null
          start_date: string | null
          end_date: string | null
          status: 'planned' | 'active' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          goal?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: 'planned' | 'active' | 'completed'
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          goal?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: 'planned' | 'active' | 'completed'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sprints_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      project_notes: {
        Row: {
          id: string
          project_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_notes_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      sprint_tasks: {
        Row: {
          sprint_id: string
          task_id: string
        }
        Insert: {
          sprint_id: string
          task_id: string
        }
        Update: {
          sprint_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sprint_tasks_sprint_id_fkey"
            columns: ["sprint_id"]
            referencedRelation: "sprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sprint_tasks_task_id_fkey"
            columns: ["task_id"]
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          }
        ]
      }
      components: {
        Row: {
          id: string
          project_id: string
          type: 'service' | 'database' | 'integration'
          name: string
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          type: 'service' | 'database' | 'integration'
          name: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          type?: 'service' | 'database' | 'integration'
          name?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
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

// Helper types for easier use
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
export type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export type Sprint = Database['public']['Tables']['sprints']['Row']
export type SprintInsert = Database['public']['Tables']['sprints']['Insert']
export type SprintUpdate = Database['public']['Tables']['sprints']['Update']

export type ProjectNote = Database['public']['Tables']['project_notes']['Row']
export type ProjectNoteInsert = Database['public']['Tables']['project_notes']['Insert']

export type Component = Database['public']['Tables']['components']['Row']
export type ComponentInsert = Database['public']['Tables']['components']['Insert']
export type ComponentUpdate = Database['public']['Tables']['components']['Update']