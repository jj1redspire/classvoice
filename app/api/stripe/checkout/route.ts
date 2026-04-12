import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://classvoice.co'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { classroomCount = 1 } = await req.json()

    const adminSupabase = createAdminClient()
    const { data: center } = await adminSupabase
      .from('centers')
      .select('id, name')
      .eq('owner_id', user.id)
      .single()

    if (!center) return NextResponse.json({ error: 'No center found' }, { status: 404 })

    // Check for existing Stripe customer
    const { data: sub } = await adminSupabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('center_id', center.id)
      .maybeSingle()

    let customerId = sub?.stripe_customer_id

    const stripe = getStripe()
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        name: center.name,
        metadata: { center_id: center.id, user_id: user.id },
      })
      customerId = customer.id
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'ClassVoice Classroom',
              description: 'AI-powered daily reports — unlimited children, unlimited reports',
            },
            unit_amount: 2900,
            recurring: { interval: 'month' },
          },
          quantity: classroomCount,
        },
      ],
      subscription_data: {
        trial_period_days: 14,
        metadata: { center_id: center.id },
      },
      success_url: `${APP_URL}/dashboard?checkout=success`,
      cancel_url: `${APP_URL}/settings?checkout=cancelled`,
      metadata: { center_id: center.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    console.error('Checkout error:', err)
    const message = err instanceof Error ? err.message : 'Checkout failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
