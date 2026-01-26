import { Metadata } from 'next'
import { AdminClient } from './AdminClient'
import { getExperiments } from '@/app/allexperiments/getExperiments'

export const metadata: Metadata = {
  title: 'Vibe N Build - Admin',
}

export default async function AdminPage() {
  // Load experiments on the server side
  const experiments = await getExperiments()
  
  return <AdminClient initialExperiments={experiments} />
}
