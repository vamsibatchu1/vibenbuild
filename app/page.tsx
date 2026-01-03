import { ProjectCard } from '@/components/ProjectCard'
import { getProjects } from '@/data/projects'

export default function Home() {
  const projects = getProjects()
  const sampleProject = projects[0]

  return (
    <main className="min-h-screen bg-[#FEF0E7] flex items-center justify-center p-4 md:p-8">
      {sampleProject && (
        <div className="w-full max-w-5xl">
          <ProjectCard project={sampleProject} />
        </div>
      )}
    </main>
  )
}

