'use client'

export const dynamic = 'force-dynamic'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import { Plus, Trash2, ArrowRight, Mic } from 'lucide-react'
import toast from 'react-hot-toast'

type ClassroomDraft = {
  id: string
  name: string
  children: ChildDraft[]
}

type ChildDraft = {
  id: string
  name: string
  parent_emails: string
  allergies: string
}

function uid() {
  return Math.random().toString(36).slice(2)
}

function makeClassroom(): ClassroomDraft {
  return {
    id: uid(),
    name: '',
    children: [makeChild()],
  }
}

function makeChild(): ChildDraft {
  return { id: uid(), name: '', parent_emails: '', allergies: '' }
}

export default function SetupPage() {
  const router = useRouter()
  const supabaseRef = useRef<SupabaseClient | null>(null)
  function getSupabase() {
    if (!supabaseRef.current) supabaseRef.current = createClient()
    return supabaseRef.current
  }

  const [step, setStep] = useState(1)
  const [centerName, setCenterName] = useState('')
  const [classrooms, setClassrooms] = useState<ClassroomDraft[]>([makeClassroom()])
  const [saving, setSaving] = useState(false)

  function updateClassroom(id: string, update: Partial<ClassroomDraft>) {
    setClassrooms((cs) => cs.map((c) => (c.id === id ? { ...c, ...update } : c)))
  }

  function addClassroom() {
    setClassrooms((cs) => [...cs, makeClassroom()])
  }

  function removeClassroom(id: string) {
    setClassrooms((cs) => cs.filter((c) => c.id !== id))
  }

  function addChild(classroomId: string) {
    updateClassroom(classroomId, {
      children: [
        ...(classrooms.find((c) => c.id === classroomId)?.children || []),
        makeChild(),
      ],
    })
  }

  function updateChild(classroomId: string, childId: string, update: Partial<ChildDraft>) {
    setClassrooms((cs) =>
      cs.map((c) =>
        c.id === classroomId
          ? {
              ...c,
              children: c.children.map((ch) =>
                ch.id === childId ? { ...ch, ...update } : ch
              ),
            }
          : c
      )
    )
  }

  function removeChild(classroomId: string, childId: string) {
    setClassrooms((cs) =>
      cs.map((c) =>
        c.id === classroomId
          ? { ...c, children: c.children.filter((ch) => ch.id !== childId) }
          : c
      )
    )
  }

  async function handleFinish() {
    setSaving(true)
    try {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create center
      const { data: center, error: centerErr } = await supabase
        .from('centers')
        .insert({ owner_id: user.id, name: centerName.trim() })
        .select()
        .single()

      if (centerErr) throw centerErr

      // Create classrooms + children
      for (const cr of classrooms) {
        if (!cr.name.trim()) continue

        const { data: classroom, error: crErr } = await supabase
          .from('classrooms')
          .insert({ center_id: center.id, name: cr.name.trim() })
          .select()
          .single()

        if (crErr) throw crErr

        const validChildren = cr.children.filter((c) => c.name.trim())
        if (validChildren.length > 0) {
          const { error: childErr } = await supabase.from('children').insert(
            validChildren.map((c) => ({
              classroom_id: classroom.id,
              name: c.name.trim(),
              parent_emails: c.parent_emails
                .split(',')
                .map((e) => e.trim())
                .filter(Boolean),
              allergies: c.allergies.trim() || null,
            }))
          )
          if (childErr) throw childErr
        }
      }

      toast.success('Setup complete! Welcome to ClassVoice.')
      router.push('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Setup failed'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
              <Mic size={18} className="text-white" />
            </div>
            <span className="text-2xl font-extrabold">
              <span className="text-slate-800">Class</span>
              <span className="text-orange-500">Voice</span>
            </span>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-orange-500' : 'bg-orange-200'
                } ${s === 2 ? 'w-16' : 'w-8'}`}
              />
            ))}
          </div>
          <p className="text-slate-500 text-sm font-semibold mt-2">
            Step {step} of 3
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-orange-100">
          {/* STEP 1: Center name */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
                What&apos;s your center called?
              </h2>
              <p className="text-slate-500 font-medium mb-6">
                This is the name that will appear on all your reports.
              </p>
              <input
                type="text"
                className="input-field text-lg"
                placeholder="e.g. Sunshine Kids Daycare"
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
                autoFocus
              />
              <button
                onClick={() => setStep(2)}
                disabled={!centerName.trim()}
                className="btn-coral w-full mt-6 gap-2 disabled:opacity-50 disabled:hover:scale-100"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 2: Classrooms */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
                Set up your classrooms
              </h2>
              <p className="text-slate-500 font-medium mb-6">
                Name each classroom. You can add more later.
              </p>

              <div className="space-y-3 mb-4">
                {classrooms.map((cr) => (
                  <div key={cr.id} className="flex gap-3 items-center">
                    <input
                      type="text"
                      className="input-field flex-1"
                      placeholder={`Classroom name (e.g. Butterflies)`}
                      value={cr.name}
                      onChange={(e) => updateClassroom(cr.id, { name: e.target.value })}
                    />
                    {classrooms.length > 1 && (
                      <button
                        onClick={() => removeClassroom(cr.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addClassroom}
                className="flex items-center gap-2 text-orange-500 font-bold text-sm hover:text-orange-600 transition-colors mb-6"
              >
                <Plus size={16} /> Add another classroom
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="btn-outline flex-1"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!classrooms.some((c) => c.name.trim())}
                  className="btn-coral flex-1 gap-2 disabled:opacity-50 disabled:hover:scale-100"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Children */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
                Add your children
              </h2>
              <p className="text-slate-500 font-medium mb-6">
                Add at least one child per classroom. You can add more later.
              </p>

              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-1">
                {classrooms.filter((c) => c.name.trim()).map((cr) => (
                  <div key={cr.id}>
                    <h3 className="font-extrabold text-slate-700 text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full" />
                      {cr.name}
                    </h3>

                    <div className="space-y-4">
                      {cr.children.map((ch) => (
                        <div key={ch.id} className="bg-orange-50 rounded-2xl p-4 space-y-3">
                          <div className="flex gap-3 items-start">
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                className="input-field"
                                placeholder="Child's name"
                                value={ch.name}
                                onChange={(e) =>
                                  updateChild(cr.id, ch.id, { name: e.target.value })
                                }
                              />
                              <input
                                type="text"
                                className="input-field text-sm"
                                placeholder="Parent email(s), comma-separated"
                                value={ch.parent_emails}
                                onChange={(e) =>
                                  updateChild(cr.id, ch.id, { parent_emails: e.target.value })
                                }
                              />
                              <input
                                type="text"
                                className="input-field text-sm"
                                placeholder="Allergies / notes (optional)"
                                value={ch.allergies}
                                onChange={(e) =>
                                  updateChild(cr.id, ch.id, { allergies: e.target.value })
                                }
                              />
                            </div>
                            {cr.children.length > 1 && (
                              <button
                                onClick={() => removeChild(cr.id, ch.id)}
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors mt-1"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => addChild(cr.id)}
                      className="flex items-center gap-2 text-orange-500 font-bold text-sm hover:text-orange-600 transition-colors mt-3"
                    >
                      <Plus size={14} /> Add child to {cr.name}
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="btn-outline flex-1">
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={saving}
                  className="btn-coral flex-1 gap-2 disabled:opacity-60 disabled:hover:scale-100"
                >
                  {saving ? 'Saving...' : 'Finish Setup →'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
