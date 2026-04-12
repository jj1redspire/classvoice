import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error'
    console.error('Webhook signature error:', message)
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const centerId = session.metadata?.center_id
        if (!centerId || !session.subscription) break

        const subId = typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription.id

        const sub = await stripe.subscriptions.retrieve(subId)
        // @ts-expect-error Stripe v22 uses items.data[0].current_period_end
        const periodEnd = sub.items?.data?.[0]?.current_period_end ?? sub.current_period_end

        await supabase.from('subscriptions').upsert(
          {
            center_id: centerId,
            stripe_customer_id: typeof session.customer === 'string'
              ? session.customer
              : (session.customer as Stripe.Customer)?.id,
            stripe_sub_id: subId,
            status: sub.status,
            current_period_end: periodEnd
              ? new Date(periodEnd * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'center_id' }
        )
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const centerId = sub.metadata?.center_id
        if (!centerId) break

        // @ts-expect-error Stripe v22 uses items.data[0].current_period_end
        const periodEnd = sub.items?.data?.[0]?.current_period_end ?? sub.current_period_end

        await supabase
          .from('subscriptions')
          .update({
            status: sub.status,
            current_period_end: periodEnd
              ? new Date(periodEnd * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_sub_id', sub.id)
        break
      }

      case 'invoice.payment_failed': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any
        const subId: string | undefined =
          typeof invoice.subscription === 'string'
            ? invoice.subscription
            : invoice.subscription?.id
        if (!subId) break

        await supabase
          .from('subscriptions')
          .update({ status: 'past_due', updated_at: new Date().toISOString() })
          .eq('stripe_sub_id', subId)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: unknown) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }
}
