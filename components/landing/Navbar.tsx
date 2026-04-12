'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-orange-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold">
          <span className="text-slate-800">Class</span>
          <span className="text-orange-500">Voice</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="#how-it-works" className="text-slate-600 hover:text-orange-500 font-semibold transition-colors">
            How It Works
          </Link>
          <Link href="#pricing" className="text-slate-600 hover:text-orange-500 font-semibold transition-colors">
            Pricing
          </Link>
          <Link href="/login" className="text-slate-600 hover:text-orange-500 font-semibold transition-colors">
            Log In
          </Link>
          <Link href="/login?signup=true" className="btn-coral-sm text-sm py-2 px-5">
            Start Free Trial
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-slate-700"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-orange-100 px-4 py-4 flex flex-col gap-4">
          <Link href="#how-it-works" className="text-slate-700 font-semibold py-2" onClick={() => setOpen(false)}>
            How It Works
          </Link>
          <Link href="#pricing" className="text-slate-700 font-semibold py-2" onClick={() => setOpen(false)}>
            Pricing
          </Link>
          <Link href="/login" className="text-slate-700 font-semibold py-2" onClick={() => setOpen(false)}>
            Log In
          </Link>
          <Link href="/login?signup=true" className="btn-coral-sm w-full text-center" onClick={() => setOpen(false)}>
            Start Free Trial
          </Link>
        </div>
      )}
    </nav>
  )
}
