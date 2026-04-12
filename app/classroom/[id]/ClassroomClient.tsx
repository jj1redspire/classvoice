'use client'

import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { Child } from '@/types'

type Props = {
  classroom: { id: string; name: string }
  centerName: string
  childList: Child[]
  todayReports: Record<string, { status: string }>
}

const statusConfig = {
  not_started: {
    label: 'Not started',
    dot: 'bg-slate-300',
    badge: 'bg-slate-100 text-slate-500',
  },
  draft: {
    label: 'Draft',
    dot: 'bg-amber-400',
    badge: 'bg-amber-100 text-amber-700',
  },
  sent: {
    label: 'Sent ✓',
    dot: 'bg-teal-500',
    badge: 'bg-teal-100 text-teal-700',
  },
}

export default function ClassroomClient({ classroom, centerName, childList, todayReports }: Props) {
  const sentCount = Object.values(todayReports).filter((r) => r.status === 'sent').length
  const totalCount = childList.length
  const pct = totalCount > 0 ? Math.round((sentCount / totalCount) * 100) : 0

  function getStatus(childId: string): keyof typeof statusConfig {
    const r = todayReports[childId]
    if (!r) return 'not_started'
    return r.status as 'draft' | 'sent'
  }

  return (
    <div>
      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-500 font-semibold text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-slate-500 text-sm font-semibold">{centerName}</p>
          <h1 className="text-3xl font-extrabold text-slate-800">{classroom.name}</h1>
        </div>
        <div className="text-right">
          <p className="text-slate-500 text-sm font-semibold">Today&apos;s Reports</p>
          <p className="text-2xl font-extrabold text-slate-800">
            {sentCount}{' '}
            <span className="text-slate-400 font-semibold text-lg">of {totalCount} sent</span>
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-slate-200 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-teal-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Children grid */}
      {childList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-orange-100 shadow-sm">
          <p className="text-5xl mb-4">👶</p>
          <h3 className="text-xl font-extrabold text-slate-700 mb-2">No children yet</h3>
          <p className="text-slate-500 font-medium mb-6">Add children to this classroom to get started.</p>
          <Link href="/settings" className="btn-coral-sm">
            Add Children in Settings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {childList.map((child) => {
            const status = getStatus(child.id)
            const config = statusConfig[status]
            return (
              <Link
                key={child.id}
                href={`/record/${child.id}`}
                className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100 hover:shadow-md hover:border-orange-300 transition-all duration-200 hover:-translate-y-0.5 group"
              >
                {/* Avatar */}
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-xl font-extrabold text-orange-600 mb-3 mx-auto group-hover:bg-orange-200 transition-colors">
                  {child.name.charAt(0).toUpperCase()}
                </div>

                <p className="font-extrabold text-slate-800 text-center truncate">{child.name}</p>

                {/* Status badge */}
                <div className={`mt-2 flex items-center justify-center gap-1.5 ${config.badge} rounded-full px-3 py-1`}>
                  <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                  <span className="text-xs font-bold">{config.label}</span>
                </div>
              </Link>
            )
          })}

          {/* Add child card */}
          <Link
            href="/settings"
            className="bg-orange-50 border-2 border-dashed border-orange-200 rounded-2xl p-5 flex flex-col items-center justify-center hover:border-orange-400 hover:bg-orange-100 transition-all duration-200 min-h-[130px]"
          >
            <Plus size={22} className="text-orange-400 mb-2" />
            <span className="text-orange-500 font-bold text-sm">Add Child</span>
          </Link>
        </div>
      )}
    </div>
  )
}
