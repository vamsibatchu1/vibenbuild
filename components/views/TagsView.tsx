'use client'

import { Project } from '@/types/project'
import { motion } from 'framer-motion'

interface TagsViewProps {
  projects: Project[]
}

export function TagsView({ projects }: TagsViewProps) {
  // Get all unique tags from all projects
  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags))).sort()

  return (
    <div className="w-full max-w-[800px] mx-auto bg-white font-ibm-plex-mono">
      <div className="flex flex-wrap gap-3 md:gap-4">
        {allTags.map((tag, index) => (
          <motion.div
            key={tag}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.02 }}
            className="group border border-black bg-transparent px-4 py-3 md:px-6 md:py-4 hover:bg-black transition-colors cursor-pointer inline-block"
          >
            <div className="text-lg md:text-xl lg:text-2xl text-black group-hover:text-white transition-colors whitespace-nowrap">
              #{tag}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

