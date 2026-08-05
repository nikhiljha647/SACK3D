import { Factory, Wrench, ShieldCheck, LayoutGrid, Box, Users } from 'lucide-react'

const useCases = [
  {
    title: 'Plant & equipment planning',
    description: 'Drop full-scale machinery into your facility before installation. Validate clearances, access paths, and safety zones in AR.',
    icon: <Factory className="w-5 h-5" strokeWidth={2} />,
  },
  {
    title: 'Maintenance & field service',
    description: 'Technicians scan a QR on the asset and see the 3D model with exploded views — no thick service manual required.',
    icon: <Wrench className="w-5 h-5" strokeWidth={2} />,
  },
  {
    title: 'Safety & training',
    description: 'Train new operators on virtual replicas of real machines. Walk around them, inspect components, before touching live equipment.',
    icon: <ShieldCheck className="w-5 h-5" strokeWidth={2} />,
  },
  {
    title: 'Design review',
    description: 'Engineering, ops, and procurement can review CAD revisions together — on any phone, no specialist software.',
    icon: <LayoutGrid className="w-5 h-5" strokeWidth={2} />,
  },
  {
    title: 'Spare-parts catalog',
    description: 'Generate a QR per SKU. Warehouse and procurement teams confirm parts visually before ordering.',
    icon: <Box className="w-5 h-5" strokeWidth={2} />,
  },
  {
    title: 'Customer demos',
    description: 'Send a single QR with a quote. Buyers see your equipment installed in their own space, life-size.',
    icon: <Users className="w-5 h-5" strokeWidth={2} />,
  },
]

export default function UseCases() {
  return (
    <section id="use-cases" className="py-20 bg-[#e8edf2]">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange-500 mb-3">Use cases</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Built for every stage of asset lifecycle
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 mb-4">
                {useCase.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{useCase.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
