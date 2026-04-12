'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'How long does it take to create a report?',
    a: '30 seconds of talking. That\'s it. ClassVoice handles the rest — transcription, structuring, and formatting all happen automatically.',
  },
  {
    q: 'Can I edit the report before sending?',
    a: 'Yes. Review every report before it goes to parents. Edit any section, add photos, or regenerate the whole report from scratch.',
  },
  {
    q: 'Do parents need to download an app?',
    a: 'No. Reports are emailed as PDFs and viewable on a simple web portal. Parents just tap the link in their email — no download required.',
  },
  {
    q: "What if I forget to mention something?",
    a: 'Just record again — ClassVoice will merge the new info into the existing report so nothing gets lost.',
  },
  {
    q: 'Is our data safe?',
    a: 'All data is encrypted at rest and in transit. Reports are only visible to the teacher and authorized parents. We never share your data.',
  },
  {
    q: 'Can I customize the report sections?',
    a: 'Yes. Add, remove, or rename sections to match your program. Montessori? Reggio? We\'ve got you.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-orange-100 last:border-0">
      <button
        className="w-full text-left py-5 flex items-center justify-between gap-4 font-bold text-slate-800 hover:text-orange-500 transition-colors min-h-[56px]"
        onClick={() => setOpen(!open)}
      >
        <span>{q}</span>
        <ChevronDown
          size={20}
          className={`text-orange-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="pb-5 text-slate-600 font-medium leading-relaxed text-sm pr-8">{a}</p>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label">FAQ</p>
          <h2 className="section-headline">Questions? We&apos;ve Got Answers.</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-orange-100 px-6">
          {faqs.map((f) => (
            <FAQItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
    </section>
  )
}
