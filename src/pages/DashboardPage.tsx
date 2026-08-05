/**
 * DashboardPage — Coin balance and recent activity
 * Fetches /api/dashboard on mount, shows balance card, reward cards, activity list.
 */
import { useEffect, useState } from 'react'
import { Loader2, Box as BoxIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

const API = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api'

interface Activity {
  id: number
  type: string
  title: string
  amount: number
  description: string
  created_at: string
}

interface Reward {
  title: string
  amount: number
  type: string
}

interface DashboardData {
  balance: number
  rewards: Reward[]
  recentActivities: Activity[]
}

// ── Skeleton loader ────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
}

// ── Activity icon by type ──────────────────────────────────────────────────────
function ActivityIcon({ type }: { type: string }) {
  const base = 'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0'
  if (type === 'signup')
    return (
      <div className={`${base} bg-orange-100`}>
        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      </div>
    )
  if (type === 'upload')
    return (
      <div className={`${base} bg-red-100`}>
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
        </svg>
      </div>
    )
  // daily_login or default
  return (
    <div className={`${base} bg-orange-100`}>
      <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
      </svg>
    </div>
  )
}

export default function DashboardPage() {
  const { token, isLoading, setCoins } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isLoading) return
    if (!token) { navigate('/auth'); return }
    axios
      .get(`${API}/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        console.log('Dashboard data:', res.data) // Debug log
        setData(res.data.data)
        setCoins(res.data.data.balance)
      })
      .catch(err => {
        console.error('Dashboard error:', err.response?.data || err.message) // Debug log
        setError('Failed to load dashboard')
      })
      .finally(() => setLoading(false))
  }, [token, navigate, setCoins])

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Navbar />

      <main className="flex-1 flex justify-center pt-20 pb-12 px-4">
        <div className="w-full max-w-3xl">

          {/* Page header */}
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
          <p className="text-sm text-gray-500 mb-6">Your coin balance and recent activity.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          {/* ── Balance card ─────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
              Current Balance
            </p>

            {loading ? (
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-44" />
              </div>
            ) : (
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Balance */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <svg className="w-10 h-10 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" className="text-orange-100" fill="currentColor"/>
                      <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#f97316" fontWeight="bold">$</text>
                    </svg>
                  </div>
                  <span className="text-4xl font-black text-gray-900">{data?.balance ?? 0}</span>
                  <span className="text-lg text-gray-400 font-medium">coins</span>
                </div>

                {/* Upload button */}
                <button
                  onClick={() => navigate('/upload')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Upload model (25)
                </button>
              </div>
            )}

            {/* Reward info cards */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              {loading
                ? [1, 2, 3].map(i => <Skeleton key={i} className="h-16" />)
                : data?.rewards.map(r => (
                  <div
                    key={r.type}
                    className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    <p className="text-xs text-gray-500 mb-1">{r.title}</p>
                    <p className={`text-sm font-bold ${r.amount > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                      {r.amount > 0 ? `+${r.amount}` : r.amount} coins
                    </p>
                  </div>
                ))
              }
            </div>
          </div>

          {/* ── Recent activity ───────────────────────────────────────────── */}
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>

          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-xl p-4 flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-40 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-5 w-10" />
                </div>
              ))}
            </div>
          ) : !data?.recentActivities || data.recentActivities.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No activity yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
              {data.recentActivities.map(act => (
                <div key={act.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <ActivityIcon type={act.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{act.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(act.created_at)}</p>
                  </div>
                  <span className={`text-sm font-bold tabular-nums ${act.amount > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                    {act.amount > 0 ? `+${act.amount}` : act.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
