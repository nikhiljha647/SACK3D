import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Check, AlertCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../services/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [devResetLink, setDevResetLink] = useState('')

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    if (!email) {
      setError('Email is required')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/forgot-password', { email })
      setSuccess(true)
      if (res.data.resetLink) {
        setDevResetLink(res.data.resetLink)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit password reset request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-14">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Forgot Password</h1>
            <p className="text-sm text-gray-500 mt-1.5">Enter your email and we'll help you reset your password.</p>
          </div>

          {success ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Check Your Email</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-sm">
                  We have generated a password reset request. If the account exists, you will find the link logged on the server.
                </p>
              </div>
              
              {/* Development Mode Helper Shortcut */}
              {devResetLink && (
                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl w-full text-left">
                  <p className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-2">🛠️ Development Mode Shortcut</p>
                  <p className="text-xs text-gray-600 mb-3">Instead of checking server stdout, click the button below to test the reset immediately:</p>
                  <a
                    href={devResetLink.replace('http://localhost:5173', '')}
                    className="block text-center w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Reset Password Now
                  </a>
                </div>
              )}

              <div className="mt-6 border-t pt-4 w-full">
                <Link to="/auth" className="text-sm text-orange-500 hover:text-orange-600 font-semibold transition-colors">
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              
              {/* Error Callout */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="flex flex-col gap-1">
                <label htmlFor="forgot-email" className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  disabled={loading}
                  className={`w-full px-4 py-2.5 text-sm text-gray-900 rounded-lg border bg-gray-50 placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:bg-white transition-all
                    ${error ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-orange-400 focus:ring-orange-100'}`}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-60
                  text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </button>

              <div className="text-center border-t border-gray-100 mt-4 pt-4">
                <Link to="/auth" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Nevermind, back to Login
                </Link>
              </div>
            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
