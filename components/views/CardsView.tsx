'use client'

import { ProjectCard } from '@/components/ProjectCard'
import { Project } from '@/types/project'
import { motion, AnimatePresence } from 'framer-motion'

interface CardsViewProps {
  projects: Project[]
}

export function CardsView({ projects }: CardsViewProps) {
  return (
    <div className="flex flex-col md:gap-8 items-center">
      <AnimatePresence mode="wait">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 0.6 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            style={{ transformOrigin: 'center center' }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

