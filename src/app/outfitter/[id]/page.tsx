import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { data: o } = await supabase
    .from('outfitters')
    .select('name, city, state_full, description')
    .eq('id', params.id)
    .single()

  if (!o) return { title: 'Outfitter Not Found' }

  return {
    title: `${o.name} - HuntGuideHub`,
    description: o.description ? o.description.slice(0, 160) : `Hunting outfitter in ${o.city}, ${o.state_full}`,
  }
}

export default async function OutfitterPage({ params }: { params: { id: string } }) {
  const { data: o } = await supabase
    .from('outfitters')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!o) notFound()

  const { data: related } = await supabase
    .from('outfitters')
    .select('id, name, city, state, species, price_starting, rating')
    .eq('state', o.state)
    .neq('id', o.id)
    .not('species', 'is', null)
    .limit(3)

  const stars = o.rating ? '★'.repeat(Math.floor(o.rating)) : ''

  return (
    <div style={{ background: '#1a1410', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{
        background: '#0e0b08', borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '0.85rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <span style={{
            fontFamily: 'var(--font-oswald)', fontSize: '0.7rem',
            letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a89880'
          }}>
            <Link href="/" style={{ color: '#a89880', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 0.5rem' }}>›</span>
            <Link href="/states" style={{ color: '#a89880', textDecoration: 'none' }}>{o.state_full}</Link>
            <span style={{ margin: '0 0.5rem' }}>›</span>
            <span style={{ color: '#e8a84c' }}>{o.name}</span>
          </span>
        </div>
      </div>

      {/* Hero */}
      <div style={{
        background: '#2e2018', borderBottom: '1px solid rgba(193,127,59,0.15)',
        padding: '3rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Species badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {(o.species || []).map((s: string) => (
              <Link key={s} href={`/species/${s.toLowerCase().replace(/ /g, '-')}`} style={{
                fontFamily: 'var(--font-oswald)', fontSize: '0.65rem',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                background: '#c17f3b', color: '#1a1410',
                padding: '0.25rem 0.75rem', textDecoration: 'none'
              }}>{s}</Link>
            ))}
            {o.verified && (
              <span style={{
                fontFamily: 'var(--font-oswald)', fontSize: '0.65rem',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#e8a84c', border: '1px solid #e8a84c',
                padding: '0.25rem 0.75rem'
              }}>✓ Verified</span>
            )}
          </div>

          {/* Name */}
          <h1 style={{
            fontFamily: 'var(--font-oswald)', fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 700, textTransform: 'uppercase', color: '#fdfbf7',
            lineHeight: 1, marginBottom: '0.75rem'
          }}>{o.name}</h1>

          {/* Location */}
          <p style={{
            fontFamily: 'var(--font-oswald)', fontSize: '0.85rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#a89880', marginBottom: '1rem'
          }}>📍 {o.city}, {o.state_full}</p>

          {/* Rating */}
          {o.rating && (
            <p style={{ color: '#e8a84c', marginBottom: '1.5rem', fontSize: '1rem' }}>
              {stars} {o.rating} / 5.0
            </p>
          )}

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {o.website && (
              <a href={o.website} target="_blank" rel="noopener" style={{
                fontFamily: 'var(--font-oswald)', fontSize: '0.85rem',
                fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
                background: '#c17f3b', color: '#1a1410',
                padding: '0.85rem 2rem', textDecoration: 'none'
              }}>Visit Website →</a>
            )}
            {o.phone && (
              <a href={`tel:${o.phone}`} style={{
                fontFamily: 'var(--font-oswald)', fontSize: '0.85rem',
                fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#e8a84c', border: '1px solid rgba(193,127,59,0.4)',
                padding: '0.85rem 2rem', textDecoration: 'none'
              }}>{o.phone}</a>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3rem' }}>

          {/* Left */}
          <div>

            {/* About */}
            {o.description && (
              <div style={{ marginBottom: '2.5rem' }}>
                <p style={{
                  fontFamily: 'var(--font-oswald)', fontSize: '0.7rem',
                  letterSpacing: '0.3em', textTransform: 'uppercase', color: '#e8a84c',
                  marginBottom: '0.75rem'
                }}>About This Outfitter</p>
                <p style={{ color: '#d4c5b0', lineHeight: 1.8, fontSize: '1rem' }}>{o.description}</p>
                {o.highlights && o.highlights.length > 0 && (
                  <ul style={{
                    marginTop: '1.25rem', listStyle: 'none', padding: 0,
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem'
                  }}>
                    {o.highlights.map((h: string) => (
                      <li key={h} style={{
                        fontSize: '0.88rem', color: '#d4c5b0',
                        display: 'flex', alignItems: 'flex-start', gap: '0.5rem'
                      }}>
                        <span style={{ color: '#c17f3b', fontWeight: 700 }}>✓</span> {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Hunt Details */}
            <div style={{ marginBottom: '2.5rem' }}>
              <p style={{
                fontFamily: 'var(--font-oswald)', fontSize: '0.7rem',
                letterSpacing: '0.3em', textTransform: 'uppercase', color: '#e8a84c',
                marginBottom: '0.75rem'
              }}>Hunt Details</p>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '1px', background: 'rgba(255,255,255,0.05)'
              }}>
                {[
                  ['Trip Length', o.trip_length],
                  ['Group Size', o.group_size],
                  ['Land Type', o.land_type],
                  ['Success Rate', o.success_rate],
                  ['Lodging', o.lodging ? `${o.lodging}${o.lodging_included ? ' (included)' : ''}` : null],
                  ['Meals', o.meals_included ? 'Included' : 'Not included'],
                  ['Methods', (o.methods || []).join(' · ')],
                  ['Hunt Type', (o.trip_types || []).join(' / ')],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label as string} style={{ background: '#2e2018', padding: '1rem 1.25rem' }}>
                    <div style={{
                      fontFamily: 'var(--font-oswald)', fontSize: '0.62rem',
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: '#a89880', marginBottom: '0.3rem'
                    }}>{label}</div>
                    <div style={{ fontSize: '0.92rem', color: '#d4c5b0' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div>

            {/* Pricing */}
            {o.price_starting && (
              <div style={{
                background: '#1a1410', border: '1px solid rgba(193,127,59,0.2)',
                padding: '1.5rem', marginBottom: '1.5rem'
              }}>
                <div style={{
                  fontFamily: 'var(--font-oswald)', fontSize: '0.7rem',
                  letterSpacing: '0.25em', textTransform: 'uppercase',
                  color: '#e8a84c', marginBottom: '1rem'
                }}>Starting Price</div>
                <div style={{
                  fontFamily: 'var(--font-oswald)', fontSize: '2.5rem',
                  fontWeight: 700, color: '#e8a84c', lineHeight: 1
                }}>${o.price_starting.toLocaleString()}</div>
                <div style={{
                  fontFamily: 'var(--font-oswald)', fontSize: '0.7rem',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: '#a89880', marginBottom: '1rem'
                }}>per person</div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                  {[
                    [o.lodging_included, 'Lodging included', 'Lodging not included'],
                    [o.meals_included, 'Meals included', 'Meals not included'],
                  ].map(([included, yes, no], i) => (
                    <div key={i} style={{
                      fontSize: '0.82rem', color: included ? '#d4c5b0' : 'rgba(168,152,128,0.5)',
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.3rem 0'
                    }}>
                      <span style={{ color: included ? '#c17f3b' : '#a89880' }}>
                        {included ? '✓' : '–'}
                      </span>
                      {included ? yes : no}
                    </div>
                  ))}
                </div>
                {o.price_notes && (
                  <p style={{
                    fontSize: '0.82rem', color: '#d4c5b0', lineHeight: 1.5,
                    borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem',
                    marginTop: '0.5rem'
                  }}>{o.price_notes}</p>
                )}
              </div>
            )}

            {/* Contact */}
            <div style={{
              background: '#2e2018', border: '1px solid rgba(193,127,59,0.2)',
              padding: '1.5rem'
            }}>
              <div style={{
                fontFamily: 'var(--font-oswald)', fontSize: '0.7rem',
                letterSpacing: '0.25em', textTransform: 'uppercase',
                color: '#e8a84c', marginBottom: '1.25rem'
              }}>Contact This Outfitter</div>
              <div>
                {o.website && (
                  <a href={o.website} target="_blank" rel="noopener" style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    fontSize: '0.85rem', color: '#d4c5b0', textDecoration: 'none'
                  }}>
                    🌐 {o.website.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                  </a>
                )}
                {o.phone && (
                  <a href={`tel:${o.phone}`} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    fontSize: '0.85rem', color: '#d4c5b0', textDecoration: 'none'
                  }}>
                    📞 {o.phone}
                  </a>
                )}
                {o.email && (
                  <a href={`mailto:${o.email}`} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.6rem 0',
                    fontSize: '0.85rem', color: '#d4c5b0', textDecoration: 'none'
                  }}>
                    ✉️ {o.email}
                  </a>
                )}
              </div>
              <p style={{
                fontSize: '0.75rem', color: '#a89880', lineHeight: 1.6,
                paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)',
                marginTop: '0.5rem'
              }}>
                Always contact the outfitter directly to confirm availability and pricing before booking.
              </p>
            </div>

          </div>
        </div>

        {/* Related Outfitters */}
        {related && related.length > 0 && (
          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{
              fontFamily: 'var(--font-oswald)', fontSize: '0.7rem',
              letterSpacing: '0.3em', textTransform: 'uppercase', color: '#e8a84c',
              marginBottom: '2rem'
            }}>More Outfitters in {o.state_full}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.05)' }}>
              {related.map((r: any) => (
                <Link key={r.id} href={`/outfitter/${r.id}`} style={{
                  display: 'block', background: '#1a1410', padding: '1.5rem', textDecoration: 'none',
                }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {(r.species || []).slice(0, 2).map((s: string) => (
                      <span key={s} style={{
                        fontFamily: 'var(--font-oswald)', fontSize: '0.62rem',
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        background: '#c17f3b', color: '#1a1410', padding: '0.15rem 0.5rem'
                      }}>{s}</span>
                    ))}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-oswald)', fontSize: '1rem',
                    fontWeight: 600, textTransform: 'uppercase', color: '#fdfbf7',
                    marginBottom: '0.3rem'
                  }}>{r.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#a89880', marginBottom: '0.75rem' }}>
                    📍 {r.city}, {r.state}
                  </div>
                  {r.price_starting && (
                    <div style={{
                      fontFamily: 'var(--font-oswald)', fontSize: '1rem', color: '#e8a84c'
                    }}>From ${r.price_starting.toLocaleString()}</div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
