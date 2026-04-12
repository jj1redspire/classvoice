'use client'

const audiences = [
  {
    emoji: '🏠',
    title: 'In-home daycare providers',
    body: 'Running everything yourself? ClassVoice gives you professional reports without a staff.',
  },
  {
    emoji: '🏫',
    title: 'Daycare center directors',
    body: 'Roll it out across all classrooms. Consistent, branded reports from every teacher.',
  },
  {
    emoji: '🌱',
    title: 'Preschool teachers',
    body: 'Finally, a report tool as easy as talking to a friend.',
  },
  {
    emoji: '🎯',
    title: 'Montessori & specialty programs',
    body: "Customize report sections to match your program's philosophy.",
  },
]

export default function WhoItsFor() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label">BUILT FOR</p>
          <h2 className="section-headline">
            Every Daycare. Every Classroom. Every Child.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {audiences.map(({ emoji, title, body }) => (
            <div
              key={title}
              className="flex gap-4 p-6 rounded-2xl border border-orange-100 bg-[#FFFBF5] hover:shadow-md transition-shadow"
            >
              <span className="text-3xl flex-shrink-0">{emoji}</span>
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg mb-1">{title}</h3>
                <p className="text-slate-600 font-medium text-sm leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
