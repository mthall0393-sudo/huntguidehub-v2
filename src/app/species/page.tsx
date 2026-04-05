import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const metadata = {
  title: 'Browse by Species - HuntGuideHub',
  description: 'Find hunting outfitters and guides by species across North America.',
}

const SPECIES_EMOJI: Record<string, string> = {
  'Elk': '🦌',
  'Whitetail Deer': '🦌',
  'Mule Deer': '🦌',
  'Turkey': '🦃',
  'Waterfowl': '🦆',
  'Pheasant': '🐦',
  'Hog': '🐗',
  'Bear': '🐻',
  'Antelope': '🦌',
  'Moose': '🦌',
  'Caribou': '🦌',
  'Cougar': '🐾',
  'Dove': '🕊️',
  'Quail': '🐦',
  'Grouse': '🐦',
  'Sandhill Crane': '🦢',
}

function getEmoji(name: string): string {
  return SPECIES_EMOJI[name] || '🎯'
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/ /g, '-')
}

export default async function SpeciesDirectoryPage() {
  // Dynamically get all species and counts from database
  const { data: speciesData } = await supabase
    .rpc('get_species_counts')

  const species = (speciesData || []).filter((s: any) =>
    s.species_name &&
    s.species_name.trim() !== '' &&
    s.outfitter_count > 0
  )

  return (
    <div style={{ background: '#1a1410', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        background: '#2e2018', borderBottom: '1px solid rgba(193,127,59,0.15)',
        padding: '4rem 2rem 3rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{
            fontFamily: 'var(--font-oswald)', fontSize: '0.7rem',
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: '#e8a84c', marginBottom: '0.75rem'
          }}>Browse by Species</p>
          <h1 style={{
            fontFamily: 'var(--font-oswald)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700, textTransform: 'uppercase', color: '#fdfbf7',
            lineHeight: 1, marginBottom: '0.75rem'
          }}>
            What Are You <span style={{ color: '#c17f3b' }}>Hunting?</span>
          </h1>
          <p style={{ color: '#a89880', fontSize: '0.9rem' }}>
            {species.length} species available across our directory
          </p>
        </div>
      </div>

      {/* Species Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1px',
          background: 'rgba(255,255,255,0.05)'
        }}>
          {species.map((s: any) => (
            <Link
              key={s.species_name}
              href={`/species/${toSlug(s.species_name)}`}
              style={{
                display: 'block', background: '#1a1410', padding: '2rem 1.5rem',
                textAlign: 'center', textDecoration: 'none'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
                {getEmoji(s.species_name)}
              </div>
              <div style={{
                fontFamily: 'var(--font-oswald)', fontSize: '0.9rem',
                fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                color: '#fdfbf7', marginBottom: '0.4rem'
              }}>{s.species_name}</div>
              <div style={{
                fontFamily: 'var(--font-oswald)', fontSize: '0.7rem',
                letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c17f3b'
              }}>{s.outfitter_count} outfitter{s.outfitter_count !== 1 ? 's' : ''}</div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
