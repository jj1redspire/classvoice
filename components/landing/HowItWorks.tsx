'use client'

const steps = [
  {
    number: '1',
    title: 'Record 30 Seconds',
    body: 'Tap a child\'s name, hit record, talk naturally: "Emma had a great day. She ate all her lunch, napped for 90 minutes, painted a butterfly, and was so happy at pickup." That\'s it.',
  },
  {
    number: '2',
    title: 'AI Creates the Report',
    body: 'ClassVoice transcribes your voice and structures it into a beautiful report: Meals, Nap, Activities, Mood & Behavior, and Milestones — all in the teacher\'s own warm tone.',
  },
  {
    number: '3',
    title: 'Parents Get It Instantly',
    body: 'One tap sends a branded PDF report to parents\' email. They can also check the parent portal anytime. No paper. No lost reports.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label">HOW IT WORKS</p>
          <h2 className="section-headline">Talk. Tap. Done.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center md:text-left">
              <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-extrabold mx-auto md:mx-0 mb-4 shadow-lg shadow-orange-200">
                {step.number}
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-3">{step.title}</h3>
              <p className="text-slate-600 font-medium leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
