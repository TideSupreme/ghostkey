'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { useTideCloak } from '@tidecloak/nextjs'

export default function HomePage() {
  const { logout, getValueFromIdToken, token } = useTideCloak()
  const [username, setUsername] = useState('operator')
  const [missionCount, setMissionCount] = useState(0)

  useEffect(() => {
    if (token) setUsername(getValueFromIdToken('preferred_username') || 'operator')
    if (typeof window !== 'undefined') {
      setMissionCount(JSON.parse(localStorage.getItem('ghostkey:missions') || '[]').length)
    }
  }, [token, getValueFromIdToken])

  const onLogout = useCallback(() => logout(), [logout])

  return (
    <main style={pageStyle}>
      <nav style={navStyle}>
        <Link href="/home" style={brandStyle}><span style={markStyle}>GK</span>GhostKey</Link>
        <div style={navLinksStyle}>
          <Link href="/missions" style={navLinkStyle}>Missions</Link>
          <Link href="/proof" style={navLinkStyle}>Proof</Link>
          <button onClick={onLogout} style={ghostButtonStyle}>Log out</button>
        </div>
      </nav>

      <section style={heroStyle}>
        <div>
          <div style={chipStyle}>Authenticated by Tide • sealed by design</div>
          <h1 style={headlineStyle}>Mission control for AI agents that must not become you.</h1>
          <p style={subheadStyle}>
            Welcome back, {username}. Create one bounded capability, let the agent spend it once, and keep the reusable credential out of the model entirely.
          </p>
          <Link href="/missions" style={primaryCtaStyle}>Create one-use mission</Link>
        </div>
        <div style={scoreboardStyle}>
          <div style={metricStyle}><strong>{missionCount}</strong><span>sealed missions in this browser</span></div>
          <div style={metricStyle}><strong>1x</strong><span>maximum allowed agent spend</span></div>
          <div style={metricStyle}><strong>0</strong><span>reusable secrets handed to AI</span></div>
        </div>
      </section>

      <section style={gridStyle}>
        <Link href="/missions" style={featureCardStyle}>
          <span style={iconStyle}>⚡</span>
          <h2 style={cardTitleStyle}>Issue a GhostKey</h2>
          <p style={cardTextStyle}>Seal a task, amount limit, and deadline with Tide self-encryption. The demo auto-spends it once and rejects replay.</p>
        </Link>
        <Link href="/proof" style={featureCardStyle}>
          <span style={iconStyle}>◇</span>
          <h2 style={cardTitleStyle}>Show the proof</h2>
          <p style={cardTextStyle}>Decrypt the owner-only mission record and verify the Tide-authenticated session that generated the audit evidence.</p>
        </Link>
      </section>
    </main>
  )
}

const pageStyle: CSSProperties = { minHeight: '100vh', background: '#F6F3EC', color: '#101820', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', padding: '24px' }
const navStyle: CSSProperties = { maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 32px' }
const brandStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, color: '#101820', textDecoration: 'none', fontWeight: 900, letterSpacing: '-0.03em' }
const markStyle: CSSProperties = { width: 38, height: 38, borderRadius: 12, background: '#35D3A6', color: '#101820', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 950, boxShadow: '0 10px 24px rgba(16, 24, 32, 0.12)' }
const navLinksStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 12 }
const navLinkStyle: CSSProperties = { color: '#364250', textDecoration: 'none', fontSize: 15, fontWeight: 750, padding: '10px 12px', borderRadius: 12 }
const ghostButtonStyle: CSSProperties = { border: '1px solid #D9D2C4', background: '#FFFFFF', color: '#101820', borderRadius: 12, padding: '10px 14px', cursor: 'pointer', fontWeight: 800 }
const heroStyle: CSSProperties = { maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24, alignItems: 'stretch' }
const chipStyle: CSSProperties = { display: 'inline-flex', background: '#E9FBF5', color: '#0D8D67', border: '1px solid #BCEFDA', padding: '8px 12px', borderRadius: 999, fontSize: 13, fontWeight: 850, marginBottom: 18 }
const headlineStyle: CSSProperties = { fontSize: 44, lineHeight: 1.04, letterSpacing: '-0.055em', margin: '0 0 16px', maxWidth: 760 }
const subheadStyle: CSSProperties = { fontSize: 17, lineHeight: 1.55, color: '#5C6673', maxWidth: 720, margin: '0 0 24px' }
const primaryCtaStyle: CSSProperties = { display: 'inline-flex', textDecoration: 'none', background: '#101820', color: '#F6F3EC', borderRadius: 14, padding: '15px 18px', fontWeight: 900, boxShadow: '0 14px 34px rgba(16,24,32,0.18)' }
const scoreboardStyle: CSSProperties = { background: '#101820', color: '#F6F3EC', borderRadius: 24, padding: 24, display: 'grid', gap: 12, boxShadow: '0 24px 60px rgba(16,24,32,0.18)' }
const metricStyle: CSSProperties = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: 18, display: 'grid', gap: 4 }
const gridStyle: CSSProperties = { maxWidth: 1120, margin: '24px auto 0', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }
const featureCardStyle: CSSProperties = { textDecoration: 'none', color: '#101820', background: '#FFFFFF', border: '1px solid #E2DCCE', borderRadius: 24, padding: 24, minHeight: 210, boxShadow: '0 18px 45px rgba(16,24,32,0.08)', display: 'grid', alignContent: 'start', gap: 10 }
const iconStyle: CSSProperties = { width: 44, height: 44, borderRadius: 14, background: '#FFB347', display: 'grid', placeItems: 'center', fontSize: 22 }
const cardTitleStyle: CSSProperties = { fontSize: 24, margin: '8px 0 0', letterSpacing: '-0.04em' }
const cardTextStyle: CSSProperties = { fontSize: 15, lineHeight: 1.55, color: '#5C6673', margin: 0 }
