'use client'

import { ProjectCard } from '@/components/ProjectCard'
import { Project } from '@/types/project'
import { motion, AnimatePresence } from 'framer-motion'

interface CardsViewProps {
  projects: Project[]
}

function SkeletonCard({ week }: { week: number }) {
  return (
    <div className="border-2 border-dashed border-black/30 bg-white relative w-full opacity-30">
      {/* Header Section */}
      <div className="border-b-2 border-dashed border-black/30 p-4 md:p-5 lg:p-6">
        <div className="flex justify-between items-center">
          {/* Week Number */}
          <div className="font-ibm-plex-mono text-3xl md:text-4xl lg:text-5xl font-bold text-black/40 text-center">
            {String(week).padStart(2, '0')}
          </div>
          {/* Title Skeleton */}
          <div className="h-6 md:h-8 bg-black/10 w-48"></div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative flex flex-col md:flex-row">
        {/* Left Column Skeleton */}
        <div className="w-full md:w-[45%] border-r-2 border-dashed border-black/30 bg-white flex flex-col">
          <div className="border-b-2 border-dashed border-black/30 flex">
            <div className="flex-1 p-3 md:p-4 border-r-2 border-dashed border-black/30">
              <div className="h-4 bg-black/10 w-24 mb-3"></div>
              <div className="h-16 md:h-20 bg-black/5 w-full"></div>
            </div>
            <div className="flex-1 p-3 md:p-4 border-r-2 border-dashed border-black/30">
              <div className="h-4 bg-black/10 w-20 mb-2"></div>
              <div className="h-8 md:h-10 bg-black/5 w-full"></div>
            </div>
            <div className="flex-1 p-3 md:p-4">
              <div className="h-4 bg-black/10 w-24 mb-2 ml-auto"></div>
              <div className="h-4 bg-black/5 w-32 ml-auto"></div>
            </div>
          </div>
          <div className="border-b-2 border-dashed border-black/30 flex">
            <div className="flex-1 p-3 md:p-4 border-r-2 border-dashed border-black/30">
              <div className="h-4 bg-black/10 w-40"></div>
            </div>
            <div className="flex-1 p-3 md:p-4">
              <div className="h-4 bg-black/10 w-32 ml-auto"></div>
            </div>
          </div>
          <div className="flex-1 border-black flex">
            <div className="flex-shrink-0 border-r-2 border-dashed border-black/30 p-3 md:p-4">
              <div className="w-12 h-12 bg-black/5"></div>
            </div>
            <div className="flex-1 p-3 md:p-4">
              <div className="h-4 bg-black/10 w-full mb-2"></div>
              <div className="h-4 bg-black/10 w-5/6"></div>
            </div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="flex-1 p-3 md:p-4">
          <div className="w-full space-y-4">
            <div className="w-full relative" style={{ paddingBottom: '56.25%' }}>
              <div className="absolute inset-0 border-2 border-dashed border-black/30 bg-black/5"></div>
            </div>
            <div className="flex justify-between">
              <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-dashed border-black/30 bg-black/5"></div>
              <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-dashed border-black/30 bg-black/5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
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
        {/* Skeleton cards for weeks 6-52 */}
        {Array.from({ length: 47 }, (_, i) => {
          const week = i + 6
          const index = projects.length + i
          return (
            <motion.div
              key={`skeleton-${week}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="w-full"
            >
              <SkeletonCard week={week} />
            </motion.div>
          )
        })}
      </AnimatePresence>
      </div>
    </div>
  )
}

