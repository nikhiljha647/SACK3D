import { Check } from 'lucide-react'
import featureAr from '../assets/feature-ar-DPB2MuIP.jpg'

export default function Technology() {
  const features = [
    'Compatible with iOS Safari and Android Chrome',
    'Accepts .glb and .gltf — direct from SolidWorks, Fusion 360, Revit',
    'Private gallery per account, role-based access coming soon',
  ]

  return (
    <section id="technology" className="py-24 bg-[#111822]">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-label mb-4">AR on any device</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6">
              No headset. No app. Just a phone.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              SACK3D runs on WebXR, Apple Quick Look, and Google Scene Viewer — the AR
              engines already built into every modern smartphone. Your team scans a QR,
              taps "View in AR", and the model lands in the room at the correct scale.
            </p>
            <ul className="space-y-3 mb-10">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-orange-400" strokeWidth={2.5} />
                  </div>
                  <span className="text-gray-300 text-sm">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-orange-500/5 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden border border-[#2a2a2a]">
              <img
                src={featureAr}
                alt="Engineer viewing 3D AR model on tablet"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
