import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ResearchDetailClient } from './ResearchDetailClient'

export default async function ResearchDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> // Note: params is a Promise
}) {
  // Await the params first
  const { id } = await params
  
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Ignore if called from Server Component
          }
        },
      },
    }
  )
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/login')
  }

  // Fetch research details using the awaited id
  const { data: research } = await supabase
    .from('research')
    .select('*')
    .eq('id', id) // Use id here
    .single()

  if (!research) {
    redirect('/research')
  }

  // Fetch files for this research
  const { data: files } = await supabase
    .from('research_files')
    .select('*')
    .eq('research_id', id) // Use id here
    .order('created_at', { ascending: false })

  return (
    <ResearchDetailClient 
      research={research} 
      initialFiles={files || []} 
    />
  )
}