export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-2xl font-extrabold">
          <span className="text-white">Class</span>
          <span className="text-orange-500">Voice</span>
        </span>

        <div className="flex gap-6 text-sm font-semibold">
          <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="mailto:joel@ashwardgroup.com" className="hover:text-white transition-colors">Contact</a>
        </div>

        <p className="text-sm">© 2026 ClassVoice. All rights reserved.</p>
      </div>
    </footer>
  )
}
