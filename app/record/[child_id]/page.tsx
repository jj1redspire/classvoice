import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RecordClient from './RecordClient'
import AppShell from '@/components/app/AppShell'

export default async function RecordPage({
  params,
}: {
  params: { child_id: string }
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: child } = await supabase
    .from('children')
    .select('*, classrooms!inner(id, name, centers!inner(owner_id))')
    .eq('id', params.child_id)
    .single()

  if (!child) redirect('/dashboard')

  const classroom = child.classrooms as {
    id: string
    name: string
    centers: { owner_id: string }
  }
  if (classroom.centers.owner_id !== user.id) redirect('/dashboard')

  // Load today's existing report (if any)
  const today = new Date().toISOString().split('T')[0]
  const { data: existingReport } = await supabase
    .from('reports')
    .select('*')
    .eq('child_id', params.child_id)
    .eq('report_date', today)
    .maybeSingle()

  return (
    <AppShell>
      <RecordClient
        child={{ id: child.id, name: child.name }}
        classroomId={classroom.id}
        existingReport={existingReport}
        teacherId={user.id}
      />
    </AppShell>
  )
}
