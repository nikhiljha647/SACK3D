import { Layers, Download } from 'lucide-react'
import heroIndustrial from '../assets/hero-industrial-CZVdvZJb.jpg'

export default function Hero() {
  return (
    <section className="relative min-h-[520px] flex items-center overflow-hidden pt-14">
      <div className="absolute inset-0 z-0">
        <img
          src={heroIndustrial}
          alt="Industrial factory floor"
          className="w-full h-full object-cover object-center"
          loading="eager"
          decoding="async"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(0_0%_7%/0.95)] via-[hsl(0_0%_7%/0.80)] to-[hsl(var(--primary)/0.30)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.25),transparent_60%)]" />
      </div>

      <div className="relative z-10 w-full max-w-[96rem] mx-auto px-6 sm:px-10 lg:px-9 py-[10rem]">
        <div className="inline-flex items-center gap-1.5 mb-5 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-white/80 text-xs font-medium tracking-wide">
          <Layers className="w-3.5 h-3.5 text-orange-400" strokeWidth={2} />
          Built for industrial teams
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.08] tracking-tight mb-5 max-w-xxl">
          Industrial 3D models,{' '}
          <span className="text-primary">live<br />on the shop floor.</span>
        </h1>

        <p className="text-sm sm:text-base text-gray-300 max-w-md mb-8 leading-relaxed">
          SACK3D is the AR platform for manufacturing, engineering, and field
          service teams. Upload CAD assets, generate a QR code, and let any
          technician scan to see equipment in true scale — right where it's
          installed.
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-12">
          <a href="/gallery" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm rounded transition-colors">
            Explore equipment library
          </a>
          <a href="/auth" className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent border border-white/30 hover:border-white/60 text-white font-semibold text-sm rounded transition-colors">
            Start free trial
          </a>
          <a href="/downloads/sack3d-ar.apk" className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent border border-white/30 hover:border-white/60 text-white font-semibold text-sm rounded transition-colors">
            <Download className="w-4 h-4" strokeWidth={2} />
            Download Android app
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {[
            { value: '1:1',   label: 'Scale accuracy' },
            { value: '50 MB', label: 'Per asset' },
            { value: '0',     label: 'Apps to install' },
            { value: '24/7',  label: 'Field access' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-2xl font-black text-primary leading-none">{stat.value}</span>
              <span className="text-[11px] text-gray-400 tracking-wide mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
