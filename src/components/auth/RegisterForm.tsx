import { useState, type FormEvent } from 'react'
import { useAuth } from '../../context/AuthContext'

interface Props { onSuccess: () => void }

export default function RegisterForm({ onSuccess }: Props) {
  const { register } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Name is required'
    else if (name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    if (!email) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Invalid email'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Minimum 6 characters'
    if (!confirmPassword) e.confirmPassword = 'Please confirm your password'
    else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match'
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
      await register({ name, email, password, confirmPassword })
      setSuccess('Account created! Redirecting to sign in…')
      setTimeout(onSuccess, 1500)
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const strength = getStrength(password)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {apiError && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {apiError}
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {success}
        </div>
      )}

      {/* Name */}
      <Field label="Full name" id="reg-name" error={errors.name}>
        <input id="reg-name" type="text" placeholder="Jane Smith" value={name}
          onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
          disabled={loading} className={input(!!errors.name)} />
      </Field>

      {/* Email */}
      <Field label="Email" id="reg-email" error={errors.email}>
        <input id="reg-email" type="email" placeholder="you@example.com" value={email}
          onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
          disabled={loading} className={input(!!errors.email)} />
      </Field>

      {/* Password */}
      <Field label="Password" id="reg-password" error={errors.password}>
        <div className="relative">
          <input id="reg-password" type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters"
            value={password}
            onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
            disabled={loading} className={input(!!errors.password) + ' pr-10'} />
          <button type="button" tabIndex={-1} onClick={() => setShowPw(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <EyeIcon show={showPw} />
          </button>
        </div>
        {/* Strength bar */}
        {password.length > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex gap-1 flex-1">
              {[1,2,3,4].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all
                  ${i <= strength.score ? strength.color : 'bg-gray-200'}`} />
              ))}
            </div>
            <span className={`text-xs font-medium w-10 text-right ${strength.text}`}>{strength.label}</span>
          </div>
        )}
      </Field>

      {/* Confirm password */}
      <Field label="Confirm password" id="reg-confirm" error={errors.confirmPassword}>
        <input id="reg-confirm" type="password" placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={e => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: '' })) }}
          disabled={loading} className={input(!!errors.confirmPassword)} />
      </Field>

      <p className="text-xs text-gray-500">
        By signing up you agree to our{' '}
        <a href="/terms" className="text-orange-500 hover:underline">Terms</a> and{' '}
        <a href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</a>.
      </p>

      <button type="submit" disabled={loading}
        className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-60
          text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
        {loading ? <><Spinner />Creating account...</> : 'Create account'}
      </button>
    </form>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function input(hasError: boolean) {
  return `w-full px-4 py-2.5 text-sm text-gray-900 rounded-lg border bg-gray-50 placeholder:text-gray-400
    focus:outline-none focus:ring-2 focus:bg-white transition-all
    ${hasError ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-orange-400 focus:ring-orange-100'}`
}

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

function EyeIcon({ show }: { show: boolean }) {
  return show
    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function getStrength(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const map = [
    { label: '', color: '', text: '' },
    { label: 'Weak', color: 'bg-red-400', text: 'text-red-500' },
    { label: 'Fair', color: 'bg-yellow-400', text: 'text-yellow-600' },
    { label: 'Good', color: 'bg-blue-400', text: 'text-blue-600' },
    { label: 'Strong', color: 'bg-green-500', text: 'text-green-600' },
  ]
  return { score, ...map[score] }
}
