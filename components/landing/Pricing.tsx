'use client'

import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'

const features = [
  'Unlimited children per classroom',
  'Unlimited daily reports',
  'Voice-to-report in 30 seconds',
  'Parent email delivery',
  'Parent portal access',
  'Photo attachments',
  'Report history & archive',
  '14-day free trial',
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 bg-[#FFF7ED]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label">SIMPLE PRICING</p>
          <h2 className="section-headline">One Plan. Every Child. Every Day.</h2>
        </div>

        {/* Pricing card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100 hover:shadow-3xl transition-shadow">
            {/* Top banner */}
            <div className="bg-orange-500 px-6 py-4 text-center">
              <p className="text-white/80 text-sm font-semibold uppercase tracking-widest">Per Classroom</p>
            </div>

            <div className="px-8 py-8">
              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-start justify-center gap-1">
                  <span className="text-2xl font-extrabold text-slate-700 mt-2">$</span>
                  <span className="text-6xl font-extrabold text-slate-800">29</span>
                  <span className="text-xl font-semibold text-slate-500 mt-4">/mo</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-teal-600" strokeWidth={3} />
                    </div>
                    <span className="text-slate-700 font-semibold text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              <Link href="/login?signup=true" className="btn-coral w-full text-center gap-2">
                Start Free Trial
                <ArrowRight size={18} />
              </Link>

              <p className="text-center text-slate-500 text-xs font-semibold mt-4">
                14-day free trial. No credit card required. Cancel anytime.
              </p>
            </div>
          </div>

          <p className="text-center text-slate-500 text-sm font-semibold mt-6">
            Running 5+ classrooms?{' '}
            <a href="mailto:joel@ashwardgroup.com" className="text-orange-500 hover:underline">
              Contact us for volume pricing.
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
