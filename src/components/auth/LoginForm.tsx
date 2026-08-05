import { useState, type FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!email) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Invalid email'
    if (!password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setApiError('')
    setLoading(true)
    try {
      await login({ email, password, rememberMe })
      navigate('/gallery')
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* API error */}
      {apiError && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {apiError}
        </div>
      )}

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label htmlFor="login-email" className="text-sm font-medium text-gray-700">Email</label>
        <input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
          disabled={loading}
          className={`w-full px-4 py-2.5 text-sm text-gray-900 rounded-lg border bg-gray-50 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:bg-white transition-all
            ${errors.email ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-orange-400 focus:ring-orange-100'}`}
        />
        {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <label htmlFor="login-password" className="text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <input
            id="login-password"
            type={showPw ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
            disabled={loading}
            className={`w-full px-4 py-2.5 pr-10 text-sm text-gray-900 rounded-lg border bg-gray-50 placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:bg-white transition-all
              ${errors.password ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-orange-400 focus:ring-orange-100'}`}
          />
          <button type="button" tabIndex={-1} onClick={() => setShowPw(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPw
              ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            }
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
      </div>

      {/* Remember me + forgot */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-400" />
          <span className="text-gray-600 select-none">Remember me</span>
        </label>
        <Link to="/forgot-password" className="text-orange-500 hover:text-orange-600 font-medium">
          Forgot password?
        </Link>
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading}
        className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-60
          text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
        {loading
          ? <><Spinner />Signing in...</>
          : 'Sign in'
        }
      </button>
    </form>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
