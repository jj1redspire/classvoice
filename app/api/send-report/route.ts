import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatDateShort } from '@/lib/utils'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://classvoice.co'

function buildEmailHtml(params: {
  childName: string
  reportDate: string
  meals: string
  nap: string
  activities: string
  mood: string
  milestones: string
  parentToken: string
  teacherName?: string
  classroomName?: string
}): string {
  const {
    childName,
    reportDate,
    meals,
    nap,
    activities,
    mood,
    milestones,
    parentToken,
    classroomName = '',
  } = params

  const portalUrl = `${APP_URL}/parent/${parentToken}`
  const date = formatDateShort(reportDate)

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${childName}'s Daily Report — ${date}</title>
</head>
<body style="margin:0;padding:0;background:#FFFBF5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#F97316,#fb923c);border-radius:20px;padding:28px 32px;margin-bottom:20px;text-align:center;">
      <p style="color:rgba(255,255,255,0.8);font-size:13px;font-weight:600;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px;">Daily Report</p>
      <h1 style="color:white;font-size:28px;font-weight:800;margin:0 0 4px;">${childName}&apos;s Day</h1>
      <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">${classroomName} &bull; ${date}</p>
    </div>

    <!-- Sections -->
    ${buildSection('🍽️', 'Meals', meals, '#FFF7ED')}
    ${buildSection('😴', 'Nap', nap, '#EFF6FF')}
    ${buildSection('🎨', 'Activities', activities, '#F0FDF4')}
    ${buildSection('😊', 'Mood & Behavior', mood, '#FEFCE8')}
    ${buildSection('⭐', 'Milestones & Notes', milestones, '#F5F3FF')}

    <!-- Portal link -->
    <div style="text-align:center;margin:24px 0;">
      <a href="${portalUrl}"
         style="background:#F97316;color:white;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:14px;display:inline-block;">
        View Full Report Online
      </a>
      <p style="color:#94a3b8;font-size:12px;margin-top:10px;">View & share past reports in the parent portal</p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:16px;border-top:1px solid #fde8d6;">
      <p style="color:#94a3b8;font-size:12px;margin:0;">
        <strong style="color:#F97316;">Class</strong><strong>Voice</strong> &bull; Daily reports made simple
      </p>
    </div>
  </div>
</body>
</html>`
}

function buildSection(emoji: string, label: string, text: string, bg: string): string {
  const displayText =
    !text || text === 'Not reported today.' ? '<em style="color:#94a3b8;">Not reported today.</em>' : text

  return `
    <div style="background:${bg};border-radius:14px;padding:16px 20px;margin-bottom:12px;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;">
        ${emoji} ${label}
      </p>
      <p style="margin:0;font-size:15px;color:#334155;line-height:1.6;">${displayText}</p>
    </div>`
}

export async function POST(req: NextRequest) {
  try {
    const { reportId } = await req.json()
    if (!reportId) return NextResponse.json({ error: 'Missing reportId' }, { status: 400 })

    const supabase = createAdminClient()

    // Fetch report + child info
    const { data: report, error: reportErr } = await supabase
      .from('reports')
      .select(`
        *,
        children (
          name,
          parent_emails,
          classrooms (
            name
          )
        )
      `)
      .eq('id', reportId)
      .single()

    if (reportErr || !report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    const child = report.children as {
      name: string
      parent_emails: string[]
      classrooms: { name: string }
    }

    const parentEmails = child.parent_emails || []
    if (parentEmails.length === 0) {
      return NextResponse.json({ error: 'No parent emails configured' }, { status: 400 })
    }

    const emailHtml = buildEmailHtml({
      childName: child.name,
      reportDate: report.report_date,
      meals: report.meals,
      nap: report.nap,
      activities: report.activities,
      mood: report.mood,
      milestones: report.milestones,
      parentToken: report.parent_token,
      classroomName: child.classrooms?.name,
    })

    const resend = new Resend(process.env.RESEND_API_KEY)
    const dateStr = formatDateShort(report.report_date)

    // Send to all parent emails
    await Promise.all(
      parentEmails.map((email) =>
        resend.emails.send({
          from: 'ClassVoice <reports@classvoice.co>',
          to: email,
          subject: `${child.name}'s Daily Report — ${dateStr}`,
          html: emailHtml,
        })
      )
    )

    // Mark report as sent
    await supabase
      .from('reports')
      .update({ status: 'sent' })
      .eq('id', reportId)

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    console.error('Send report error:', err)
    const message = err instanceof Error ? err.message : 'Send failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
