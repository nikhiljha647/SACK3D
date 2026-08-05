import { useState, useEffect } from 'react'
import { Box } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import Navbar from '../Navbar'

type Tab = 'login' | 'register'

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState<Tab>(
    (searchParams.get('tab') as Tab) || 'login'
  )

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate('/gallery', { replace: true })
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) return null

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-4 pt-20">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-8">
      

          {/* Heading */}
          <h1 className="text-xl font-bold text-gray-900 leading-tight">Welcome to SACK3D</h1>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            Sign in or create an account to upload models.
          </p>

          {/* Tab switcher — matches screenshot exactly */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6" role="tablist">
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer
                  ${tab === t
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {t === 'login' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          {/* Active form */}
          <div key={tab}>
            {tab === 'login'
              ? <LoginForm />
              : <RegisterForm onSuccess={() => setTab('login')} />
            }
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} SACK3D. All rights reserved.
        </p>
      </div>
      </div>
    </div>
  )
}
