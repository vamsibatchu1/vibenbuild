import { Metadata } from 'next'
import { Experiments2Client } from './Experiments2Client'

export const metadata: Metadata = {
  title: 'Vibe N Build - Experiments 2',
}

export default function Experiments2Page() {
  return <Experiments2Client />
}
