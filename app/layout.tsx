import type { Metadata } from 'next'
import { Newsreader, IBM_Plex_Mono, Plus_Jakarta_Sans } from 'next/font/google'
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

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta-sans',
})

export const metadata: Metadata = {
  title: 'Vibe N Build',
  description: '52 creative projects built throughout 2026',
  icons: {
    icon: '/images/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${newsreader.variable} ${ibmPlexMono.variable} ${plusJakartaSans.variable}`}>{children}</body>
    </html>
  )
}

