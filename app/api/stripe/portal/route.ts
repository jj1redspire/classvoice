import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://classvoice.co'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const adminSupabase = createAdminClient()
    const { data: center } = await adminSupabase
      .from('centers')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (!center) return NextResponse.json({ error: 'No center found' }, { status: 404 })

    const { data: sub } = await adminSupabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('center_id', center.id)
      .single()

    if (!sub?.stripe_customer_id) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
    }

    const stripe = getStripe()
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${APP_URL}/settings`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    console.error('Portal error:', err)
    const message = err instanceof Error ? err.message : 'Portal failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
