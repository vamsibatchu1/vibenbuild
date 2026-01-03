import { ProjectGrid } from '@/components/ProjectGrid'
import { Header } from '@/components/Header'
import { getProjects } from '@/data/projects'

export default function Home() {
  const projects = getProjects()

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Vibe and Build
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
            52 creative projects built throughout 2026 using Google AI Studio
          </p>
        </div>
        <ProjectGrid projects={projects} />
      </div>
    </main>
  )
}

