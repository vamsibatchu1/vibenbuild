import { Metadata } from 'next'
import { AboutLayoutClient } from './AboutLayoutClient'

export const metadata: Metadata = {
  title: 'Vibe N Build | About',
}

export default function AboutPage() {
  return <AboutLayoutClient />
}
