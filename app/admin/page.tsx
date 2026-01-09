import { AdminClient } from './AdminClient'
import { getProjects } from '@/data/projects'

export default async function AdminPage() {
  // Load projects on the server side
  const projects = await getProjects()
  
  return <AdminClient initialProjects={projects} />
}
