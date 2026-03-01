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
          status: 'planning' | 'active' | 'paused' | 'completed' | 'maintenance' | 'archived'
          tech_stack: string[] | null
          github_url: string | null
          live_url: string | null
          deadline: string | null
          archived: boolean | null
          archived_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          priority?: 'low' | 'medium' | 'high'
          status?: 'planning' | 'active' | 'paused' | 'completed' | 'maintenance' | 'archived'
          tech_stack?: string[] | null
          github_url?: string | null
          live_url?: string | null
          deadline?: string | null
          archived?: boolean | null
          archived_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          priority?: 'low' | 'medium' | 'high'
          status?: 'planning' | 'active' | 'paused' | 'completed' | 'maintenance' | 'archived'
          tech_stack?: string[] | null
          github_url?: string | null
          live_url?: string | null
          deadline?: string | null
          archived?: boolean | null
          archived_at?: string | null
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
          updated_at: string
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
          updated_at?: string
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
          updated_at?: string
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
        Relationships: [
          {
            foreignKeyName: "components_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      research: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          content: string | null
          category: 'literature' | 'experiment' | 'theory' | 'methodology' | 'other'
          tags: string[]
          status: 'draft' | 'in_progress' | 'completed' | 'archived'
          created_at: string
          updated_at: string
          completed_at: string | null
          archived_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          content?: string | null
          category: 'literature' | 'experiment' | 'theory' | 'methodology' | 'other'
          tags?: string[]
          status?: 'draft' | 'in_progress' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          archived_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          content?: string | null
          category?: 'literature' | 'experiment' | 'theory' | 'methodology' | 'other'
          tags?: string[]
          status?: 'draft' | 'in_progress' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          archived_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      research_files: {
  Row: {
    id: string
    research_id: string
    user_id: string
    file_name: string
    file_size: number
    file_type: string
    cloud_provider: 'onedrive' | 'googledrive' | 'dropbox' | 'local' | null
    cloud_file_id: string | null
    cloud_url: string | null
    cloud_metadata: Json
    category: 'image' | 'document' | 'spreadsheet' | 'pdf' | 'handwritten' | 'other'
    description: string | null
    tags: string[]
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    research_id: string
    user_id: string
    file_name: string
    file_size: number
    file_type: string
    cloud_provider?: 'onedrive' | 'googledrive' | 'dropbox' | 'local' | null
    cloud_file_id?: string | null
    cloud_url?: string | null
    cloud_metadata?: Json
    category: 'image' | 'document' | 'spreadsheet' | 'pdf' | 'handwritten' | 'other'
    description?: string | null
    tags?: string[]
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    research_id?: string
    user_id?: string
    file_name?: string
    file_size?: number
    file_type?: string
    cloud_provider?: 'onedrive' | 'googledrive' | 'dropbox' | 'local' | null
    cloud_file_id?: string | null
    cloud_url?: string | null
    cloud_metadata?: Json
    category?: 'image' | 'document' | 'spreadsheet' | 'pdf' | 'handwritten' | 'other'
    description?: string | null
    tags?: string[]
    created_at?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "research_files_research_id_fkey"
      columns: ["research_id"]
      referencedRelation: "research"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "research_files_user_id_fkey"
      columns: ["user_id"]
      referencedRelation: "users"
      referencedColumns: ["id"]
    }
  ]
      }
      user_cloud_connections: {
        Row: {
          id: string
          user_id: string
          provider: 'onedrive' | 'googledrive' | 'dropbox'
          access_token: string
          refresh_token: string
          expires_at: number
          user_email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: 'onedrive' | 'googledrive' | 'dropbox'
          access_token: string
          refresh_token: string
          expires_at: number
          user_email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: 'onedrive' | 'googledrive' | 'dropbox'
          access_token?: string
          refresh_token?: string
          expires_at?: number
          user_email?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_cloud_connections_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      research_tasks: {
  Row: {
    id: string
    research_id: string
    user_id: string
    title: string
    description: string | null
    status: 'todo' | 'in_progress' | 'review' | 'done'
    priority: 'low' | 'medium' | 'high'
    position: number
    labels: string[]
    due_date: string | null
    completed_at: string | null
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    research_id: string
    user_id: string
    title: string
    description?: string | null
    status?: 'todo' | 'in_progress' | 'review' | 'done'
    priority?: 'low' | 'medium' | 'high'
    position?: number
    labels?: string[]
    due_date?: string | null
    completed_at?: string | null
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    research_id?: string
    user_id?: string
    title?: string
    description?: string | null
    status?: 'todo' | 'in_progress' | 'review' | 'done'
    priority?: 'low' | 'medium' | 'high'
    position?: number
    labels?: string[]
    due_date?: string | null
    completed_at?: string | null
    created_at?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "research_tasks_research_id_fkey"
      columns: ["research_id"]
      referencedRelation: "research"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "research_tasks_user_id_fkey"
      columns: ["user_id"]
      referencedRelation: "users"
      referencedColumns: ["id"]
    }
  ]
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

// Add Research helper types
export type Research = Database['public']['Tables']['research']['Row']
export type ResearchInsert = Database['public']['Tables']['research']['Insert']
export type ResearchUpdate = Database['public']['Tables']['research']['Update']

export type ResearchFile = Database['public']['Tables']['research_files']['Row']
export type ResearchFileInsert = Database['public']['Tables']['research_files']['Insert']
export type ResearchFileUpdate = Database['public']['Tables']['research_files']['Update']

export type UserCloudConnection = Database['public']['Tables']['user_cloud_connections']['Row']
export type UserCloudConnectionInsert = Database['public']['Tables']['user_cloud_connections']['Insert']
export type UserCloudConnectionUpdate = Database['public']['Tables']['user_cloud_connections']['Update']

export type ResearchTask = Database['public']['Tables']['research_tasks']['Row']
export type ResearchTaskInsert = Database['public']['Tables']['research_tasks']['Insert']
export type ResearchTaskUpdate = Database['public']['Tables']['research_tasks']['Update']