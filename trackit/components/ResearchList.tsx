// components/ResearchList.tsx
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/app/lib/supabase/client'
import { Research } from '@/app/types/database'
import { 
  FileText, 
  Plus, 
  Search,
  Filter,
  BookOpen,
  FlaskConical,
  Brain,
  Wrench,
  MoreHorizontal 
} from 'lucide-react'

interface ResearchListProps {
  initialResearch?: Research[]
}

export function ResearchList({ initialResearch = [] }: ResearchListProps) {
  const [research, setResearch] = useState<Research[]>(initialResearch)
  const [loading, setLoading] = useState(!initialResearch.length)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const supabase = createClient()

  useEffect(() => {
    if (!initialResearch.length) {
      fetchResearch()
    }
  }, [])

  const fetchResearch = async () => {
    try {
      const { data, error } = await supabase
        .from('research')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setResearch(data || [])
    } catch (error) {
      console.error('Error fetching research:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredResearch = research.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'literature': return BookOpen
      case 'experiment': return FlaskConical
      case 'theory': return Brain
      case 'methodology': return Wrench
      default: return FileText
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'literature': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-200'
      case 'experiment': return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200'
      case 'theory': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
      case 'methodology': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-200'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Research Notes</h1>
        <Link
          href="/research/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Research
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search research notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="all">All Categories</option>
            <option value="literature">Literature Review</option>
            <option value="experiment">Experiment</option>
            <option value="theory">Theory</option>
            <option value="methodology">Methodology</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Research Grid */}
      {filteredResearch.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No research notes found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || categoryFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Get started by creating your first research note'}
          </p>
          {(searchTerm || categoryFilter !== 'all') ? (
            <button
              onClick={() => {
                setSearchTerm('')
                setCategoryFilter('all')
              }}
              className="text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          ) : (
            <Link
              href="/research/new"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-4 w-4" />
              Create Research Note
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredResearch.map((item) => {
            const Icon = getCategoryIcon(item.category)
            
            return (
              <Link
                key={item.id}
                href={`/research/${item.id}`}
                className="block bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all hover:border-primary"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${getCategoryColor(item.category)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200' :
                    item.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200' :
                    item.status === 'archived' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">
                  {item.title}
                </h3>
                
                {item.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="px-2 py-0.5 text-xs text-muted-foreground">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-4 text-xs text-muted-foreground">
                  Updated {new Date(item.updated_at).toLocaleDateString()}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}