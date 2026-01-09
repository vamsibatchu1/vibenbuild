import { Metadata } from 'next'
import { getProjects } from '@/data/projects'
import { ExperimentsClient } from '@/components/ExperimentsClient'

export const metadata: Metadata = {
  title: 'Vibe N Build - Experiments',
}

export default async function ExperimentsPage() {
  // Load projects on the server side to scan thumbnails folder
  // This is async and uses React cache for performance
  const projects = await getProjects()
  
  return <ExperimentsClient initialProjects={projects} />
}
