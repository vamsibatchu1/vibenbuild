import { Metadata } from 'next'
import { NewLayoutClient } from './NewLayoutClient'
import { getExperiments } from '@/app/allexperiments/getExperiments'

export const metadata: Metadata = {
  title: 'Vibe N Build - New Layout',
}

export default async function NewLayoutPage() {
  const experiments = await getExperiments()
  
  return <NewLayoutClient initialExperiments={experiments} />
}
