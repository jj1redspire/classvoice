import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AppShell from '@/components/app/AppShell'
import { ArrowRight, Plus, CheckCircle2, Clock } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get center
  const { data: center } = await supabase
    .from('centers')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle()

  // First-time user: no center yet
  if (!center) redirect('/setup')

  // Get classrooms
  const { data: classrooms } = await supabase
    .from('classrooms')
    .select('id, name')
    .eq('center_id', center.id)
    .order('name')

  const today = new Date().toISOString().split('T')[0]

  // For each classroom, get child count and today's sent count
  const stats = await Promise.all(
    (classrooms || []).map(async (cr) => {
      const { count: childCount } = await supabase
        .from('children')
        .select('*', { count: 'exact', head: true })
        .eq('classroom_id', cr.id)

      const { data: childIds } = await supabase
        .from('children')
        .select('id')
        .eq('classroom_id', cr.id)

      const ids = (childIds || []).map((c) => c.id)
      let sentCount = 0

      if (ids.length > 0) {
        const { count } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true })
          .in('child_id', ids)
          .eq('report_date', today)
          .eq('status', 'sent')

        sentCount = count || 0
      }

      return {
        ...cr,
        childCount: childCount || 0,
        sentCount,
        allDone: (childCount || 0) > 0 && sentCount === (childCount || 0),
      }
    })
  )

  const totalSent = stats.reduce((a, s) => a + s.sentCount, 0)
  const totalChildren = stats.reduce((a, s) => a + s.childCount, 0)

  // Subscription status
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('center_id', center.id)
    .maybeSingle()

  return (
    <AppShell>
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">{center.name}</h1>
          <p className="text-slate-500 font-medium mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Today's progress */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 px-5 py-3 text-right">
          <p className="text-slate-500 text-sm font-semibold">Today</p>
          <p className="text-2xl font-extrabold text-slate-800">
            {totalSent}
            <span className="text-slate-400 font-semibold text-base"> / {totalChildren} sent</span>
          </p>
        </div>
      </div>

      {/* Subscription warning */}
      {subscription && subscription.status === 'past_due' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 mb-6 flex items-center justify-between gap-4">
          <p className="text-red-700 font-semibold text-sm">
            Payment failed. Update your billing to keep reports running.
          </p>
          <Link href="/settings" className="btn-coral-sm text-sm bg-red-500 hover:bg-red-600">
            Update Billing
          </Link>
        </div>
      )}

      {!subscription && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4 mb-6 flex items-center justify-between gap-4">
          <p className="text-orange-700 font-semibold text-sm">
            Free trial active. Start your subscription to keep full access.
          </p>
          <Link href="/settings" className="btn-coral-sm text-sm">
            Subscribe — $29/mo
          </Link>
        </div>
      )}

      {/* Classrooms */}
      <div className="grid sm:grid-cols-2 gap-4">
        {stats.map((cr) => (
          <Link
            key={cr.id}
            href={`/classroom/${cr.id}`}
            className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 hover:shadow-md hover:border-orange-300 transition-all duration-200 hover:-translate-y-0.5 group"
          >
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-xl font-extrabold text-slate-800 group-hover:text-orange-500 transition-colors">
                {cr.name}
              </h2>
              {cr.allDone ? (
                <CheckCircle2 size={22} className="text-teal-500 flex-shrink-0" />
              ) : (
                <Clock size={22} className="text-amber-400 flex-shrink-0" />
              )}
            </div>

            <p className="text-slate-500 font-medium text-sm mb-3">
              {cr.childCount} {cr.childCount === 1 ? 'child' : 'children'}
            </p>

            {/* Progress bar */}
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${cr.allDone ? 'bg-teal-500' : 'bg-orange-400'}`}
                style={{
                  width: cr.childCount > 0 ? `${Math.round((cr.sentCount / cr.childCount) * 100)}%` : '0%',
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-xs font-semibold">
                {cr.sentCount} of {cr.childCount} reports sent
              </p>
              <ArrowRight size={16} className="text-orange-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}

        {/* Add classroom */}
        <Link
          href="/settings"
          className="border-2 border-dashed border-orange-200 rounded-2xl p-5 flex items-center justify-center gap-3 hover:border-orange-400 hover:bg-orange-50 transition-all min-h-[140px] group"
        >
          <Plus size={20} className="text-orange-400 group-hover:text-orange-500" />
          <span className="text-orange-500 font-bold">Add Classroom</span>
        </Link>
      </div>
    </AppShell>
  )
}
