'use client'

const reportSections = [
  {
    emoji: '🍽️',
    label: 'Meals',
    text: 'Ate all of her chicken nuggets and applesauce. Drank two cups of water throughout the day.',
    bg: 'bg-orange-50',
  },
  {
    emoji: '😴',
    label: 'Nap',
    text: 'Slept from 12:30–2:00 PM. Fell asleep quickly, woke up happy and ready to play.',
    bg: 'bg-blue-50',
  },
  {
    emoji: '🎨',
    label: 'Activities',
    text: 'Painted a butterfly in art time. Built a tall tower with blocks. Played tag outside with Marcus and Sofia.',
    bg: 'bg-green-50',
  },
  {
    emoji: '😊',
    label: 'Mood & Behavior',
    text: 'Cheerful and energetic all day. Very excited about her painting — she couldn\'t stop talking about it!',
    bg: 'bg-yellow-50',
  },
  {
    emoji: '⭐',
    label: 'Milestones & Notes',
    text: 'Used scissors independently for the first time today! We\'re so proud of her.',
    bg: 'bg-purple-50',
  },
]

export default function SampleReport() {
  return (
    <section className="py-20 px-4 bg-[#FFFBF5]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label">WHAT PARENTS RECEIVE</p>
          <h2 className="section-headline">A Report That Makes Parents Smile</h2>
        </div>

        {/* Report mockup */}
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-semibold">Daily Report</p>
                <h3 className="text-white text-2xl font-extrabold">Emma&apos;s Day</h3>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Sunshine Classroom</p>
                <p className="text-white font-semibold text-sm">Thursday, April 10</p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="p-5 space-y-3">
            {reportSections.map(({ emoji, label, text, bg }) => (
              <div key={label} className={`${bg} rounded-xl p-4`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{emoji}</span>
                  <span className="font-extrabold text-slate-700 text-sm uppercase tracking-wide">{label}</span>
                </div>
                <p className="text-slate-700 text-sm font-medium leading-relaxed pl-8">{text}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-orange-100 flex items-center justify-between">
            <span className="text-slate-500 text-sm font-semibold">Ms. Sarah — Sunshine Classroom</span>
            <span className="text-orange-400 text-xs font-bold">
              Class<span className="text-orange-500">Voice</span>
            </span>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm font-semibold mt-6">
          This report was created from a 28-second voice note.
        </p>
      </div>
    </section>
  )
}
