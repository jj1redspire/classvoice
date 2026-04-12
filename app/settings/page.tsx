'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import AppShell from '@/components/app/AppShell'
import { Plus, Trash2, CreditCard, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

type Center = { id: string; name: string }
type Classroom = { id: string; center_id: string; name: string }
type Child = {
  id: string
  classroom_id: string
  name: string
  parent_emails: string[]
  allergies: string | null
}

export default function SettingsPage() {
  const supabaseRef = useRef<SupabaseClient | null>(null)
  const [center, setCenter] = useState<Center | null>(null)
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [children, setChildren] = useState<Record<string, Child[]>>({})
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [newClassroomName, setNewClassroomName] = useState('')
  const [addingClassroom, setAddingClassroom] = useState(false)

  useEffect(() => {
    supabaseRef.current = createClient()
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadData() {
    setLoading(true)
    const { data: { user } } = await supabaseRef.current!.auth.getUser()
    if (!user) return

    const { data: c } = await supabaseRef.current!
      .from('centers')
      .select('*')
      .eq('owner_id', user.id)
      .single()
    if (!c) { setLoading(false); return }

    setCenter(c)

    const { data: crs } = await supabaseRef.current!
      .from('classrooms')
      .select('*')
      .eq('center_id', c.id)
      .order('name')

    setClassrooms(crs || [])

    const childMap: Record<string, Child[]> = {}
    for (const cr of crs || []) {
      const { data: kids } = await supabaseRef.current!
        .from('children')
        .select('*')
        .eq('classroom_id', cr.id)
        .order('name')
      childMap[cr.id] = kids || []
    }
    setChildren(childMap)
    setLoading(false)
  }

  async function addClassroom() {
    if (!center || !newClassroomName.trim()) return
    setAddingClassroom(true)
    const { data, error } = await supabaseRef.current!
      .from('classrooms')
      .insert({ center_id: center.id, name: newClassroomName.trim() })
      .select()
      .single()

    if (error) {
      toast.error(error.message)
    } else {
      setClassrooms((cs) => [...cs, data])
      setChildren((prev) => ({ ...prev, [data.id]: [] }))
      setNewClassroomName('')
      toast.success('Classroom added')
    }
    setAddingClassroom(false)
  }

  async function deleteClassroom(id: string) {
    if (!confirm('Delete this classroom and all its children and reports? This cannot be undone.')) return
    const { error } = await supabaseRef.current!.from('classrooms').delete().eq('id', id)
    if (error) {
      toast.error(error.message)
    } else {
      setClassrooms((cs) => cs.filter((c) => c.id !== id))
      setChildren((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      toast.success('Classroom deleted')
    }
  }

  async function addChild(classroomId: string, name: string, emails: string, allergies: string) {
    const { data, error } = await supabaseRef.current!
      .from('children')
      .insert({
        classroom_id: classroomId,
        name: name.trim(),
        parent_emails: emails.split(',').map((e) => e.trim()).filter(Boolean),
        allergies: allergies.trim() || null,
      })
      .select()
      .single()

    if (error) {
      toast.error(error.message)
    } else {
      setChildren((prev) => ({
        ...prev,
        [classroomId]: [...(prev[classroomId] || []), data],
      }))
      toast.success(`${name} added`)
    }
  }

  async function deleteChild(classroomId: string, childId: string) {
    if (!confirm('Remove this child? Their reports will be deleted.')) return
    const { error } = await supabaseRef.current!.from('children').delete().eq('id', childId)
    if (error) {
      toast.error(error.message)
    } else {
      setChildren((prev) => ({
        ...prev,
        [classroomId]: prev[classroomId].filter((c) => c.id !== childId),
      }))
      toast.success('Child removed')
    }
  }

  async function openBillingPortal() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to open billing portal'
      toast.error(message)
    } finally {
      setPortalLoading(false)
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-500 font-semibold">Loading...</div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <h1 className="text-3xl font-extrabold text-slate-800 mb-8">Settings</h1>

      {/* Center */}
      <section className="card mb-6">
        <h2 className="text-lg font-extrabold text-slate-800 mb-4">Your Center</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-700">{center?.name}</p>
            <p className="text-slate-500 text-sm font-medium">{classrooms.length} classroom{classrooms.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </section>

      {/* Billing */}
      <section className="card mb-6">
        <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
          <CreditCard size={18} className="text-orange-500" /> Billing
        </h2>
        <p className="text-slate-600 font-medium text-sm mb-4">
          $29/month per classroom. 14-day free trial included.
        </p>
        <button
          onClick={openBillingPortal}
          disabled={portalLoading}
          className="btn-outline gap-2"
        >
          <ExternalLink size={16} />
          {portalLoading ? 'Opening...' : 'Manage Billing'}
        </button>
      </section>

      {/* Classrooms */}
      <section className="card mb-6">
        <h2 className="text-lg font-extrabold text-slate-800 mb-4">Classrooms & Children</h2>

        {classrooms.map((cr) => (
          <ClassroomSection
            key={cr.id}
            classroom={cr}
            childList={children[cr.id] || []}
            onDelete={() => deleteClassroom(cr.id)}
            onAddChild={(name, emails, allergies) => addChild(cr.id, name, emails, allergies)}
            onDeleteChild={(childId) => deleteChild(cr.id, childId)}
          />
        ))}

        {/* Add classroom */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-orange-100">
          <input
            type="text"
            className="input-field flex-1"
            placeholder="New classroom name"
            value={newClassroomName}
            onChange={(e) => setNewClassroomName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addClassroom()}
          />
          <button
            onClick={addClassroom}
            disabled={addingClassroom || !newClassroomName.trim()}
            className="btn-coral-sm gap-1 disabled:opacity-50"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </section>
    </AppShell>
  )
}

function ClassroomSection({
  classroom,
  childList,
  onDelete,
  onAddChild,
  onDeleteChild,
}: {
  classroom: Classroom
  childList: Child[]
  onDelete: () => void
  onAddChild: (name: string, emails: string, allergies: string) => void
  onDeleteChild: (id: string) => void
}) {
  const [name, setName] = useState('')
  const [emails, setEmails] = useState('')
  const [allergies, setAllergies] = useState('')
  const [adding, setAdding] = useState(false)

  async function handleAdd() {
    if (!name.trim()) return
    setAdding(true)
    await onAddChild(name, emails, allergies)
    setName('')
    setEmails('')
    setAllergies('')
    setAdding(false)
  }

  return (
    <div className="mb-6 pb-6 border-b border-orange-100 last:border-0 last:mb-0 last:pb-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-extrabold text-slate-700">{classroom.name}</h3>
        <button
          onClick={onDelete}
          className="text-slate-400 hover:text-red-500 transition-colors p-1"
          title="Delete classroom"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {childList.length === 0 && (
        <p className="text-slate-400 text-sm font-medium mb-3 italic">No children yet.</p>
      )}

      <div className="space-y-2 mb-3">
        {childList.map((child) => (
          <div key={child.id} className="flex items-center justify-between bg-orange-50 rounded-xl px-4 py-2">
            <div>
              <p className="font-bold text-slate-700 text-sm">{child.name}</p>
              <p className="text-slate-500 text-xs">{child.parent_emails.join(', ')}</p>
            </div>
            <button
              onClick={() => onDeleteChild(child.id)}
              className="text-slate-400 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Add child form */}
      <div className="bg-slate-50 rounded-xl p-3 space-y-2">
        <input
          type="text"
          className="input-field text-sm py-2"
          placeholder="Child's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="input-field text-sm py-2"
          placeholder="Parent email(s), comma-separated"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
        />
        <input
          type="text"
          className="input-field text-sm py-2"
          placeholder="Allergies / notes (optional)"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
        />
        <button
          onClick={handleAdd}
          disabled={adding || !name.trim()}
          className="btn-coral-sm w-full gap-1 text-sm disabled:opacity-50"
        >
          <Plus size={14} /> Add {name.trim() || 'Child'}
        </button>
      </div>
    </div>
  )
}
