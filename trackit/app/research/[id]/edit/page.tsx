import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ResearchEditForm  from '@/components/ResearchEditForm'

export default async function ResearchEditPage({ 
  params 
}: { 
  params: Promise<{ id: string }>
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

  // Fetch research details
  const { data: research } = await supabase
    .from('research')
    .select('*')
    .eq('id', id)
    .single()

  if (!research) {
    redirect('/research')
  }

  // Check if user owns this research
  if (research.user_id !== session.user.id) {
    redirect('/research')
  }

  return <ResearchEditForm research={research} />
}