'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mic, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export const dynamic = 'force-dynamic'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const isSignup = params.get('signup') === 'true'

  const [mode, setMode] = useState<'login' | 'signup'>(isSignup ? 'signup' : 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMode(isSignup ? 'signup' : 'login')
  }, [isSignup])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        toast.success('Account created! Check your email to confirm.')
        router.push('/setup')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <Mic size={20} className="text-white" />
          </div>
          <span className="text-3xl font-extrabold">
            <span className="text-slate-800">Class</span>
            <span className="text-orange-500">Voice</span>
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800">
          {mode === 'signup' ? 'Start your free trial' : 'Welcome back'}
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          {mode === 'signup'
            ? '14 days free. No credit card required.'
            : 'Sign in to your ClassVoice account'}
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-orange-100">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              className="input-field"
              placeholder="you@daycare.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                className="input-field pr-12"
                placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-coral w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading
              ? 'Please wait...'
              : mode === 'signup'
              ? 'Create Account — Free Trial'
              : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          {mode === 'signup' ? (
            <p className="text-slate-600 text-sm font-medium">
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-orange-500 font-bold hover:underline"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p className="text-slate-600 text-sm font-medium">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-orange-500 font-bold hover:underline"
              >
                Start free trial
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-slate-500 font-semibold">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
