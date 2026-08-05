/**
 * UploadPage — Upload a 3D Model
 * Authenticated users can upload .glb / .gltf files with an optional thumbnail.
 * Costs 25 coins per upload.
 */
import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { UploadCloud, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

const UPLOAD_COST = 25
const MAX_MB = 50
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api'

interface FormValues {
  title: string
  description: string
  isPrivate: boolean
}

export default function UploadPage() {
  const { coins, setCoins, token } = useAuth()
  const navigate = useNavigate()

  // react-hook-form for title + description
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>()

  // File state
  const [modelFile, setModelFile]   = useState<File | null>(null)
  const [thumbFile, setThumbFile]   = useState<File | null>(null)
  const [thumbPreview, setThumbPreview] = useState<string | null>(null)
  const [dragOver, setDragOver]     = useState(false)

  // Upload progress
  const [progress, setProgress]     = useState(0)
  const [uploading, setUploading]   = useState(false)

  const modelInputRef = useRef<HTMLInputElement>(null)
  const thumbInputRef = useRef<HTMLInputElement>(null)

  // ── File handlers ─────────────────────────────────────────────────────────

  const handleModelFile = (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase()
    if (!['glb', 'gltf'].includes(ext || '')) {
      toast.error('Only .glb and .gltf files are allowed')
      return
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      toast.error(`File too large. Max ${MAX_MB} MB.`)
      return
    }
    setModelFile(f)
  }

  const handleThumbFile = (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase()
    if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
      toast.error('Only jpg, jpeg, png, webp allowed for thumbnail')
      return
    }
    setThumbFile(f)
    setThumbPreview(URL.createObjectURL(f))
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleModelFile(f)
  }

  const onModelInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleModelFile(f)
  }

  const onThumbInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleThumbFile(f)
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  const onSubmit = async (values: FormValues) => {
    if (!modelFile) { toast.error('Please select a 3D model file'); return }
    if (coins < UPLOAD_COST) {
      toast.error(`Insufficient coins. You need ${UPLOAD_COST} coins.`)
      return
    }

    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('description', values.description || '')
    formData.append('isPrivate', String(!!values.isPrivate))
    formData.append('modelFile', modelFile)
    if (thumbFile) formData.append('thumbnail', thumbFile)

    setUploading(true)
    setProgress(0)

    try {
      const res = await axios.post(`${API_BASE}/models/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress(ev) {
          if (ev.total) setProgress(Math.round((ev.loaded / ev.total) * 100))
        },
      })

      const { newBalance } = res.data.data
      setCoins(newBalance)
      toast.success('Model uploaded successfully!')

      // Reset form
      reset()
      setModelFile(null)
      setThumbFile(null)
      setThumbPreview(null)
      setProgress(0)

      // Redirect to gallery after short delay
      setTimeout(() => navigate('/gallery'), 1500)
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Upload failed'
        : 'Upload failed'
      toast.error(message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#eef0f3] flex flex-col">
      <Navbar />
      <Toaster position="top-right" />

      <main className="flex-1 flex items-start justify-center pt-20 pb-12 px-4">
        <div className="w-full max-w-lg">

          {/* Page heading */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Upload a 3D Model</h1>
            <p className="text-sm text-gray-500 mt-1">
              Supports .glb and .gltf files — max {MAX_MB} MB.
            </p>
          </div>

          {/* Coin balance card */}
          <div className="flex items-center justify-between bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 mb-6 text-sm">
            <span className="flex items-center gap-1.5 text-gray-700">
              <span className="text-base">🪙</span>
              Balance: <strong>{coins} Coins</strong>
            </span>
            <span className="text-gray-500">
              Cost per upload: <strong className="text-gray-800">{UPLOAD_COST}</strong>
            </span>
          </div>

          {/* Form card */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col gap-5"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="My awesome model"
                {...register('title', { required: 'Title is required' })}
                disabled={uploading}
                className={`w-full px-4 py-2.5 text-sm text-gray-900 border rounded-lg bg-gray-50
                  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all
                  ${errors.title ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-orange-400 focus:ring-orange-100'}`}
              />
              {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={4}
                placeholder="Describe your model…"
                {...register('description')}
                disabled={uploading}
                className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-50
                  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-orange-400
                  focus:ring-orange-100 focus:bg-white transition-all resize-y"
              />
            </div>

            {/* 3D Model file */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3D file (.glb / .gltf) <span className="text-red-500">*</span>
              </label>
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => modelInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
                  dragOver
                    ? 'border-orange-400 bg-orange-50'
                    : modelFile
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                }`}
              >
                <input
                  ref={modelInputRef}
                  type="file"
                  accept=".glb,.gltf"
                  className="hidden"
                  onChange={onModelInputChange}
                />
                {modelFile ? (
                  <p className="text-sm font-medium text-green-700">✓ {modelFile.name}</p>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
                    <p className="text-sm text-gray-500">Drop file here or <span className="text-orange-500 font-medium">browse</span></p>
                    <p className="text-xs text-gray-400">.glb or .gltf · max {MAX_MB} MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail image <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => thumbInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-orange-400 hover:text-orange-500 bg-gray-50 transition-colors"
                >
                  Choose File
                </button>
                <span className="text-sm text-gray-400">
                  {thumbFile ? thumbFile.name : 'No file chosen'}
                </span>
                <input
                  ref={thumbInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={onThumbInputChange}
                />
              </div>
              {/* Thumbnail preview */}
              {thumbPreview && (
                <img
                  src={thumbPreview}
                  alt="Thumbnail preview"
                  className="mt-3 w-24 h-24 object-cover rounded-lg border border-gray-200"
                />
              )}
            </div>

            {/* Visibility / Sharing */}
            <div className="flex items-start gap-3 p-3.5 bg-orange-50 border border-orange-100 rounded-xl">
              <input
                id="isPrivate-checkbox"
                type="checkbox"
                disabled={uploading}
                {...register('isPrivate')}
                className="w-4 h-4 mt-0.5 text-orange-500 border-gray-300 rounded focus:ring-orange-400 cursor-pointer"
              />
              <div className="flex flex-col gap-0.5">
                <label htmlFor="isPrivate-checkbox" className="text-sm font-semibold text-gray-800 cursor-pointer select-none">
                  Make Link-only (Unlisted)
                </label>
                <p className="text-xs text-gray-500">
                  If selected, this model won't appear in the public gallery. Anyone with the direct link can still view it.
                </p>
              </div>
            </div>

            {/* Progress bar */}
            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={uploading || coins < UPLOAD_COST}
              className="w-full py-3 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed
                text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" strokeWidth={2} />
                  Uploading… {progress}%
                </>
              ) : (
                `Upload Model (−${UPLOAD_COST} Coins)`
              )}
            </button>

            {coins < UPLOAD_COST && (
              <p className="text-xs text-center text-red-500">
                You need at least {UPLOAD_COST} coins to upload a model.
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  )
}
