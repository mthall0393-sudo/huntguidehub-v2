'use client'

import { useEffect, useRef, useState } from 'react'

interface Outfitter {
  id: string
  name: string
  city: string
  state: string
  lat: number
  lng: number
  species: string[]
  price_starting: number
  rating: number
}

interface MapProps {
  outfitters: Outfitter[]
}

function getSpeciesColor(species: string[]): string {
  if (!species || species.length === 0) return '#c17f3b'
  const primary = species[0].toLowerCase()
  if (primary.includes('elk')) return '#8B4513'
  if (primary.includes('deer') || primary.includes('whitetail')) return '#6B8E23'
  if (primary.includes('turkey')) return '#8B6914'
  if (primary.includes('waterfowl') || primary.includes('duck')) return '#1a5276'
  if (primary.includes('pheasant')) return '#7D6608'
  if (primary.includes('hog')) return '#5D4037'
  if (primary.includes('bear')) return '#4E342E'
  if (primary.includes('antelope')) return '#795548'
  return '#c17f3b'
}

export default function OutfitterMap({ outfitters }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [pinCount, setPinCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => {
      const L = (window as any).L
      if (!mapRef.current) return

      const map = L.map(mapRef.current, {
        center: [39.5, -98.5],
        zoom: 4,
        zoomControl: true,
        scrollWheelZoom: false,
        preferCanvas: true,
      })

      mapInstanceRef.current = map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map)

      const renderer = L.canvas({ padding: 0.5 })
      let count = 0

      outfitters.forEach(function(o) {
        if (!o.lat || !o.lng || o.lat === 0 || o.lng === 0) return

        const color = getSpeciesColor(o.species)

        const circle = L.circleMarker([o.lat, o.lng], {
          renderer: renderer,
          radius: 5,
          fillColor: color,
          fillOpacity: 0.9,
          color: '#fdfbf7',
          weight: 1,
          opacity: 0.8,
        })

        const speciesList = (o.species || []).slice(0, 3).join(', ')
        const price = o.price_starting ? 'From $' + o.price_starting.toLocaleString() : ''

        circle.bindPopup(
          '<div style="font-family:Oswald,sans-serif;background:#2e2018;color:#fdfbf7;min-width:180px;">' +
          '<div style="background:#1a1410;padding:8px 12px;">' +
          '<div style="font-size:9px;color:#c17f3b;text-transform:uppercase;letter-spacing:0.15em;">' + speciesList + '</div>' +
          '<div style="font-size:13px;font-weight:700;text-transform:uppercase;color:#fdfbf7;margin-top:3px;">' + o.name + '</div>' +
          '</div>' +
          '<div style="padding:8px 12px;">' +
          '<div style="font-size:11px;color:#a89880;">' + (o.city || '') + ', ' + (o.state || '') + '</div>' +
          (price ? '<div style="font-size:12px;color:#e8a84c;margin-top:4px;">' + price + '</div>' : '') +
          '<a href="/outfitter/' + o.id + '" style="display:inline-block;margin-top:8px;font-size:10px;color:#c17f3b;border:1px solid rgba(193,127,59,0.4);padding:3px 8px;text-decoration:none;">View Profile</a>' +
          '</div></div>',
          { maxWidth: 220 }
        )

        circle.addTo(map)
        count++
      })

      setPinCount(count)
      setLoading(false)
    }

    document.head.appendChild(script)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [outfitters])

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={mapRef}
        style={{
          height: '520px',
          width: '100%',
          background: '#1a1410',
        }}
      />
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        background: 'rgba(26,20,16,0.92)',
        color: '#e8a84c',
        fontFamily: 'Oswald, sans-serif',
        fontSize: '11px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        padding: '5px 12px',
        zIndex: 1000,
        border: '1px solid rgba(193,127,59,0.4)',
        pointerEvents: 'none',
      }}>
        {loading ? 'Loading map...' : pinCount + ' outfitters mapped'}
      </div>
    </div>
  )
}
