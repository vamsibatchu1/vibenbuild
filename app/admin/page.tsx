import { Metadata } from 'next'
import { AdminClient } from './AdminClient'
import { getExperiments } from '@/app/allexperiments/getExperiments'
import { getWipIdeas } from '@/app/allexperiments/getWipIdeas'

export const metadata: Metadata = {
  title: 'Vibe N Build - Admin',
}

export default async function AdminPage() {
  // Load experiments and WIP ideas on the server side
  const [experiments, wipIdeas] = await Promise.all([
    getExperiments(),
    getWipIdeas()
  ])
  
  return <AdminClient initialExperiments={experiments} initialWipIdeas={wipIdeas} />
}
