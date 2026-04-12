import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'

const SYSTEM_PROMPT = `You are ClassVoice, an AI assistant that helps daycare teachers create beautiful daily reports for parents.
A teacher just recorded a voice note about a child's day. Structure their observations into a daily report with these sections:

🍽️ Meals — What the child ate and drank. How much they consumed. Any notable preferences.
😴 Nap — When they slept, how long, how they fell asleep, how they woke up.
🎨 Activities — What they did during the day. Art projects, outdoor play, learning activities, free play. Who they played with.
😊 Mood & Behavior — General temperament, notable moments, social interactions, any challenges.
⭐ Milestones & Notes — Anything special the parent should know. New skills, firsts, reminders.

Rules:
- Keep the teacher's warm, personal tone. Parents want to feel like the teacher is talking to them.
- If the teacher didn't mention information for a section, respond with "Not reported today." for that section.
- Do NOT fabricate details. Only use what the teacher actually said.
- Keep each section 1-3 sentences. Concise but warm.
- Use the child's name naturally in the report.

Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{"meals":"...","nap":"...","activities":"...","mood":"...","milestones":"..."}`

// POST: structure a new transcript into report sections
export async function POST(req: NextRequest) {
  try {
    const {
      transcript,
      childName,
      existingSections,
      childId,
      teacherId,
      audioUrl,
      reportId,
    } = await req.json()

    if (!transcript || !childName || !childId || !teacherId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Build user message — merge existing sections context if re-recording
    const existingContext =
      existingSections &&
      Object.values(existingSections).some((v) => v && v !== 'Not reported today.')
        ? `\n\nThe teacher has already recorded some information. Merge the new transcript with the existing report (don't lose existing details):\n${JSON.stringify(existingSections)}`
        : ''

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Child's name: ${childName}\n\nTeacher's voice note transcript:\n"${transcript}"${existingContext}`,
        },
      ],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''
    const sections = JSON.parse(rawText)

    const supabase = createAdminClient()
    const today = new Date().toISOString().split('T')[0]

    let savedReportId = reportId

    if (reportId) {
      // Update existing report
      const { error } = await supabase
        .from('reports')
        .update({
          transcript,
          audio_url: audioUrl || undefined,
          meals: sections.meals,
          nap: sections.nap,
          activities: sections.activities,
          mood: sections.mood,
          milestones: sections.milestones,
        })
        .eq('id', reportId)

      if (error) throw error
    } else {
      // Create new report
      const { data: newReport, error } = await supabase
        .from('reports')
        .insert({
          child_id: childId,
          teacher_id: teacherId,
          transcript,
          audio_url: audioUrl || null,
          meals: sections.meals,
          nap: sections.nap,
          activities: sections.activities,
          mood: sections.mood,
          milestones: sections.milestones,
          status: 'draft',
          report_date: today,
        })
        .select()
        .single()

      if (error) throw error
      savedReportId = newReport.id
    }

    return NextResponse.json({ sections, reportId: savedReportId })
  } catch (err: unknown) {
    console.error('Structure error:', err)
    const message = err instanceof Error ? err.message : 'Structuring failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// PATCH: save manual edits to sections
export async function PATCH(req: NextRequest) {
  try {
    const { reportId, sections } = await req.json()
    if (!reportId || !sections) {
      return NextResponse.json({ error: 'Missing reportId or sections' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase
      .from('reports')
      .update({
        meals: sections.meals,
        nap: sections.nap,
        activities: sections.activities,
        mood: sections.mood,
        milestones: sections.milestones,
      })
      .eq('id', reportId)

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Update failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
