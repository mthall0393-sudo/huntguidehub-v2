import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import OutfitterMap from '@/components/OutfitterMap'

const SPECIES = [
  { name: 'Elk', emoji: '🦌', slug: 'elk' },
  { name: 'Whitetail Deer', emoji: '🦌', slug: 'whitetail-deer' },
  { name: 'Turkey', emoji: '🦃', slug: 'turkey' },
  { name: 'Waterfowl', emoji: '🦆', slug: 'waterfowl' },
  { name: 'Pheasant', emoji: '🐦', slug: 'pheasant' },
  { name: 'Hog', emoji: '🐗', slug: 'hog' },
  { name: 'Bear', emoji: '🐻', slug: 'bear' },
  { name: 'Antelope', emoji: '🦌', slug: 'antelope' },
]

export default async function HomePage() {
  // Get featured outfitters
  const { data: featured } = await supabase
    .from('outfitters')
    .select('*')
    .contains('tags', ['Featured'])
    .order('rating', { ascending: false })
    .limit(6)

  // Get ALL outfitters for the map (only need location + basic info)
  const { data: allOutfitters } = await supabase
    .from('outfitters')
    .select('id, name, city, state, lat, lng, species, price_starting, rating')

  // Get total count
  const { count } = await supabase
    .from('outfitters')
    .select('*', { count: 'exact', head: true })

  // Get unique states count
  const stateSet = new Set((allOutfitters || []).map(o => o.state))
  const states = Array.from(stateSet).length

  return (
    <div>

      {/* Hero */}
      <section className="bg-bark px-8 py-24 text-center border-b border-white/5">
        <p className="font-oswald text-xs tracking-widest uppercase text-amber mb-4">
          North America's Hunting Directory
        </p>
        <h1 className="font-oswald text-5xl md:text-6xl font-bold uppercase text-white mb-6 leading-none">
          Find Your Perfect<br />
          <span className="text-bronze">Hunting Guide</span>
        </h1>
        <p className="text-stone text-lg mb-10 max-w-xl mx-auto">
          The most complete directory of verified outfitters and guides across North America
        </p>
        {/* Stats Row */}
        <div className="flex justify-center gap-12 flex-wrap">
          <div>
            <div className="font-oswald text-3xl font-bold text-amber">{count}</div>
            <div className="font-oswald text-xs tracking-widest uppercase text-stone">Outfitters</div>
          </div>
          <div>
            <div className="font-oswald text-3xl font-bold text-amber">{states}</div>
            <div className="font-oswald text-xs tracking-widest uppercase text-stone">States</div>
          </div>
          <div>
            <div className="font-oswald text-3xl font-bold text-amber">8</div>
            <div className="font-oswald text-xs tracking-widest uppercase text-stone">Species</div>
          </div>
        </div>
      </section>

      {/* Species Grid */}
      <section className="bg-soil px-8 py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <p className="section-label mb-8">Browse by Species</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SPECIES.map(s => (
              <Link
                key={s.name}
                href={`/species/${s.slug}`}
                className="outfitter-card text-center block py-8"
              >
                <div className="text-4xl mb-3">{s.emoji}</div>
                <div className="font-oswald text-sm uppercase tracking-wider text-white">
                  {s.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-bark border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 pt-16 pb-4">
          <p className="section-label mb-2">Outfitter Locations</p>
          <h2 className="font-oswald text-3xl font-bold uppercase text-white mb-2">
            Hunt Anywhere in North America
          </h2>
          <p className="text-stone text-sm mb-6">
            Click any pin to view outfitter details
          </p>
        </div>

        {/* Map Legend */}
        <div className="max-w-7xl mx-auto px-8 mb-4">
          <div className="flex flex-wrap gap-4">
            {[
              { label: 'Elk', color: '#8B4513' },
              { label: 'Deer', color: '#6B8E23' },
              { label: 'Waterfowl', color: '#1a5276' },
              { label: 'Turkey', color: '#8B6914' },
              { label: 'Pheasant', color: '#7D6608' },
              { label: 'Hog', color: '#5D4037' },
              { label: 'Bear', color: '#4E342E' },
              { label: 'Other', color: '#c17f3b' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: item.color,
                  border: '2px solid #fdfbf7'
                }} />
                <span className="font-oswald text-xs uppercase tracking-wider text-stone">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* The Map */}
        <OutfitterMap outfitters={allOutfitters || []} />
      </section>

      {/* Featured Outfitters */}
      <section className="bg-soil px-8 py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <p className="section-label mb-2">Featured Outfitters</p>
          <h2 className="font-oswald text-3xl font-bold uppercase text-white mb-8">
            Top Rated Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured?.map(o => (
              <Link key={o.id} href={`/outfitter/${o.id}`} className="outfitter-card block">
                {/* Species badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {o.species?.slice(0, 2).map((s: string) => (
                    <span key={s} className="species-badge">{s}</span>
                  ))}
                </div>
                {/* Name */}
                <h3 className="font-oswald text-xl font-bold uppercase text-white mb-1 leading-tight">
                  {o.name}
                </h3>
                {/* Location */}
                <p className="text-stone text-sm mb-3">
                  📍 {o.city}, {o.state}
                </p>
                {/* Rating */}
                {o.rating && (
                  <p className="text-amber text-sm mb-2">
                    {'★'.repeat(Math.floor(o.rating))} {o.rating}
                  </p>
                )}
                {/* Price */}
                {o.price_starting && (
                  <p className="font-oswald text-lg text-amber">
                    From ${o.price_starting.toLocaleString()}
                  </p>
                )}
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/states" className="btn-secondary">
              Browse All Outfitters →
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}