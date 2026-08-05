import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Loader2, Box } from 'lucide-react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { getFileUrl } from '../utils/url'

interface Model {
  id: number
  title: string
  description: string
  model_file: string
  thumbnail: string
  uploaded_by: number
  downloads: number
  views: number
  is_private: number | boolean
  share_token: string
  created_at: string
}

export default function MyModelsPage() {
  const { user } = useAuth()
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get<{ success: boolean; data: Model[] }>('/models?filter=my-models')
      .then((res) => {
        setModels(res.data?.data || [])
      })
      .catch((err: Error) => {
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [user])

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Header row */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Models</h1>
              <p className="text-sm text-gray-400 mt-0.5">All models you have uploaded.</p>
            </div>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Upload new model
            </Link>
          </div>

          {/* States */}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-24 text-red-500 text-sm">{error}</div>
          )}

          {!loading && !error && models.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Box className="w-16 h-16 text-gray-300" strokeWidth={0.75} />
              <p className="text-gray-500 text-sm">No models yet. Upload your first model!</p>
              <Link
                to="/upload"
                className="mt-2 px-5 py-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Upload a model
              </Link>
            </div>
          )}

          {!loading && !error && models.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {models.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          )}
        </div>
      </main>
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
      <div className="aspect-square bg-[#1e2d40] flex items-center justify-center overflow-hidden relative">
        {model.thumbnail ? (
          <img src={getFileUrl(model.thumbnail)} alt={model.title} className="w-full h-full object-cover" />
        ) : (
          <Box className="w-16 h-16 text-[#4a6080]" strokeWidth={0.75} />
        )}

        {/* Visibility badge */}
        <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
          model.is_private 
            ? 'bg-orange-500/90 text-white' 
            : 'bg-green-600/90 text-white'
        }`}>
          {model.is_private ? 'Link-only' : 'Public'}
        </span>
      </div>

      {/* Info */}
      <div className="px-3 py-2.5">
        <p className="text-sm font-semibold text-gray-900 truncate">{model.title}</p>
        {model.description && (
          <p className="text-xs text-gray-400 truncate mt-0.5">{model.description}</p>
        )}
      </div>
    </div>
  )
}
