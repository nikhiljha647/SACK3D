import { Building2 } from 'lucide-react'
import ctaBg from '../assets/cta-industrial-DaTeSQ0n.jpg'

export default function CTA() {
  return (
    <section className="py-16 bg-[#e8edf2]">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${ctaBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/95 via-surface/85 to-primary/40" />
          <div className="relative z-10 py-16 px-8 sm:px-16 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 text-primary mb-6 mx-auto">
              <Building2 className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Spec it. Scan it. Ship it.
            </h2>
            <p className="text-gray-300 text-base max-w-md mx-auto mb-8 leading-relaxed">
              Stop emailing CAD screenshots. Give your operators, customers,
              and contractors a QR they can scan from anywhere.
            </p>
            <a
              href="/auth"
              className="inline-flex items-center gap-2 px-7 py-3 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm rounded-lg transition-colors"
            >
              Set up your equipment library
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
