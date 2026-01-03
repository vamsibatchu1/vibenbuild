import { Project } from '@/types/project'
import projectsData from './projects.json'

export function getProjects(): Project[] {
  return projectsData as Project[]
}

export function getProjectById(id: string): Project | undefined {
  return getProjects().find((project) => project.id === id)
}

