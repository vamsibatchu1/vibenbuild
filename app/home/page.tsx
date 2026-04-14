import { Metadata } from 'next'
import { NewLayoutClient } from '../NewLayoutClient'
import { getExperiments } from '@/app/allexperiments/getExperiments'

export const metadata: Metadata = {
  title: 'Vibe N Build | Home',
}

export default async function Home() {
  const experiments = await getExperiments()
  
  return <NewLayoutClient initialExperiments={experiments} />
}
