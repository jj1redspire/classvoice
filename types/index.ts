export type Center = {
  id: string
  owner_id: string
  name: string
  created_at: string
}

export type Classroom = {
  id: string
  center_id: string
  name: string
  created_at: string
}

export type Child = {
  id: string
  classroom_id: string
  name: string
  dob: string | null
  parent_emails: string[]
  allergies: string | null
  notes: string | null
  created_at: string
}

export type ReportStatus = 'draft' | 'sent'

export type Report = {
  id: string
  child_id: string
  teacher_id: string
  audio_url: string | null
  transcript: string | null
  meals: string
  nap: string
  activities: string
  mood: string
  milestones: string
  photos: string[]
  pdf_url: string | null
  status: ReportStatus
  parent_token: string
  report_date: string
  created_at: string
}

export type ReportWithChild = Report & {
  children: Pick<Child, 'name' | 'parent_emails'>
}

export type Subscription = {
  id: string
  center_id: string
  stripe_customer_id: string
  stripe_sub_id: string
  status: string
  current_period_end: string
  created_at: string
  updated_at: string
}

export type ReportSections = {
  meals: string
  nap: string
  activities: string
  mood: string
  milestones: string
}
