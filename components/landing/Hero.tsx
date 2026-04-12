'use client'

import Link from 'next/link'
import { Mic, ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="pt-28 pb-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 text-sm font-bold px-4 py-2 rounded-full mb-8 border border-orange-200">
          <Mic size={14} />
          AI-Powered Daily Reports
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-800 leading-[1.1] mb-6 text-balance">
          Daily Reports Parents{' '}
          <span className="text-orange-500">Love.</span>
          <br />
          In 30 Seconds.
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          ClassVoice turns your voice into beautiful daily reports. Just talk about
          each child&apos;s day — meals, naps, activities, mood — and AI does the
          rest. Parents get a professional report by pickup time.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Link href="/login?signup=true" className="btn-coral text-xl gap-2 w-full sm:w-auto">
            Start Free Trial — No Credit Card
            <ArrowRight size={20} />
          </Link>
        </div>

        <p className="text-slate-500 text-sm font-semibold">
          Used by daycare teachers who are tired of writing reports by hand.
        </p>

        {/* Visual demo hint */}
        <div className="mt-14 relative">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 max-w-2xl mx-auto border border-orange-200 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-sm font-semibold">TEACHER RECORDS 30 SECONDS</span>
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">LIVE</span>
            </div>
            <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">
              <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Mic size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="h-3 bg-orange-200 rounded-full mb-2 w-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full w-3/4 animate-pulse" />
                </div>
                <p className="text-slate-500 text-sm font-medium italic">
                  &ldquo;Emma had a great day. She ate all her lunch, napped for 90 minutes...&rdquo;
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center my-4">
              <div className="flex-1 h-px bg-orange-200" />
              <span className="px-3 text-orange-400 font-bold text-sm">AI STRUCTURES</span>
              <div className="flex-1 h-px bg-orange-200" />
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm text-left space-y-2">
              <div className="flex gap-2 text-sm">
                <span>🍽️</span>
                <span className="text-slate-600 font-medium">Ate all her chicken nuggets and applesauce.</span>
              </div>
              <div className="flex gap-2 text-sm">
                <span>😴</span>
                <span className="text-slate-600 font-medium">Slept 12:30–2:00 PM. Woke up happy.</span>
              </div>
              <div className="flex gap-2 text-sm">
                <span>🎨</span>
                <span className="text-slate-600 font-medium">Painted a butterfly. Built a tower with blocks.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
