'use client'

import { ProjectCard } from '@/components/ProjectCard'
import { getProjects } from '@/data/projects'
import { motion } from 'framer-motion'

export default function ExperimentsPage() {
  const projects = getProjects()

  return (
    <main className="h-screen bg-[#FEF0E7] flex items-center justify-center">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:gap-8 items-center">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 0.6 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ transformOrigin: 'center center' }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}

