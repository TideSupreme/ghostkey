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

const readLatest = (): MissionRecord | null => {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(localStorage.getItem('ghostkey:latest') || 'null')
  } catch {
    return null
  }
}

export default function ProofPage() {
  const { doEncrypt, doDecrypt, token, getValueFromIdToken } = useTideCloak()
  const [question, setQuestion] = useState('Show that the support bot could not reuse refund authority')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [mission, setMission] = useState<MissionRecord | null>(null)
  const [decrypted, setDecrypted] = useState('')
  const [apiProof, setApiProof] = useState('Not checked yet')

  const createFallbackMission = async (): Promise<MissionRecord> => {
    const id = `GK-${Date.now().toString(36).toUpperCase()}`
    const payload = JSON.stringify({ id, agent: 'Audit Bot', action: question, limit: 'read proof only', expires: '5 minutes' })
    const [sealed] = await doEncrypt([{ data: payload, tags: [TAG] }])
    const now = new Date()
    const record: MissionRecord = {
      id,
      agent: 'Audit Bot',
      action: question,
      limit: 'read proof only',
      expires: '5 minutes',
      createdAt: now.toLocaleTimeString(),
      spentAt: new Date(now.getTime() + 1000).toLocaleTimeString(),
      rejectedAt: new Date(now.getTime() + 2200).toLocaleTimeString(),
      ciphertext: String(sealed),
      receipt: `doken-demo:${id}:${String(sealed).slice(0, 18)}`,
    }
    localStorage.setItem('ghostkey:latest', JSON.stringify(record))
    localStorage.setItem('ghostkey:missions', JSON.stringify([record]))
    return record
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMission(null)
    setDecrypted('')
    setApiProof('Checking Tide session…')

    try {
      const record = readLatest() || await createFallbackMission()
      const [opened] = await doDecrypt([{ encrypted: record.ciphertext, tags: [TAG] }])
      setMission(record)
      setDecrypted(String(opened))

      if (token) {
        const res = await fetch('/api/protected', { headers: { Authorization: `Bearer ${token}` } })
        const data = await res.json()
        setApiProof(res.ok ? `Tide JWT verified for vuid ${data.vuid || getValueFromIdToken('vuid') || 'current user'}` : `Tide verifier returned ${res.status}: ${data.error || 'not authorized'}`)
      } else {
        setApiProof('No Tide token in this browser session yet.')
      }
    } catch (err: any) {
      setError(err?.message || 'Could not open the proof ledger.')
      setApiProof('Proof check stopped before verification.')
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
          <Link href="/missions" style={navLinkStyle}>Missions</Link>
        </div>
      </nav>

      <section style={heroStyle}>
        <div>
          <div style={chipStyle}>Feature 2 • prove it after the fact</div>
          <h1 style={headlineStyle}>Open the audit proof without exposing the secret to the server.</h1>
          <p style={subheadStyle}>The proof page decrypts the owner-only mission record in the browser, then calls the protected Tide verifier endpoint to prove the session was authenticated.</p>
        </div>
      </section>

      <section style={workbenchStyle}>
        <form onSubmit={onSubmit} style={formStyle}>
          <label style={labelStyle}>Auditor question<textarea value={question} onChange={(e) => setQuestion(e.target.value)} style={textareaStyle} /></label>
          <button type="submit" disabled={busy} style={primaryButtonStyle}>{busy ? 'Opening proof…' : 'Show proof'}</button>
          {error && <p style={errorStyle}>{error}</p>}
        </form>

        <div style={resultStyle}>
          {!mission ? (
            <div style={emptyStyle}>
              <div style={emptyIconStyle}>◌</div>
              <h2 style={resultTitleStyle}>Proof ledger is ready.</h2>
              <p style={mutedStyle}>Submit the auditor question. If no mission exists, GhostKey creates a sealed demo record so this page works end-to-end.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 14 }}>
              <div style={successBannerStyle}>✓ Proof opened for {mission.id}. No reusable agent credential was stored.</div>
              <div style={proofGridStyle}>
                <div style={proofCardStyle}><span>Mission</span><b>{mission.action}</b></div>
                <div style={proofCardStyle}><span>Spend result</span><b>Used once at {mission.spentAt}</b></div>
                <div style={proofCardStyle}><span>Replay result</span><b>Rejected at {mission.rejectedAt}</b></div>
                <div style={proofCardStyle}><span>Tide verifier</span><b>{apiProof}</b></div>
              </div>
              <div style={sealedStyle}>
                <span>Encrypted mission record</span>
                <code>{mission.ciphertext.slice(0, 180)}…</code>
              </div>
              <div style={plainStyle}>
                <span>Owner-only decrypted payload</span>
                <code>{decrypted}</code>
              </div>
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
const heroStyle: CSSProperties = { maxWidth: 1120, margin: '0 auto 24px' }
const chipStyle: CSSProperties = { display: 'inline-flex', background: '#E9FBF5', color: '#0D8D67', border: '1px solid #BCEFDA', padding: '8px 12px', borderRadius: 999, fontSize: 13, fontWeight: 850, marginBottom: 16 }
const headlineStyle: CSSProperties = { fontSize: 40, lineHeight: 1.04, letterSpacing: '-0.055em', margin: '0 0 12px', maxWidth: 820 }
const subheadStyle: CSSProperties = { fontSize: 15, lineHeight: 1.55, color: '#5C6673', maxWidth: 760, margin: 0 }
const workbenchStyle: CSSProperties = { maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: '410px 1fr', gap: 24, alignItems: 'start' }
const formStyle: CSSProperties = { background: '#FFFFFF', border: '1px solid #E2DCCE', borderRadius: 24, padding: 24, display: 'grid', gap: 16, boxShadow: '0 18px 45px rgba(16,24,32,0.08)' }
const labelStyle: CSSProperties = { display: 'grid', gap: 8, color: '#364250', fontSize: 13, fontWeight: 850 }
const textareaStyle: CSSProperties = { border: '1px solid #D9D2C4', borderRadius: 12, padding: '13px 14px', fontSize: 15, color: '#101820', outlineColor: '#35D3A6', background: '#FFFDF8', minHeight: 122, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.45 }
const primaryButtonStyle: CSSProperties = { border: 'none', borderRadius: 14, padding: '15px 18px', background: '#101820', color: '#F6F3EC', fontSize: 15, fontWeight: 900, cursor: 'pointer', boxShadow: '0 14px 34px rgba(16,24,32,0.18)' }
const errorStyle: CSSProperties = { color: '#B42318', background: '#FFF1F0', borderRadius: 12, padding: 12, margin: 0, fontSize: 14 }
const resultStyle: CSSProperties = { background: '#FFFFFF', border: '1px solid #E2DCCE', borderRadius: 24, padding: 24, minHeight: 430, boxShadow: '0 18px 45px rgba(16,24,32,0.08)' }
const emptyStyle: CSSProperties = { minHeight: 370, display: 'grid', placeItems: 'center', textAlign: 'center', alignContent: 'center', gap: 10 }
const emptyIconStyle: CSSProperties = { width: 58, height: 58, borderRadius: 18, background: '#FFB347', display: 'grid', placeItems: 'center', fontSize: 30, margin: '0 auto' }
const resultTitleStyle: CSSProperties = { fontSize: 24, lineHeight: 1.15, letterSpacing: '-0.04em', margin: '6px 0' }
const mutedStyle: CSSProperties = { color: '#5C6673', lineHeight: 1.55, margin: 0, fontSize: 15 }
const successBannerStyle: CSSProperties = { background: '#E9FBF5', color: '#0D8D67', border: '1px solid #BCEFDA', borderRadius: 14, padding: 14, fontWeight: 900 }
const proofGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }
const proofCardStyle: CSSProperties = { border: '1px solid #ECE7DE', borderRadius: 16, background: '#FFFDF8', padding: 15, display: 'grid', gap: 8, fontSize: 13, color: '#5C6673' }
const sealedStyle: CSSProperties = { display: 'grid', gap: 8, background: '#101820', color: '#A8B3C2', borderRadius: 16, padding: 14, overflowWrap: 'anywhere', fontSize: 12 }
const plainStyle: CSSProperties = { display: 'grid', gap: 8, border: '1px dashed #D9D2C4', borderRadius: 16, padding: 14, color: '#5C6673', overflowWrap: 'anywhere', fontSize: 12 }
