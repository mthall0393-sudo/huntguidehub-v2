import type { Metadata } from 'next'
import { Oswald, Source_Serif_4 } from 'next/font/google'
import './globals.css'

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  weight: ['400', '600', '700']
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  weight: ['300', '400'],
  style: ['normal', 'italic']
})

export const metadata: Metadata = {
  title: 'HuntGuideHub - Find Your Perfect Hunting Guide',
  description: 'The most complete directory of verified hunting outfitters and guides across North America.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${oswald.variable} ${sourceSerif.variable}`}>
      <body style={{ background: '#1a1410', color: '#fdfbf7', minHeight: '100vh' }}>
        <header style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: 'rgba(26,20,16,0.92)', backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)', height: '64px',
          display: 'flex', alignItems: 'center'
        }}>
          <div style={{
            maxWidth: '1200px', margin: '0 auto', padding: '0 2rem',
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <a href="/" style={{
              fontFamily: 'var(--font-oswald)', fontSize: '1.25rem',
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
              color: '#fdfbf7', textDecoration: 'none'
            }}>
              Hunt<span style={{ color: '#c17f3b' }}>GuideHub</span>
            </a>
            <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              {[['States', '/states'], ['Species', '/species'], ['About', '/about']].map(([label, href]) => (
                <a key={label} href={href} style={{
                  fontFamily: 'var(--font-oswald)', fontSize: '0.75rem',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: '#a89880', textDecoration: 'none'
                }}>{label}</a>
              ))}
            </nav>
          </div>
        </header>
        <main style={{ paddingTop: '64px' }}>{children}</main>
        <footer style={{
          background: '#2e2018', borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '2rem', marginTop: '4rem', textAlign: 'center'
        }}>
          <p style={{
            fontFamily: 'var(--font-oswald)', fontSize: '0.75rem',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a89880'
          }}>
            &copy; 2026 HuntGuideHub. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  )
}
