'use client'

import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { useTideCloak } from '@tidecloak/nextjs'

export default function LoginPage() {
  const { login, authenticated, isInitializing } = useTideCloak()
  const router = useRouter()
  const [hover, setHover] = useState(false)

  const onLogin = useCallback(() => {
    login()
  }, [login])

  useEffect(() => {
    if (authenticated) router.push('/home')
  }, [authenticated, router])

  return (
    <main style={shellStyle}>
      <section style={heroStyle}>
        <div style={copyStyle}>
          <div style={brandRowStyle}>
            <div style={markStyle}>GK</div>
            <div>
              <strong style={{ color: '#F6F3EC', letterSpacing: '-0.02em' }}>GhostKey</strong>
              <div style={eyebrowStyle}>One task, not your identity</div>
            </div>
          </div>

          <div style={chipStyle}>Credential-free agent delegation</div>
          <h1 style={headlineStyle}>Let an AI agent act once — without ever becoming you.</h1>
          <p style={subheadStyle}>
            Create a time-boxed mission, seal the sensitive instructions with Tide, spend the authority once, and watch replay fail on screen.
          </p>

          <button
            onClick={onLogin}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{ ...primaryButtonStyle, transform: hover ? 'translateY(-2px)' : 'translateY(0)', boxShadow: hover ? '0 18px 40px rgba(255, 179, 71, 0.32)' : primaryButtonStyle.boxShadow }}
            disabled={isInitializing}
          >
            {isInitializing ? 'Preparing Tide…' : 'Continue with Tide'}
          </button>
        </div>

        <div style={demoPanelStyle} aria-label="GhostKey authority preview">
          <div style={panelHeaderStyle}>
            <span style={dotStyle} />
            <span style={dotStyle} />
            <span style={dotStyle} />
            <span style={{ marginLeft: 'auto', color: '#7C899A', fontSize: 13 }}>live mission</span>
          </div>
          <div style={cardStyle}>
            <div style={smallLabelStyle}>Agent mission</div>
            <h2 style={missionTitleStyle}>Refund order #A-1042 up to $50</h2>
            <div style={ruleGridStyle}>
              <div style={ruleStyle}><b>Scope</b><span>one refund</span></div>
              <div style={ruleStyle}><b>TTL</b><span>15 minutes</span></div>
              <div style={ruleStyle}><b>Secret</b><span>sealed client-side</span></div>
            </div>
            <div style={timelineStyle}>
              <div style={okStepStyle}>✓ Mission created by human</div>
              <div style={okStepStyle}>✓ Agent spent authority once</div>
              <div style={denyStepStyle}>✕ Replay attempt rejected</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

const shellStyle: CSSProperties = {
  minHeight: '100vh',
  background: 'radial-gradient(circle at top left, rgba(53, 211, 166, 0.24), transparent 30%), linear-gradient(135deg, #101820 0%, #172331 48%, #F6F3EC 48%, #F6F3EC 100%)',
  color: '#F6F3EC',
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
}

const heroStyle: CSSProperties = {
  width: 'min(1120px, calc(100% - 48px))',
  margin: '0 auto',
  minHeight: '100vh',
  display: 'grid',
  gridTemplateColumns: '1.04fr 0.96fr',
  gap: 40,
  alignItems: 'center',
}

const copyStyle: CSSProperties = { padding: '40px 0' }
const brandRowStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }
const markStyle: CSSProperties = { width: 48, height: 48, borderRadius: 14, background: '#35D3A6', color: '#101820', display: 'grid', placeItems: 'center', fontWeight: 900, boxShadow: '0 16px 40px rgba(0,0,0,0.18)' }
const eyebrowStyle: CSSProperties = { color: '#A8B3C2', fontSize: 13, marginTop: 2 }
const chipStyle: CSSProperties = { display: 'inline-flex', padding: '8px 12px', borderRadius: 999, background: 'rgba(53, 211, 166, 0.14)', color: '#35D3A6', border: '1px solid rgba(53, 211, 166, 0.32)', fontSize: 13, fontWeight: 700, marginBottom: 16 }
const headlineStyle: CSSProperties = { fontSize: 58, lineHeight: 1.02, letterSpacing: '-0.055em', margin: '0 0 24px', maxWidth: 680 }
const subheadStyle: CSSProperties = { fontSize: 18, lineHeight: 1.55, color: '#C8D0DA', maxWidth: 610, margin: '0 0 32px' }
const primaryButtonStyle: CSSProperties = { border: 'none', borderRadius: 14, padding: '16px 22px', background: '#FFB347', color: '#101820', fontSize: 15, fontWeight: 900, cursor: 'pointer', transition: 'all 160ms ease', boxShadow: '0 12px 28px rgba(255, 179, 71, 0.24)' }
const demoPanelStyle: CSSProperties = { background: 'rgba(255,255,255,0.8)', color: '#101820', borderRadius: 28, padding: 16, boxShadow: '0 24px 70px rgba(16, 24, 32, 0.22)', border: '1px solid rgba(255,255,255,0.72)' }
const panelHeaderStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 7, padding: '8px 10px 16px' }
const dotStyle: CSSProperties = { width: 9, height: 9, borderRadius: 99, background: '#D8DEE6', display: 'inline-block' }
const cardStyle: CSSProperties = { background: '#FFFFFF', borderRadius: 24, padding: 24, border: '1px solid #E6E1D8' }
const smallLabelStyle: CSSProperties = { color: '#6B7280', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }
const missionTitleStyle: CSSProperties = { fontSize: 32, lineHeight: 1.12, letterSpacing: '-0.04em', margin: '10px 0 20px', color: '#101820' }
const ruleGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 22 }
const ruleStyle: CSSProperties = { borderRadius: 16, background: '#F6F3EC', padding: 14, display: 'grid', gap: 6, fontSize: 13, color: '#6B7280' }
const timelineStyle: CSSProperties = { display: 'grid', gap: 10, borderTop: '1px solid #ECE7DE', paddingTop: 18, fontSize: 15, fontWeight: 750 }
const okStepStyle: CSSProperties = { color: '#0D8D67', padding: '10px 12px', borderRadius: 12, background: '#E9FBF5' }
const denyStepStyle: CSSProperties = { color: '#B42318', padding: '10px 12px', borderRadius: 12, background: '#FFF1F0' }
