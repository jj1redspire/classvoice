'use client'

import { Clock, MessageCircle, FileX } from 'lucide-react'

const problems = [
  {
    icon: Clock,
    stat: '30 minutes per child, per day',
    body: 'Handwriting or typing individual reports for every child eats your entire nap time. That\'s YOUR break too.',
  },
  {
    icon: MessageCircle,
    stat: 'Parents want more detail',
    body: 'A one-line "Good day!" doesn\'t cut it. Parents want to know what their child ate, how long they napped, who they played with.',
  },
  {
    icon: FileX,
    stat: 'Paper reports get lost',
    body: 'Cubbies, backpacks, car seats — paper reports vanish. Parents never see half of them.',
  },
]

export default function Problem() {
  return (
    <section className="py-20 px-4 bg-[#FFF7ED]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label">THE PROBLEM</p>
          <h2 className="section-headline">
            You Became a Teacher to Teach.<br className="hidden md:block" />
            Not to Write Reports.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map(({ icon: Icon, stat, body }) => (
            <div
              key={stat}
              className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-orange-500 hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Icon size={22} className="text-orange-500" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-lg mb-2">{stat}</h3>
              <p className="text-slate-600 font-medium leading-relaxed text-sm">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
