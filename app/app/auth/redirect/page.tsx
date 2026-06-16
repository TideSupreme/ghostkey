'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTideCloak } from '@tidecloak/nextjs'

export default function RedirectPage() {
  const { authenticated, isInitializing, logout } = useTideCloak()
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('auth') === 'failed') {
      sessionStorage.setItem('tokenExpired', 'true')
      logout()
    }
  }, [logout])

  useEffect(() => {
    if (!isInitializing) router.push(authenticated ? '/home' : '/')
  }, [authenticated, isInitializing, router])

  return (
    <main style={containerStyle}>
      <div style={cardStyle}>
        <div style={markStyle}>GK</div>
        <h1 style={{ margin: '12px 0 6px', fontSize: 24, letterSpacing: '-0.04em' }}>GhostKey is checking Tide…</h1>
        <p style={{ margin: 0, color: '#5C6673' }}>Returning you to your agent mission console.</p>
      </div>
    </main>
  )
}

const containerStyle: React.CSSProperties = { minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#F6F3EC', color: '#101820', fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }
const cardStyle: React.CSSProperties = { width: 360, textAlign: 'center', background: '#FFFFFF', border: '1px solid #E2DCCE', borderRadius: 24, padding: 28, boxShadow: '0 18px 45px rgba(16,24,32,0.08)' }
const markStyle: React.CSSProperties = { width: 48, height: 48, borderRadius: 14, background: '#35D3A6', color: '#101820', display: 'grid', placeItems: 'center', fontWeight: 950, margin: '0 auto' }
