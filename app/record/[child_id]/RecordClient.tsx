'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, Square, Send, Save, ArrowLeft, Camera, Check, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Report } from '@/types'
import toast from 'react-hot-toast'

type Props = {
  child: { id: string; name: string }
  classroomId: string
  existingReport: Report | null
  teacherId: string
}

type Sections = {
  meals: string
  nap: string
  activities: string
  mood: string
  milestones: string
}

const SECTION_META = [
  { key: 'meals' as const, emoji: '🍽️', label: 'Meals' },
  { key: 'nap' as const, emoji: '😴', label: 'Nap' },
  { key: 'activities' as const, emoji: '🎨', label: 'Activities' },
  { key: 'mood' as const, emoji: '😊', label: 'Mood & Behavior' },
  { key: 'milestones' as const, emoji: '⭐', label: 'Milestones & Notes' },
]

type Stage =
  | 'idle'
  | 'recording'
  | 'uploading'
  | 'transcribing'
  | 'structuring'
  | 'review'
  | 'sending'
  | 'sent'

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function RecordClient({ child, classroomId, existingReport, teacherId }: Props) {
  const router = useRouter()
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const initialSections: Sections = existingReport
    ? {
        meals: existingReport.meals,
        nap: existingReport.nap,
        activities: existingReport.activities,
        mood: existingReport.mood,
        milestones: existingReport.milestones,
      }
    : { meals: '', nap: '', activities: '', mood: '', milestones: '' }

  const [stage, setStage] = useState<Stage>(existingReport ? 'review' : 'idle')
  const [seconds, setSeconds] = useState(0)
  const [sections, setSections] = useState<Sections>(initialSections)
  const [reportId, setReportId] = useState<string | null>(existingReport?.id || null)
  const [photos] = useState<string[]>(existingReport?.photos || [])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4'

      const recorder = new MediaRecorder(stream, { mimeType })
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(chunksRef.current, { type: mimeType })
        await processAudio(blob, mimeType)
      }

      recorder.start(250)
      mediaRef.current = recorder
      setStage('recording')
      setSeconds(0)

      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s >= 119) {
            stopRecording()
            return 120
          }
          return s + 1
        })
      }, 1000)
    } catch {
      toast.error('Microphone access denied. Please allow microphone access.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (mediaRef.current?.state === 'recording') {
      mediaRef.current.stop()
    }
  }, [])

  async function processAudio(blob: Blob, mimeType: string) {
    setStage('uploading')

    try {
      const formData = new FormData()
      const ext = mimeType.includes('mp4') ? 'mp4' : 'webm'
      formData.append('audio', blob, `recording.${ext}`)
      formData.append('childId', child.id)
      formData.append('teacherId', teacherId)
      formData.append('reportId', reportId || '')

      setStage('transcribing')
      const transcribeRes = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })
      if (!transcribeRes.ok) throw new Error('Transcription failed')
      const { transcript, audioUrl } = await transcribeRes.json()

      setStage('structuring')
      const structureRes = await fetch('/api/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          childName: child.name,
          existingSections: sections,
          childId: child.id,
          teacherId,
          audioUrl,
          reportId,
        }),
      })
      if (!structureRes.ok) throw new Error('Structuring failed')
      const { sections: newSections, reportId: newReportId } = await structureRes.json()

      setSections(newSections)
      setReportId(newReportId)
      setStage('review')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Processing failed'
      toast.error(message)
      setStage('idle')
    }
  }

  async function handleSend() {
    if (!reportId) return
    setStage('sending')

    try {
      // Save current edits first
      const saveRes = await fetch('/api/structure', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, sections }),
      })
      if (!saveRes.ok) throw new Error('Save failed')

      const sendRes = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId }),
      })
      if (!sendRes.ok) throw new Error('Send failed')

      setStage('sent')
      toast.success(`Report sent to parents!`)

      setTimeout(() => {
        router.push(`/classroom/${classroomId}`)
      }, 2000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Send failed'
      toast.error(message)
      setStage('review')
    }
  }

  async function handleSaveDraft() {
    if (!reportId) return
    try {
      await fetch('/api/structure', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, sections }),
      })
      toast.success('Draft saved')
      router.push(`/classroom/${classroomId}`)
    } catch {
      toast.error('Save failed')
    }
  }

  const stageLabel: Record<Stage, string | null> = {
    idle: null,
    recording: null,
    uploading: 'Uploading audio...',
    transcribing: 'Transcribing your voice...',
    structuring: 'AI is writing the report...',
    review: null,
    sending: 'Sending to parents...',
    sent: null,
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Back */}
      <button
        onClick={() => router.push(`/classroom/${classroomId}`)}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-500 font-semibold text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to classroom
      </button>

      {/* Child name */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-3xl font-extrabold text-orange-600 mx-auto mb-3">
          {child.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800">{child.name}</h1>
        <p className="text-slate-500 font-medium mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* IDLE / RECORDING STATE */}
      {(stage === 'idle' || stage === 'recording') && (
        <div className="text-center">
          <p className="text-slate-600 font-semibold mb-2">
            {stage === 'idle'
              ? 'Tap to record. Talk about meals, nap, activities, and mood.'
              : 'Recording... tap to stop.'}
          </p>

          {stage === 'recording' && (
            <p className="text-2xl font-extrabold text-slate-800 mb-6 tabular-nums">
              {formatTime(seconds)}
              <span className="text-slate-400 text-base font-semibold ml-2">/ 2:00 max</span>
            </p>
          )}

          <button
            onClick={stage === 'idle' ? startRecording : stopRecording}
            className={`w-28 h-28 rounded-full shadow-2xl flex items-center justify-center mx-auto transition-all duration-200 active:scale-95 ${
              stage === 'recording'
                ? 'bg-red-500 btn-record-active'
                : 'bg-orange-500 hover:bg-orange-600 hover:scale-105'
            }`}
            aria-label={stage === 'idle' ? 'Start recording' : 'Stop recording'}
          >
            {stage === 'idle' ? (
              <Mic size={44} className="text-white" />
            ) : (
              <Square size={36} className="text-white fill-white" />
            )}
          </button>

          <p className="text-slate-400 text-sm font-semibold mt-5">
            {stage === 'idle' ? 'Tap the microphone to start' : 'Tap to finish recording'}
          </p>

          {existingReport && stage === 'idle' && (
            <button
              onClick={() => setStage('review')}
              className="btn-outline mt-6"
            >
              View existing report →
            </button>
          )}
        </div>
      )}

      {/* PROCESSING STATE */}
      {(stage === 'uploading' || stage === 'transcribing' || stage === 'structuring') && (
        <div className="text-center py-12">
          <Loader2 size={52} className="text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-xl font-bold text-slate-700">{stageLabel[stage]}</p>
          <p className="text-slate-500 font-medium mt-2 text-sm">
            This usually takes 5–10 seconds.
          </p>
        </div>
      )}

      {/* REVIEW STATE */}
      {stage === 'review' && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-extrabold text-slate-800">Review Report</h2>
            <button
              onClick={startRecording}
              className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 font-bold text-sm transition-colors"
            >
              <Mic size={15} /> Re-record
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {SECTION_META.map(({ key, emoji, label }) => (
              <div key={key} className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{emoji}</span>
                  <span className="font-extrabold text-slate-700 text-sm uppercase tracking-wide">
                    {label}
                  </span>
                </div>
                <textarea
                  value={sections[key]}
                  onChange={(e) => setSections((s) => ({ ...s, [key]: e.target.value }))}
                  rows={2}
                  className="w-full text-slate-700 font-medium text-sm resize-none focus:outline-none leading-relaxed"
                  placeholder="Not reported today."
                />
              </div>
            ))}
          </div>

          {/* Photos */}
          <div className="mb-6">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              className="hidden"
              onChange={() => {
                // Photo handling placeholder — upload to Supabase Storage
                toast('Photo upload coming soon!')
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-slate-600 hover:text-orange-500 font-semibold text-sm border-2 border-dashed border-slate-200 hover:border-orange-300 rounded-xl px-4 py-3 w-full justify-center transition-colors"
            >
              <Camera size={18} /> Add Photos
            </button>
            {photos.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {photos.map((url, i) => (
                  <Image
                    key={i}
                    src={url}
                    alt="report photo"
                    width={64}
                    height={64}
                    className="object-cover rounded-xl border border-orange-100"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleSend}
              className="btn-coral w-full gap-2"
            >
              <Send size={18} />
              Send to Parents
            </button>
            <button
              onClick={handleSaveDraft}
              className="btn-outline w-full gap-2"
            >
              <Save size={18} />
              Save as Draft
            </button>
          </div>
        </div>
      )}

      {/* SENDING STATE */}
      {stage === 'sending' && (
        <div className="text-center py-12">
          <Loader2 size={52} className="text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-xl font-bold text-slate-700">Sending to parents...</p>
        </div>
      )}

      {/* SENT STATE */}
      {stage === 'sent' && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 success-anim">
            <Check size={48} className="text-white" strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Report Sent!</h2>
          <p className="text-slate-600 font-medium">
            Parents received {child.name}&apos;s daily report.
          </p>
        </div>
      )}
    </div>
  )
}
