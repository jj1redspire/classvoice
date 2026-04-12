'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Nap Time Is YOUR Time Again
        </h2>
        <p className="text-xl text-orange-100 font-medium mb-10">
          Stop writing reports. Start talking. 30 seconds per child.
        </p>
        <Link
          href="/login?signup=true"
          className="inline-flex items-center gap-2 bg-white text-orange-500 font-extrabold text-xl py-4 px-10 rounded-2xl hover:bg-orange-50 transition-all duration-200 hover:scale-105 shadow-xl"
        >
          Start Your Free Trial
          <ArrowRight size={22} />
        </Link>
        <p className="mt-5 text-orange-200 text-sm font-semibold">
          No credit card required. 14-day free trial.
        </p>
      </div>
    </section>
  )
}
