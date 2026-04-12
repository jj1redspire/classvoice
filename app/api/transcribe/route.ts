import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File | null
    const childId = formData.get('childId') as string
    const teacherId = formData.get('teacherId') as string

    if (!audioFile || !childId || !teacherId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const today = new Date().toISOString().split('T')[0]
    const ext = audioFile.name.endsWith('.mp4') ? 'mp4' : 'webm'
    const path = `audio/${teacherId}/${childId}/${today}.${ext}`

    // Upload to Supabase Storage
    const audioBuffer = await audioFile.arrayBuffer()
    const { error: uploadErr } = await supabase.storage
      .from('audio')
      .upload(path, audioBuffer, {
        contentType: audioFile.type,
        upsert: true,
      })

    if (uploadErr) {
      console.error('Storage upload error:', uploadErr)
      // Continue without storage — transcribe from memory
    }

    const { data: { publicUrl } } = supabase.storage.from('audio').getPublicUrl(path)

    // Transcribe with Whisper
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
    })

    return NextResponse.json({
      transcript: transcription.text,
      audioUrl: uploadErr ? null : publicUrl,
    })
  } catch (err: unknown) {
    console.error('Transcribe error:', err)
    const message = err instanceof Error ? err.message : 'Transcription failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
