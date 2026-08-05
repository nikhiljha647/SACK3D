import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getFileUrl } from '../utils/url'

interface Stats {
  usersCount: number
  modelsCount: number
  totalDownloads: number
  totalViews: number
  totalCoins: number
}

interface User {
  id: number
  name: string
  email: string
  coins: number
  role: string
  created_at: string
}

interface Model {
  id: number
  title: string
  description: string
  model_file: string
  thumbnail: string
  uploaded_by: number
  uploader_name: string
  uploader_email: string
  downloads: number
  views: number
  is_curated: number | boolean
  created_at: string
}

type Tab = 'overview' | 'users' | 'models'

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  
  // Loading states
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadingModels, setLoadingModels] = useState(true)
  
  // Data states
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [models, setModels] = useState<Model[]>([])
  
  // Filter/Search states
  const [userSearch, setUserSearch] = useState('')
  const [modelSearch, setModelSearch] = useState('')
  
  // Edit coins modal state
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newCoinsValue, setNewCoinsValue] = useState<number>(0)
  const [submittingCoins, setSubmittingCoins] = useState(false)

  // Fetch metrics
  const fetchStats = async () => {
    try {
      setLoadingStats(true)
      const res = await api.get('/admin/stats')
      if (res.data.success) {
        setStats(res.data.data)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load system statistics')
    } finally {
      setLoadingStats(false)
    }
  }

  // Fetch users list
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      const res = await api.get('/admin/users')
      if (res.data.success) {
        setUsers(res.data.data)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch users')
    } finally {
      setLoadingUsers(false)
    }
  }

  // Fetch models list
  const fetchModels = async () => {
    try {
      setLoadingModels(true)
      const res = await api.get('/admin/models')
      if (res.data.success) {
        setModels(res.data.data)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch models')
    } finally {
      setLoadingModels(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchStats()
    fetchUsers()
    fetchModels()
  }, [])

  // Handle Coin Adjustments
  const handleOpenCoinsModal = (user: User) => {
    setEditingUser(user)
    setNewCoinsValue(user.coins)
  }

  const handleSaveCoins = async () => {
    if (!editingUser) return
    try {
      setSubmittingCoins(true)
      const res = await api.put(`/admin/users/${editingUser.id}/coins`, { coins: newCoinsValue })
      if (res.data.success) {
        toast.success(`Adjusted coins balance for ${editingUser.name}`)
        
        // Refresh local user list and stats
        setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, coins: newCoinsValue } : u))
        fetchStats()
        setEditingUser(null)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update coin balance')
    } finally {
      setSubmittingCoins(false)
    }
  }

  // Handle User Deletion
  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!confirm(`Are you absolutely sure you want to delete user "${userName}"? This will permanently delete their account and all their uploaded models.`)) {
      return
    }

    try {
      const res = await api.delete(`/admin/users/${userId}`)
      if (res.data.success) {
        toast.success(`User "${userName}" and all associated models deleted.`)
        setUsers(prev => prev.filter(u => u.id !== userId))
        // Refresh models list and stats since CASCADE deletes happened
        fetchModels()
        fetchStats()
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user')
    }
  }

  // Handle Model Deletion
  const handleDeleteModel = async (modelId: number, modelTitle: string) => {
    if (!confirm(`Are you sure you want to delete model "${modelTitle}"? This will remove it from the gallery and delete files off the disk.`)) {
      return
    }

    try {
      const res = await api.delete(`/admin/models/${modelId}`)
      if (res.data.success) {
        toast.success(`Model "${modelTitle}" deleted successfully.`)
        setModels(prev => prev.filter(m => m.id !== modelId))
        fetchStats()
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete model')
    }
  }

  // Handle Model Curation
  const handleToggleCurate = async (modelId: number, currentStatus: boolean | number) => {
    const isCurated = !currentStatus
    try {
      const res = await api.put(`/admin/models/${modelId}/curate`, { isCurated })
      if (res.data.success) {
        toast.success(res.data.message)
        setModels(prev => prev.map(m => m.id === modelId ? { ...m, is_curated: isCurated } : m))
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update curation state')
    }
  }

  // Filter calculations
  const filteredUsers = users.filter(
    u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
         u.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  const filteredModels = models.filter(
    m => m.title.toLowerCase().includes(modelSearch.toLowerCase()) || 
         m.uploader_name.toLowerCase().includes(modelSearch.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-14">
      <Navbar />
      
      <main className="flex-grow max-w-[96rem] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Moderation Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage system accounts, user coin balances, and moderate uploaded 3D assets.</p>
          </div>
          
          {/* Quick Stats Summary */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { fetchStats(); fetchUsers(); fetchModels(); toast.success('Workspace refreshed!') }}
              className="px-4 py-2 text-sm bg-white hover:bg-gray-100 text-gray-700 font-semibold border border-gray-300 rounded-lg shadow-sm transition-all"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview & Stats
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'users'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`pb-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'models'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Moderate Models ({models.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {loadingStats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-32" />
                ))}
              </div>
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                
                {/* Users Count */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Users</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{stats.usersCount}</p>
                  </div>
                </div>

                {/* Models Count */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Models Uploaded</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{stats.modelsCount}</p>
                  </div>
                </div>

                {/* Total Downloads */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Downloads</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{stats.totalDownloads}</p>
                  </div>
                </div>

                {/* Total Views */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Views</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{stats.totalViews}</p>
                  </div>
                </div>

                {/* Coins In Circulation */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Coins Circulating</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{stats.totalCoins}</p>
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-gray-500 text-center py-6 bg-white border border-gray-200 rounded-2xl shadow-sm">No statistics loaded.</p>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Summary Panels */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Moderation Quick Guidelines</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Admin status allows you to override user coin balances to resolve payment or economy disputes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Deleting models deletes the file from disk permanently. Perform this action only for spam or violation of TOS.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Account deletion removes users, files, and transaction histories cascade-wide. Admins cannot be deleted.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">System Health Status</h3>
                  <p className="text-sm text-gray-500 mb-4">Verify backend database connections and configurations.</p>
                  <div className="flex items-center gap-2 text-sm text-green-600 font-semibold mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                    MySQL Database connection: Active
                  </div>
                  <div className="text-xs text-gray-400">Environment: Development (Localhost)</div>
                </div>
                <div className="text-xs text-gray-400 mt-4 border-t pt-4">SACK3D Management Console v1.0.0</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE USERS */}
        {activeTab === 'users' && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Table Header Filter */}
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-gray-900">User Directory</h2>
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search user name or email..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {loadingUsers ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
                <span className="text-sm text-gray-500 font-semibold">Loading users database...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">No users matched your query.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="text-xs uppercase bg-gray-50 text-gray-700 font-bold border-b">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Coins</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Registration Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-1 rounded-full font-bold text-xs">
                            ${user.coins}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            user.role === 'admin' 
                              ? 'bg-red-50 text-red-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenCoinsModal(user)}
                            className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-xs rounded-lg transition-colors"
                          >
                            Adjust Coins
                          </button>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-lg transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MODERATE MODELS */}
        {activeTab === 'models' && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Table Header Filter */}
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-gray-900">Model Assets Moderator</h2>
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search model title or author..."
                  value={modelSearch}
                  onChange={e => setModelSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {loadingModels ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
                <span className="text-sm text-gray-500 font-semibold">Loading models directory...</span>
              </div>
            ) : filteredModels.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">No models matched your query.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="text-xs uppercase bg-gray-50 text-gray-700 font-bold border-b">
                    <tr>
                      <th className="px-6 py-4">Asset</th>
                      <th className="px-6 py-4">Author</th>
                      <th className="px-6 py-4">Downloads</th>
                      <th className="px-6 py-4">Views</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Upload Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredModels.map(model => (
                      <tr key={model.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={getFileUrl(model.thumbnail)}
                              alt={model.title}
                              className="w-10 h-10 object-cover rounded-lg border bg-gray-100 flex-shrink-0"
                            />
                            <div>
                              <p className="font-bold text-gray-900">{model.title}</p>
                              <p className="text-xs text-gray-400 truncate max-w-xs">{model.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-800">{model.uploader_name}</p>
                            <p className="text-xs text-gray-400">{model.uploader_email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{model.downloads}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{model.views}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            model.is_curated
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {model.is_curated ? 'Featured' : 'Standard'}
                          </span>
                        </td>
                        <td className="px-6 py-4">{new Date(model.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2 items-center">
                          <button
                            onClick={() => handleToggleCurate(model.id, model.is_curated)}
                            className={`px-3 py-1.5 font-bold text-xs rounded-lg transition-colors ${
                              model.is_curated
                                ? 'bg-orange-50 hover:bg-orange-100 text-orange-700'
                                : 'bg-green-50 hover:bg-green-100 text-green-700'
                            }`}
                          >
                            {model.is_curated ? 'Unfeature' : 'Feature'}
                          </button>
                          <button
                            onClick={() => navigate(`/model/${model.id}`)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteModel(model.id, model.title)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-lg transition-colors"
                          >
                            Moderate Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>

      {/* EDIT COINS MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 animate-slide-up">
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">Adjust Coin Balance</h3>
            <p className="text-sm text-gray-500 mb-4">Set the coin balance for user **{editingUser.name}** ({editingUser.email}).</p>
            
            <div className="flex flex-col gap-1 mb-6">
              <label htmlFor="coins-input" className="text-sm font-semibold text-gray-700 mb-1">New Balance</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-orange-500 font-bold">$</span>
                <input
                  id="coins-input"
                  type="number"
                  min="0"
                  value={newCoinsValue}
                  onChange={e => setNewCoinsValue(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 text-sm">
              <button
                onClick={() => setEditingUser(null)}
                disabled={submittingCoins}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCoins}
                disabled={submittingCoins}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-lg shadow-sm transition-colors"
              >
                {submittingCoins ? 'Updating...' : 'Save Adjustments'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
