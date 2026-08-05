import { useEffect, useState } from 'react'
import { Loader2, Box as BoxIcon, Lock, Download } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../Navbar'
import Footer from '../Footer'
import { useAuth } from '../../context/AuthContext'
import { getFileUrl } from '../../utils/url'

const API = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api'

interface Model {
  id: number
  title: string
  description: string
  model_file: string
  thumbnail: string
  uploaded_by: number
  uploader_name: string
  downloads: number
  views: number
  share_token: string
  created_at: string
}

type Tab = 'all' | 'curated' | 'my-models'

export default function GalleryPage() {
  const { isAuthenticated, token, isLoading } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = (searchParams.get('filter') as Tab) || 'all'
  const [search, setSearch] = useState('')
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoading) return
    setLoading(true)
    
    // Fetch different data based on tab
    if (tab === 'my-models' && !isAuthenticated) {
      navigate('/auth')
      return
    }
    
    // Build endpoint based on tab
    let endpoint = `${API}/models`
    if (tab === 'my-models') {
      endpoint = `${API}/models?filter=my-models`
    } else if (tab === 'curated') {
      endpoint = `${API}/models?filter=curated`
    }
    // 'all' tab uses default endpoint: /models (all public models)
    
    const headers = (tab === 'my-models' && token) 
      ? { Authorization: `Bearer ${token}` }
      : {}
    
    axios
      .get(endpoint, { headers })
      .then(res => {
        setModels(res.data.data || [])
      })
      .catch(err => {
        console.error('Failed to fetch models:', err)
        setModels([])
      })
      .finally(() => setLoading(false))
  }, [tab, isAuthenticated, token, navigate])

  const filtered = models.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    (m.description && m.description.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-14">
        <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Header row */}
          <div className="flex items-start justify-between mb-1">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
              <p className="text-sm text-gray-400 mt-0.5">Browse 3D models — tap any to view in AR.</p>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => navigate('/upload')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Upload
              </button>
            )}
          </div>

          {/* Navigation and Search controls */}
          <div className="flex items-center justify-between mt-5 mb-6">
            {/* Tab pills - only show when authenticated */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* All public tab */}
                <button
                  onClick={() => setSearchParams({})}
                  className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                    tab === 'all'
                      ? 'bg-white border-gray-300 text-gray-900 font-medium shadow-sm'
                      : 'bg-transparent border-gray-300 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  All
                </button>
                
                {/* Curated tab */}
                <button
                  onClick={() => setSearchParams({ filter: 'curated' })}
                  className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                    tab === 'curated'
                      ? 'bg-white border-gray-300 text-gray-900 font-medium shadow-sm'
                      : 'bg-transparent border-gray-300 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Curated
                </button>
                
                {/* My models tab */}
                <button
                  onClick={() => setSearchParams({ filter: 'my-models' })}
                  className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                    tab === 'my-models'
                      ? 'bg-white border-gray-300 text-gray-900 font-medium shadow-sm'
                      : 'bg-transparent border-gray-300 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My models
                </button>
              </div>
            ) : (
              <h2 className="text-lg font-bold text-gray-900">Featured 3D Models</h2>
            )}

            {/* Search Input */}
            <div className="relative ml-auto">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 placeholder:text-gray-400 w-48"
              />
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-200">
                  <div className="aspect-square bg-gray-200 animate-pulse"></div>
                  <div className="px-3 py-2.5">
                    <div className="h-4 bg-gray-200 animate-pulse rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {filtered.map(model => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          ) : models.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BoxIcon className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
              </div>
              <p className="text-gray-500 text-sm mb-2">No models yet</p>
              {isAuthenticated && (
                <p className="text-gray-400 text-xs">Be the first to upload a 3D model!</p>
              )}
            </div>
          ) : (
            <div className="text-center py-24 text-gray-400 text-sm">
              No models found for "<span className="text-gray-600">{search}</span>"
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

function ModelCard({ model }: { model: Model }) {
  const navigate = useNavigate()
  
  return (
    <div 
      onClick={() => navigate(`/model/${model.share_token}`)}
      className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="aspect-square bg-[#1e2d40] flex items-center justify-center relative group overflow-hidden">
        {model.thumbnail ? (
          <img 
            src={getFileUrl(model.thumbnail)} 
            alt={model.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <BoxIcon className="w-16 h-16 text-[#4a6080]" strokeWidth={0.75} />
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-sm font-medium">View Details</span>
        </div>
      </div>

      {/* Info */}
      <div className="px-3 py-2.5">
        <p className="text-sm font-semibold text-gray-900 truncate">{model.title}</p>
        <p className="text-xs text-gray-400 truncate mt-0.5">
          {model.description || `By ${model.uploader_name}`}
        </p>
      </div>
    </div>
  )
}
