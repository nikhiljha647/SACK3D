import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertTriangle, Check, AlertCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../services/api'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    
    if (!token) {
      setError('Password reset token is missing from the URL.')
      return
    }
    if (!password || !confirmPassword) {
      setError('Both password fields are required.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, password })
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may have expired.')
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
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Reset Password</h1>
            <p className="text-sm text-gray-500 mt-1.5">Choose a secure, strong password for your account.</p>
          </div>

          {!token && (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Invalid Reset Request</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-sm">
                  The password reset token is missing. Please request a new link from the forgot password page.
                </p>
              </div>
              <div className="mt-6 border-t pt-4 w-full">
                <Link to="/forgot-password" className="text-sm text-orange-500 hover:text-orange-600 font-semibold transition-colors">
                  Get New Reset Link
                </Link>
              </div>
            </div>
          )}

          {token && success && (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Password Changed</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-sm">
                  Your account password has been reset successfully. You can now use your new credentials to sign in.
                </p>
              </div>
              <div className="mt-6 border-t pt-4 w-full">
                <Link to="/auth" className="block text-center w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">
                  Sign In Now
                </Link>
              </div>
            </div>
          )}

          {token && !success && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              
              {/* Error Callout */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label htmlFor="reset-password-input" className="text-sm font-medium text-gray-700">New Password</label>
                <input
                  id="reset-password-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  disabled={loading}
                  className={`w-full px-4 py-2.5 text-sm text-gray-900 rounded-lg border bg-gray-50 placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:bg-white transition-all
                    ${error ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-orange-400 focus:ring-orange-100'}`}
                />
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1">
                <label htmlFor="confirm-password-input" className="text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  id="confirm-password-input"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setError('') }}
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
                {loading ? 'Resetting password...' : 'Reset Password'}
              </button>

            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
