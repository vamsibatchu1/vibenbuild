'use client'

import { ProjectCard } from '@/components/ProjectCard'
import { Project } from '@/types/project'
import { motion, AnimatePresence } from 'framer-motion'

interface CardsViewProps {
  projects: Project[]
}

export function CardsView({ projects }: CardsViewProps) {
  return (
    <div className="w-full max-w-[800px] mx-auto">
      <div className="flex flex-col md:gap-8 items-center">
      <AnimatePresence mode="wait">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="w-full"
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </AnimatePresence>
      </div>
    </div>
  )
}

