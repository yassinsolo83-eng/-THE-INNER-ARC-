import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Manrope, Geist_Mono } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-cormorant', weight: ['400', '500', '600', '700'] })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = { title: { default: 'The Inner Arc — Tarot for the questions that matter', template: '%s | The Inner Arc' }, description: 'Thoughtful tarot readings for reflection, direction, and the questions that stay with you.', icons: { icon: '/icon.svg', shortcut: '/icon.svg', apple: '/icon.svg' } }

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0F1229',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScaling: false,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} ${geistMono.variable}`}>
      <body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body>
    </html>
  )
}
