import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: { species: string } }) {
  const speciesName = params.species
    .split('-')
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return {
    title: `${speciesName} Hunting Outfitters - HuntGuideHub`,
    description: `Find verified ${speciesName} hunting guides and outfitters across North America.`,
  }
}

export default async function SpeciesPage({ params }: { params: { species: string } }) {
  const speciesName = params.species
    .split('-')
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const { data: outfitters } = await supabase
    .from('outfitters')
    .select('*')
    .contains('species', [speciesName])
    .order('rating', { ascending: false })

  const results = outfitters || []

  // Get unique states from results
  const states = [...new Set(results.map((o: any) => o.state))].sort()

  return (
    <div style={{ background: '#1a1410', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        background: '#2e2018', borderBottom: '1px solid rgba(193,127,59,0.15)',
        padding: '4rem 2rem 3rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <Link href="/species" style={{
              fontFamily: 'var(--font-oswald)', fontSize: '0.7rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#a89880', textDecoration: 'none'
            }}>← All Species</Link>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-oswald)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700, textTransform: 'uppercase', color: '#fdfbf7',
            lineHeight: 1, marginBottom: '0.75rem'
          }}>
            {speciesName} <span style={{ color: '#c17f3b' }}>Hunting</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-oswald)', fontSize: '0.85rem',
            letterSpacing: '0.1em', color: '#a89880'
          }}>
            {results.length} verified outfitter{results.length !== 1 ? 's' : ''} found
            {states.length > 0 && ` across ${states.length} state${states.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>

        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <p style={{
              fontFamily: 'var(--font-oswald)', fontSize: '1.2rem',
              textTransform: 'uppercase', color: '#a89880', marginBottom: '1rem'
            }}>No outfitters found for {speciesName}</p>
            <Link href="/species" style={{
              fontFamily: 'var(--font-oswald)', fontSize: '0.85rem',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#c17f3b', textDecoration: 'none',
              border: '1px solid rgba(193,127,59,0.4)', padding: '0.75rem 1.5rem'
            }}>Browse All Species →</Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1px',
            background: 'rgba(255,255,255,0.05)'
          }}>
            {results.map((o: any) => (
              <Link key={o.id} href={`/outfitter/${o.id}`} style={{
                display: 'block', background: '#1a1410', padding: '1.5rem',
                textDecoration: 'none', transition: 'background 0.2s'
              }}>
                {/* All species badges - shows every species this outfitter offers */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  {(o.species || []).map((s: string) => (
                    <span key={s} style={{
                      fontFamily: 'var(--font-oswald)', fontSize: '0.6rem',
                      letterSpacing: '0.2em', textTransform: 'uppercase',
                      background: s === speciesName ? '#c17f3b' : 'rgba(193,127,59,0.2)',
                      color: s === speciesName ? '#1a1410' : '#c17f3b',
                      padding: '0.2rem 0.6rem'
                    }}>{s}</span>
                  ))}
                </div>

                {/* Name */}
                <h3 style={{
                  fontFamily: 'var(--font-oswald)', fontSize: '1.1rem',
                  fontWeight: 700, textTransform: 'uppercase', color: '#fdfbf7',
                  marginBottom: '0.3rem', lineHeight: 1.2
                }}>{o.name}</h3>

                {/* Location */}
                <p style={{ fontSize: '0.82rem', color: '#a89880', marginBottom: '0.75rem' }}>
                  📍 {o.city}, {o.state_full || o.state}
                </p>

                {/* Description snippet */}
                {o.description && (
                  <p style={{
                    fontSize: '0.82rem', color: '#d4c5b0', lineHeight: 1.5,
                    marginBottom: '0.75rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  } as any}>{o.description}</p>
                )}

                {/* Bottom row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  {o.rating && (
                    <span style={{ color: '#e8a84c', fontSize: '0.82rem' }}>
                      {'★'.repeat(Math.floor(o.rating))} {o.rating}
                    </span>
                  )}
                  {o.price_starting ? (
                    <span style={{
                      fontFamily: 'var(--font-oswald)', fontSize: '1rem',
                      color: '#e8a84c', fontWeight: 600
                    }}>From ${o.price_starting.toLocaleString()}</span>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: '#a89880' }}>Contact for pricing</span>
                  )}
                </div>

              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
