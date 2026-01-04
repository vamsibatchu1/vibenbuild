import type { Metadata } from 'next'
import { Newsreader, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const newsreader = Newsreader({ 
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-newsreader',
})

const ibmPlexMono = IBM_Plex_Mono({ 
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
})

export const metadata: Metadata = {
  title: 'Vibe and Build',
  description: '52 creative projects built throughout 2026',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${newsreader.variable} ${ibmPlexMono.variable}`}>{children}</body>
    </html>
  )
}

