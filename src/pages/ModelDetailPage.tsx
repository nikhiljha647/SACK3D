/**
 * ModelDetailPage - View a single 3D model with details and 3D viewer
 */
import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'
import { X, ArrowLeft, Download, Share2, Eye, EyeOff, Trash2, Expand, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getFileUrl } from '../utils/url'
import { useAuth } from '../context/AuthContext'

const API = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api'

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

export default function ModelDetailPage() {
  const { shareToken } = useParams<{ shareToken: string }>()
  const navigate = useNavigate()
  const { user, coins, setCoins } = useAuth()
  const [model, setModel] = useState<Model | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showARModal, setShowARModal] = useState(false)
  const modelViewerRef = useRef<any>(null)

  useEffect(() => {
    if (!shareToken) return
    axios
      .get(`${API}/models/${shareToken}`)
      .then(res => {
        setModel(res.data.data)
      })
      .catch(() => setError('Failed to load model'))
      .finally(() => setLoading(false))
  }, [shareToken])

  const handleDownload = async () => {
    if (!model) return
    if (!user) {
      toast.error('Please sign in to download models')
      navigate('/auth')
      return
    }

    const isOwner = Number(user.id) === Number(model.uploaded_by)
    const cost = isOwner ? 0 : 10

    if (!isOwner && coins < cost) {
      toast.error(`Insufficient coins. You need ${cost} coins to download this model.`)
      return
    }

    try {
      const token = localStorage.getItem('sack3d_token') || sessionStorage.getItem('sack3d_token')
      const res = await axios.post(
        `${API}/models/${model.share_token}/download`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Update coins
      setCoins(res.data.data.newBalance)
      
      // Trigger download
      const link = document.createElement('a')
      link.href = getFileUrl(model.model_file)
      link.download = `${model.title}.glb`
      link.click()

      toast.success(cost > 0 ? `Downloaded model (−${cost} coins)` : 'Downloaded model (Free)')
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Download failed'
      toast.error(msg)
    }
  }

  const handleDownloadQR = async () => {
    if (!model) return
    if (!user) {
      toast.error('Please sign in to download QR codes')
      navigate('/auth')
      return
    }

    // Get the QR code SVG element
    const svg = document.querySelector('.qr-code-container svg')
    if (!svg) {
      toast.error('QR code element not found')
      return
    }

    const isOwner = Number(user.id) === Number(model.uploaded_by)
    const cost = isOwner ? 0 : 5

    if (!isOwner && coins < cost) {
      toast.error(`Insufficient coins. You need ${cost} coins to download this QR.`)
      return
    }

    try {
      const token = localStorage.getItem('sack3d_token') || sessionStorage.getItem('sack3d_token')
      const res = await axios.post(
        `${API}/models/${model.share_token}/download-qr`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Update coins
      setCoins(res.data.data.newBalance)
      
      // Trigger download
      const svgData = new XMLSerializer().serializeToString(svg)
      const blob = new Blob([svgData], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${model.title}-qr.svg`
      link.click()
      URL.revokeObjectURL(url)

      toast.success(cost > 0 ? `Downloaded QR code (−${cost} coins)` : 'Downloaded QR code (Free)')
    } catch (err: any) {
      const msg = err.response?.data?.message || 'QR download failed'
      toast.error(msg)
    }
  }

  const getARUrl = () => {
    if (!model) return ''
    return `${window.location.origin}/model/${model.share_token}`
  }

  const handleDelete = async () => {
    if (!model || !user) return
    
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete "${model.title}"? This action cannot be undone.`)) {
      return
    }

    try {
      const token = localStorage.getItem('sack3d_token') || sessionStorage.getItem('sack3d_token')
      await axios.delete(`${API}/models/${model.share_token}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Navigate back to gallery after successful deletion
      navigate('/gallery')
    } catch (err) {
      alert('Failed to delete model. You may not have permission.')
      console.error('Delete error:', err)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Share link copied to clipboard!')
  }

  const handleOpenAR = () => {
    // Get the model-viewer element using ref or querySelector
    const modelViewer = modelViewerRef.current || document.querySelector('model-viewer') as any
    
    if (!modelViewer) {
      toast.error('3D viewer not ready. Please wait for the model to load.')
      return
    }

    // Check if AR is available
    if (!modelViewer.canActivateAR) {
      toast.error('AR not available on this device. Please use a mobile device with AR support.')
      return
    }

    try {
      // Activate AR
      modelViewer.activateAR()
    } catch (error) {
      console.error('Failed to activate AR:', error)
      toast.error('Failed to launch AR. Please try scanning the QR code with your mobile device.')
    }
  }

  const handleToggleVisibility = async () => {
    if (!model) return
    const isPrivate = !model.is_private
    try {
      const token = localStorage.getItem('sack3d_token') || sessionStorage.getItem('sack3d_token')
      const res = await axios.put(
        `${API}/models/${model.share_token}/visibility`,
        { isPrivate },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.data.success) {
        toast.success(res.data.message)
        setModel(prev => prev ? { ...prev, is_private: isPrivate } : null)
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update visibility'
      toast.error(msg)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef0f3] flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="bg-gray-200 h-96 rounded-2xl mb-6"></div>
              <div className="bg-gray-200 h-8 w-2/3 rounded mb-4"></div>
              <div className="bg-gray-200 h-4 w-1/3 rounded mb-6"></div>
              <div className="bg-gray-200 h-20 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !model) {
    return (
      <div className="min-h-screen bg-[#eef0f3] flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 pb-12 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="bg-white rounded-2xl border border-gray-200 p-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Model not found</h2>
              <p className="text-gray-500 mb-6">{error || 'This model does not exist or has been removed.'}</p>
              <button
                onClick={() => navigate('/gallery')}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-lg transition-colors"
              >
                Back to Gallery
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Back button */}
          <button
            onClick={() => navigate('/gallery')}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to gallery</span>
          </button>

          <div className="grid lg:grid-cols-[1fr_360px] gap-6">
            
            {/* Left: 3D Viewer */}
            <div className="bg-gray-200 rounded-xl overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative">
                {/* @ts-ignore - model-viewer is a web component */}
                <model-viewer
                  ref={modelViewerRef}
                  src={getFileUrl(model.model_file)}
                  alt={model.title}
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  camera-controls
                  touch-action="pan-y"
                  auto-rotate
                  shadow-intensity="1"
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'transparent'
                  }}
                >
                  <div slot="poster" className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                      <p className="text-gray-500 text-sm">Loading 3D Model...</p>
                    </div>
                  </div>
                </model-viewer>
              </div>
            </div>

            {/* Right: Model Info */}
            <div className="space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{model.title}</h1>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                    model.is_private
                      ? 'bg-orange-50 text-orange-700 border border-orange-100'
                      : 'bg-green-50 text-green-700 border border-green-100'
                  }`}>
                    {model.is_private ? 'Link Only (Unlisted)' : 'Public'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{model.description || 'No description provided.'}</p>
              </div>

              {/* View in AR Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start gap-2 mb-4">
                  <Expand className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900">View in AR</h3>
                    <p className="text-xs text-gray-500 mt-1">Scan with your phone to launch the AR viewer.</p>
                  </div>
                </div>

                {/* QR Code */}
                <div className="bg-white rounded-lg p-6 mb-4 flex items-center justify-center qr-code-container">
                  <QRCodeSVG 
                    value={getARUrl()} 
                    size={192}
                    level="H"
                    includeMargin={false}
                  />
                </div>

                {/* Balance */}
                {user ? (
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" className="text-orange-100" fill="currentColor"/>
                      <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#f97316" fontWeight="bold">$</text>
                    </svg>
                    <span className="text-sm text-gray-600">Balance: <span className="font-semibold text-gray-900">{coins}</span></span>
                  </div>
                ) : (
                  <div className="text-center text-xs text-gray-500 mb-4">
                    Sign in to view your balance & download
                  </div>
                )}

                {/* Download buttons */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button onClick={handleDownloadQR} className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    QR (-5)
                  </button>
                  <button onClick={handleDownload} className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Model (-10)
                  </button>
                </div>

                {/* Open AR & Share buttons */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    onClick={handleOpenAR}
                    className="py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    Open AR
                  </button>
                  <button
                    onClick={handleShare}
                    className="py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-sm rounded-lg border border-orange-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>

                {/* Change Visibility - Owner only */}
                {user && Number(user.id) === Number(model.uploaded_by) && (
                  <button
                    onClick={handleToggleVisibility}
                    className="w-full mb-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {model.is_private ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    Change to {model.is_private ? 'Public' : 'Link-Only'}
                  </button>
                )}

                {/* URL */}
                <p className="text-xs text-gray-400 text-center mt-3 break-all">
                  {getARUrl()}
                </p>
              </div>

              {/* Delete model button - Only show for owner */}
              {user && model && Number(user.id) === Number(model.uploaded_by) && (
                <button 
                  onClick={handleDelete}
                  className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete model
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* AR Modal */}
      {showARModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowARModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">View in AR</h3>
              <button onClick={() => setShowARModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Scan with your phone to launch the AR viewer.</p>
            
            {/* QR Code */}
            <div className="bg-white rounded-lg p-6 mb-4 flex items-center justify-center">
              <QRCodeSVG 
                value={getARUrl()} 
                size={224}
                level="H"
                includeMargin={false}
              />
            </div>

            {/* Balance */}
            {user ? (
              <div className="flex items-center justify-center gap-2 mb-4">
                <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" className="text-orange-100" fill="currentColor"/>
                  <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#f97316" fontWeight="bold">$</text>
                </svg>
                <span className="text-sm text-gray-600">Balance: <span className="font-semibold text-gray-900">{coins}</span></span>
              </div>
            ) : (
              <div className="text-center text-xs text-gray-500 mb-4">
                Sign in to view your balance
              </div>
            )}

            {/* Download buttons */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <button onClick={handleDownloadQR} className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                QR (-5)
              </button>
              <button onClick={handleDownload} className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Model (-10)
              </button>
            </div>

            {/* Open AR button */}
            <button
              onClick={() => setShowARModal(false)}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm rounded-lg transition-colors mb-3"
            >
              Open AR
            </button>

            {/* URL */}
            <p className="text-xs text-gray-400 text-center break-all">
              {getARUrl()}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
