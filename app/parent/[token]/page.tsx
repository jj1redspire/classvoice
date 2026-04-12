import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'

const SECTION_META = [
  { key: 'meals', emoji: '🍽️', label: 'Meals', bg: 'bg-orange-50' },
  { key: 'nap', emoji: '😴', label: 'Nap', bg: 'bg-blue-50' },
  { key: 'activities', emoji: '🎨', label: 'Activities', bg: 'bg-green-50' },
  { key: 'mood', emoji: '😊', label: 'Mood & Behavior', bg: 'bg-yellow-50' },
  { key: 'milestones', emoji: '⭐', label: 'Milestones & Notes', bg: 'bg-purple-50' },
] as const

export default async function ParentPortalPage({
  params,
}: {
  params: { token: string }
}) {
  const supabase = createAdminClient()

  // Find the report by token
  const { data: report } = await supabase
    .from('reports')
    .select(`
      *,
      children (
        name,
        classrooms (
          name,
          centers (
            name
          )
        )
      )
    `)
    .eq('parent_token', params.token)
    .single()

  if (!report || report.status !== 'sent') notFound()

  const child = report.children as {
    name: string
    classrooms: { name: string; centers: { name: string } }
  }

  // Get all sent reports for this child (feed)
  const { data: allReports } = await supabase
    .from('reports')
    .select('id, report_date, meals, nap, activities, mood, milestones, photos, parent_token')
    .eq('child_id', report.child_id)
    .eq('status', 'sent')
    .order('report_date', { ascending: false })
    .limit(30)

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-4 py-8 text-center">
        <p className="text-orange-100 text-sm font-semibold mb-1">
          {child.classrooms?.centers?.name} &bull; {child.classrooms?.name}
        </p>
        <h1 className="text-3xl font-extrabold">{child.name}&apos;s Reports</h1>
        <p className="text-orange-100 text-sm mt-1">
          {allReports?.length || 1} report{(allReports?.length || 1) !== 1 ? 's' : ''} total
        </p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Report feed */}
        {(allReports || [report]).map((r, i) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden mb-6"
          >
            {/* Date header */}
            <div className="bg-orange-50 px-5 py-3 border-b border-orange-100">
              <p className="font-extrabold text-slate-700 text-sm">
                {i === 0 ? '⭐ Most Recent — ' : ''}{formatDate(r.report_date)}
              </p>
            </div>

            {/* Sections */}
            <div className="p-4 space-y-3">
              {SECTION_META.map(({ key, emoji, label, bg }) => {
                const text = r[key as keyof typeof r] as string
                const isEmpty = !text || text === 'Not reported today.'
                return (
                  <div key={key} className={`${bg} rounded-xl p-3`}>
                    <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500 mb-1">
                      {emoji} {label}
                    </p>
                    <p className={`text-sm font-medium leading-relaxed ${isEmpty ? 'text-slate-400 italic' : 'text-slate-700'}`}>
                      {isEmpty ? 'Not reported today.' : text}
                    </p>
                  </div>
                )
              })}

              {/* Photos */}
              {Array.isArray(r.photos) && r.photos.length > 0 && (
                <div className="flex gap-2 flex-wrap pt-1">
                  {r.photos.map((url: string, idx: number) => (
                    <Image
                      key={idx}
                      src={url}
                      alt={`${child.name} photo`}
                      width={96}
                      height={96}
                      className="object-cover rounded-xl border border-orange-100"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-slate-400 text-xs font-semibold">
        <p>
          <span className="text-orange-500 font-bold">Class</span>Voice &bull; Daily reports made simple
        </p>
      </div>
    </div>
  )
}
