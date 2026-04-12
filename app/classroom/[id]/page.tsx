import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClassroomClient from './ClassroomClient'
import AppShell from '@/components/app/AppShell'

export default async function ClassroomPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: classroom } = await supabase
    .from('classrooms')
    .select('*, centers!inner(owner_id, name)')
    .eq('id', params.id)
    .single()

  if (!classroom) redirect('/dashboard')

  // Verify ownership
  const center = classroom.centers as { owner_id: string; name: string }
  if (center.owner_id !== user.id) redirect('/dashboard')

  const { data: children } = await supabase
    .from('children')
    .select('*')
    .eq('classroom_id', params.id)
    .order('name')

  // Fetch today's reports
  const today = new Date().toISOString().split('T')[0]
  const childIds = (children || []).map((c) => c.id)

  let reports: Record<string, { status: string }> = {}
  if (childIds.length > 0) {
    const { data: todayReports } = await supabase
      .from('reports')
      .select('child_id, status')
      .in('child_id', childIds)
      .eq('report_date', today)

    reports = Object.fromEntries(
      (todayReports || []).map((r) => [r.child_id, { status: r.status }])
    )
  }

  return (
    <AppShell>
      <ClassroomClient
        classroom={{ id: classroom.id, name: classroom.name }}
        centerName={center.name}
        childList={children || []}
        todayReports={reports}
      />
    </AppShell>
  )
}
