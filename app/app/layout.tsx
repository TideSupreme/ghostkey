import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { TideCloakProvider } from '@tidecloak/nextjs'
import tcConfig from '../tidecloak.json'

export const metadata: Metadata = {
  title: 'GhostKey — one task, not your identity',
  description: 'Create one-use AI agent missions without leaking reusable credentials.',
}

interface RootLayoutProps {
  children: ReactNode
}

const tideConfig = {
  ...tcConfig,
  useDPoP: false,
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#F6F3EC' }}>
        <TideCloakProvider config={tideConfig}>
          {children}
        </TideCloakProvider>
      </body>
    </html>
  )
}
