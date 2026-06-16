'use client'

import Link from 'next/link'
import { FormEvent, useState, type CSSProperties } from 'react'
import { useTideCloak } from '@tidecloak/nextjs'

const TAG = 'message'

type MissionRecord = {
  id: string
  agent: string
  action: string
  limit: string
  expires: string
  createdAt: string
  spentAt: string
  rejectedAt: string
  ciphertext: string
  receipt: string
}

const readMissions = (): MissionRecord[] => {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('ghostkey:missions') || '[]')
  } catch {
    return []
  }
}

export default function MissionsPage() {
  const { doEncrypt, doDecrypt } = useTideCloak()
  const [agent, setAgent] = useState('Ops Copilot')
  const [action, setAction] = useState('Refund order A-1042 for a customer support escalation')
  const [limit, setLimit] = useState('$50 maximum refund')
  const [expires, setExpires] = useState('15 minutes')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [mission, setMission] = useState<MissionRecord | null>(null)
  const [plainPreview, setPlainPreview] = useState('')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMission(null)
    setPlainPreview('')

    try {
      const id = `GK-${Date.now().toString(36).toUpperCase()}`
      const payload = JSON.stringify({ id, agent, action, limit, expires })
      const [sealed] = await doEncrypt([{ data: payload, tags: [TAG] }])
      const [opened] = await doDecrypt([{ encrypted: String(sealed), tags: [TAG] }])
      const now = new Date()
      const record: MissionRecord = {
        id,
        agent,
        action,
        limit,
        expires,
        createdAt: now.toLocaleTimeString(),
        spentAt: new Date(now.getTime() + 1200).toLocaleTimeString(),
        rejectedAt: new Date(now.getTime() + 2400).toLocaleTimeString(),
        ciphertext: String(sealed),
        receipt: `doken-demo:${id}:${String(sealed).slice(0, 18)}`,
      }
      const missions = [record, ...readMissions()].slice(0, 5)
      localStorage.setItem('ghostkey:missions', JSON.stringify(missions))
      localStorage.setItem('ghostkey:latest', JSON.stringify(record))
      setMission(record)
      setPlainPreview(String(opened))
    } catch (err: any) {
      setError(err?.message || 'Tide could not seal this mission. Re-login and try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main style={pageStyle}>
      <nav style={navStyle}>
        <Link href="/home" style={brandStyle}><span style={markStyle}>GK</span>GhostKey</Link>
        <div style={navLinksStyle}>
          <Link href="/home" style={navLinkStyle}>Home</Link>
          <Link href="/proof" style={navLinkStyle}>Proof</Link>
        </div>
      </nav>

      <section style={heroStyle}>
        <div>
          <div style={chipStyle}>Feature 1 • issue one scoped capability</div>
          <h1 style={headlineStyle}>Create a one-use agent mission.</h1>
          <p style={subheadStyle}>This form seals the mission instructions with Tide self-encryption, then simulates the agent spending the delegated authority once. The replay rejection is shown immediately.</p>
        </div>
        <div style={miniCardStyle}><b>No API keys. No cookies. No refresh tokens.</b><span>The agent receives a disposable capability receipt, not your account.</span></div>
      </section>

      <section style={workbenchStyle}>
        <form onSubmit={onSubmit} style={formStyle}>
          <label style={labelStyle}>Agent name<input value={agent} onChange={(e) => setAgent(e.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Exact action<textarea value={action} onChange={(e) => setAction(e.target.value)} style={textareaStyle} /></label>
          <label style={labelStyle}>Boundary / limit<input value={limit} onChange={(e) => setLimit(e.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Time box<input value={expires} onChange={(e) => setExpires(e.target.value)} style={inputStyle} /></label>
          <button type="submit" disabled={busy} style={primaryButtonStyle}>{busy ? 'Sealing with Tide…' : 'Create GhostKey'}</button>
          {error && <p style={errorStyle}>{error}</p>}
        </form>

        <div style={resultStyle}>
          {!mission ? (
            <div style={emptyStyle}>
              <div style={emptyIconStyle}>↯</div>
              <h2 style={resultTitleStyle}>Your proof will appear here.</h2>
              <p style={mutedStyle}>Submit once to see a sealed mission, a successful spend, and a denied replay.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 14 }}>
              <div style={successBannerStyle}>✓ Mission {mission.id} sealed client-side and spent once.</div>
              <div style={missionCardStyle}>
                <div style={smallLabelStyle}>sealed mission</div>
                <h2 style={resultTitleStyle}>{mission.action}</h2>
                <p style={mutedStyle}>{mission.agent} can act within <b>{mission.limit}</b> for <b>{mission.expires}</b>.</p>
                <div style={cipherStyle}>ciphertext preview: {mission.ciphertext.slice(0, 78)}…</div>
              </div>
              <div style={timelineStyle}>
                <div style={okStepStyle}>✓ {mission.createdAt} Human created a bounded mission.</div>
                <div style={okStepStyle}>✓ {mission.spentAt} Agent spent receipt {mission.receipt}.</div>
                <div style={denyStepStyle}>✕ {mission.rejectedAt} Replay rejected: capability already consumed.</div>
              </div>
              <div style={plainStyle}>Decrypted owner preview: {plainPreview}</div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

const pageStyle: CSSProperties = { minHeight: '100vh', background: '#F6F3EC', color: '#101820', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', padding: 24 }
const navStyle: CSSProperties = { maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 32px' }
const brandStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, color: '#101820', textDecoration: 'none', fontWeight: 900 }
const markStyle: CSSProperties = { width: 38, height: 38, borderRadius: 12, background: '#35D3A6', color: '#101820', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 950 }
const navLinksStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 12 }
const navLinkStyle: CSSProperties = { color: '#364250', textDecoration: 'none', fontSize: 15, fontWeight: 750, padding: '10px 12px', borderRadius: 12 }
const heroStyle: CSSProperties = { maxWidth: 1120, margin: '0 auto 24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'end' }
const chipStyle: CSSProperties = { display: 'inline-flex', background: '#E9FBF5', color: '#0D8D67', border: '1px solid #BCEFDA', padding: '8px 12px', borderRadius: 999, fontSize: 13, fontWeight: 850, marginBottom: 16 }
const headlineStyle: CSSProperties = { fontSize: 40, lineHeight: 1.04, letterSpacing: '-0.055em', margin: '0 0 12px' }
const subheadStyle: CSSProperties = { fontSize: 15, lineHeight: 1.55, color: '#5C6673', maxWidth: 720, margin: 0 }
const miniCardStyle: CSSProperties = { background: '#101820', color: '#F6F3EC', borderRadius: 22, padding: 20, display: 'grid', gap: 8, boxShadow: '0 18px 45px rgba(16,24,32,0.14)' }
const workbenchStyle: CSSProperties = { maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: '410px 1fr', gap: 24, alignItems: 'start' }
const formStyle: CSSProperties = { background: '#FFFFFF', border: '1px solid #E2DCCE', borderRadius: 24, padding: 24, display: 'grid', gap: 16, boxShadow: '0 18px 45px rgba(16,24,32,0.08)' }
const labelStyle: CSSProperties = { display: 'grid', gap: 8, color: '#364250', fontSize: 13, fontWeight: 850 }
const inputStyle: CSSProperties = { border: '1px solid #D9D2C4', borderRadius: 12, padding: '13px 14px', fontSize: 15, color: '#101820', outlineColor: '#35D3A6', background: '#FFFDF8' }
const textareaStyle: CSSProperties = { ...inputStyle, minHeight: 92, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.45 }
const primaryButtonStyle: CSSProperties = { border: 'none', borderRadius: 14, padding: '15px 18px', background: '#101820', color: '#F6F3EC', fontSize: 15, fontWeight: 900, cursor: 'pointer', boxShadow: '0 14px 34px rgba(16,24,32,0.18)' }
const errorStyle: CSSProperties = { color: '#B42318', background: '#FFF1F0', borderRadius: 12, padding: 12, margin: 0, fontSize: 14 }
const resultStyle: CSSProperties = { background: '#FFFFFF', border: '1px solid #E2DCCE', borderRadius: 24, padding: 24, minHeight: 486, boxShadow: '0 18px 45px rgba(16,24,32,0.08)' }
const emptyStyle: CSSProperties = { minHeight: 420, display: 'grid', placeItems: 'center', textAlign: 'center', alignContent: 'center', gap: 10 }
const emptyIconStyle: CSSProperties = { width: 58, height: 58, borderRadius: 18, background: '#FFB347', display: 'grid', placeItems: 'center', fontSize: 30, margin: '0 auto' }
const resultTitleStyle: CSSProperties = { fontSize: 24, lineHeight: 1.15, letterSpacing: '-0.04em', margin: '6px 0' }
const mutedStyle: CSSProperties = { color: '#5C6673', lineHeight: 1.55, margin: 0, fontSize: 15 }
const successBannerStyle: CSSProperties = { background: '#E9FBF5', color: '#0D8D67', border: '1px solid #BCEFDA', borderRadius: 14, padding: 14, fontWeight: 900 }
const missionCardStyle: CSSProperties = { border: '1px solid #ECE7DE', borderRadius: 18, padding: 18, background: '#FFFDF8' }
const smallLabelStyle: CSSProperties = { color: '#7C899A', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 850 }
const cipherStyle: CSSProperties = { marginTop: 14, borderRadius: 12, padding: 12, background: '#101820', color: '#A8B3C2', fontSize: 12, overflowWrap: 'anywhere' }
const timelineStyle: CSSProperties = { display: 'grid', gap: 10 }
const okStepStyle: CSSProperties = { color: '#0D8D67', padding: '11px 12px', borderRadius: 12, background: '#E9FBF5', fontWeight: 800 }
const denyStepStyle: CSSProperties = { color: '#B42318', padding: '11px 12px', borderRadius: 12, background: '#FFF1F0', fontWeight: 800 }
const plainStyle: CSSProperties = { border: '1px dashed #D9D2C4', borderRadius: 14, padding: 12, color: '#5C6673', fontSize: 13, overflowWrap: 'anywhere' }
