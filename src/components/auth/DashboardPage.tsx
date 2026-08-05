import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

interface Stats { modelsUploaded: number; qrCodesGenerated: number; scansToday: number }

export default function DashboardPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<Stats | null>(null)
  const [apiErr, setApiErr] = useState('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate('/auth', { replace: true })
  }, [isAuthenticated, isLoading, navigate])

  useEffect(() => {
    if (!isAuthenticated) return
    api.get('/dashboard')
      .then(r => setStats(r.data.data?.stats ?? null))
      .catch(e => setApiErr(e.message))
  }, [isAuthenticated])

  const handleLogout = async () => { await logout(); navigate('/auth') }

  if (isLoading) return (
    <div className="min-h-screen bg-[#eef0f3] flex items-center justify-center">
      <svg className="animate-spin w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>
  )

  const statCards = [
    { label: 'Models uploaded',     value: stats?.modelsUploaded     ?? 0, bg: 'bg-orange-50', fg: 'text-orange-500' },
    { label: 'QR codes generated',  value: stats?.qrCodesGenerated   ?? 0, bg: 'bg-blue-50',   fg: 'text-blue-500'   },
    { label: 'Scans today',          value: stats?.scansToday         ?? 0, bg: 'bg-green-50',  fg: 'text-green-500'  },
  ]

  return (
    <div className="min-h-screen bg-[#eef0f3]">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-bold text-gray-900 tracking-tight">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-[10px]">S3D</span>
            </div>
            SACK<span className="text-orange-500">3D</span>
          </a>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-orange-600 font-semibold text-xs">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900
                border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {apiErr && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{apiErr}</div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here's your SACK3D dashboard.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {statCards.map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{s.label}</p>
              <p className={`text-3xl font-bold ${s.fg}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Account info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Account details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Full name', value: user?.name },
              { label: 'Email', value: user?.email },
              { label: 'Role', value: user?.role },
              { label: 'Member since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—' },
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{item.label}</p>
                <p className="text-sm text-gray-800 font-medium">{item.value || '—'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upload CTA */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Upload your first 3D model</p>
            <p className="text-xs text-gray-500 mt-0.5">Accepts .glb and .gltf — from SolidWorks, Fusion 360, Revit</p>
          </div>
          <button className="px-5 py-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold rounded-lg transition-all flex-shrink-0">
            Upload model
          </button>
        </div>
      </main>
    </div>
  )
}
