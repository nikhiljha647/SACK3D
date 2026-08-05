import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { X, CheckCircle, Box as BoxIcon, UploadCloud, Loader2 } from 'lucide-react'

interface Props { onClose: () => void }

export default function UploadModal({ onClose }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const accept = ['.glb', '.gltf']

  const handleFile = (f: File) => {
    const ext = '.' + f.name.split('.').pop()?.toLowerCase()
    if (!accept.includes(ext)) return
    setFile(f)
    if (!name) setName(f.name.replace(/\.[^.]+$/, ''))
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  const handleUpload = async () => {
    if (!file || !name.trim()) return
    setUploading(true)
    await new Promise(r => setTimeout(r, 1800)) // simulated upload
    setUploading(false)
    setDone(true)
    setTimeout(onClose, 1200)
  }

  const sizeStr = file ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Upload 3D model</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-500" strokeWidth={2.5} />
            </div>
            <p className="text-gray-800 font-semibold">Upload successful!</p>
            <p className="text-gray-400 text-sm">Your model has been added to the gallery.</p>
          </div>
        ) : (
          <>
            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors mb-5 ${
                dragging
                  ? 'border-orange-400 bg-orange-50'
                  : file
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
              }`}
            >
              <input ref={inputRef} type="file" accept=".glb,.gltf" className="hidden" onChange={onInputChange} />

              {file ? (
                <>
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <BoxIcon className="w-6 h-6 text-green-500" strokeWidth={2} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800">{file.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{sizeStr}</p>
                  </div>
                  <p className="text-xs text-gray-400">Click to change file</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                    <UploadCloud className="w-6 h-6 text-orange-500" strokeWidth={2} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700">Drop your file here</p>
                    <p className="text-xs text-gray-400 mt-0.5">or click to browse</p>
                  </div>
                  <p className="text-xs text-gray-400">.glb or .gltf · max 50 MB</p>
                </>
              )}
            </div>

            {/* Fields */}
            <div className="flex flex-col gap-4 mb-5">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Model name</label>
                <input
                  type="text"
                  placeholder="e.g. Hydraulic Press v2"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-50
                    focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Category <span className="text-gray-400 font-normal">(optional)</span></label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-50
                    focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                >
                  <option value="">Select category…</option>
                  {['Manufacturing', 'Heavy Equipment', 'Logistics', 'Automation', 'Fluid Systems', 'Electrical'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || !name.trim() || uploading}
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed
                  text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" strokeWidth={2} />
                    Uploading…
                  </>
                ) : 'Upload model'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
