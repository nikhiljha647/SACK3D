import { Download, Printer, ScanLine } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Download the QR',
      description: 'Open any model in the gallery and grab its QR code (5 coins).',
      icon: <Download className="w-5 h-5" strokeWidth={2} />,
    },
    {
      number: '2',
      title: 'Print & place',
      description: 'Paste the QR on the actual equipment, a part bin, a drawing — anywhere on the shop floor.',
      icon: <Printer className="w-5 h-5" strokeWidth={2} />,
    },
    {
      number: '3',
      title: 'Scan with the app',
      description: 'Launch the SACK3D Android app, scan the QR, and the model anchors in your space at 1:1 scale.',
      icon: <ScanLine className="w-5 h-5" strokeWidth={2} />,
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-[#e8edf2]">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.2em] uppercase text-orange-500 mb-3">See it in action</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Print a QR. Scan it. The part appears.
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
            Stick the QR on a workbench, a pallet, or a wall. Open the SACK3D Android
            app, scan, and the 3D model snaps into place — life-size, walk-around, true to spec.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
          {/* Left — video/demo */}
          <div className="relative rounded-xl overflow-hidden aspect-video bg-black w-full max-w-[750px]">
            <video
              src="https://charm-styling-toolkit.lovable.app/videos/ar-demo.mp4"
              autoPlay muted loop playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-white/20 text-white text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              AR demo
            </div>
          </div>

          {/* Right — steps + CTA */}
          <div className="w-full max-w-[550px]">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-xl px-5 py-4 border mb-4 border-gray-200 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 flex-shrink-0">
                  {step.icon}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-sm">{step.number}. {step.title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
            <a href="/downloads/sack3d-ar.apk"
              className="mt-1 inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm rounded-xl transition-colors">
              <Download className="w-4 h-4" strokeWidth={2} />
              Download Android AR app (.apk)
            </a>
            <p className="text-center text-gray-400 text-xs font-mono mt-4">
              Unity-based · Android 9+ · ARCore required
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
