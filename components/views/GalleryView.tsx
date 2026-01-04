'use client'

import { Project } from '@/types/project'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useMemo } from 'react'

interface GalleryViewProps {
  projects: Project[]
}

// Generate heights with irregular pattern - alternating and varying heights
// Most blocks: height = 0.5x width (half height)
// Some blocks: height > 0.5x width (more than half height)
// Creates irregular pattern where adjacent blocks vary
function getRandomHeight(projectId: string, baseWidth: number, index: number): number {
  let hash = 0
  for (let i = 0; i < projectId.length; i++) {
    hash = projectId.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  // Combine project hash with index to create variation pattern
  const combinedHash = (Math.abs(hash) + index * 17) % 100
  
  // Create irregular pattern: alternate between half and taller heights
  // Use modulo to create waves of variation
  const patternValue = (index % 7) + (combinedHash % 5)
  
  // Base: 60% half height, but with irregular distribution
  if (patternValue < 4) {
    return baseWidth * 0.5
  }
  
  // Vary the taller heights dynamically, but max 70% of width
  const heightMultipliers = [0.5, 0.52, 0.54, 0.56, 0.58, 0.6, 0.62, 0.64, 0.66, 0.68, 0.7]
  const multiplierIndex = patternValue % heightMultipliers.length
  return baseWidth * heightMultipliers[multiplierIndex]
}

export function GalleryView({ projects }: GalleryViewProps) {
  // Calculate base width: (800px - 5 gaps) / 6 columns
  // Using gap-2 (8px) on mobile, gap-3 (12px) on desktop
  // For calculation, using average gap of ~10px
  const baseWidth = (800 - 5 * 10) / 6 // Approximately 125px

  // Generate heights for each project with irregular pattern
  const projectHeights = useMemo(() => {
    return projects.map((project, index) => getRandomHeight(project.id, baseWidth, index))
  }, [projects, baseWidth])

  return (
    <div className="w-full max-w-[800px] mx-auto bg-black">
      <div className="grid grid-cols-6 gap-2 md:gap-3">
        {projects.map((project, index) => {
          const height = projectHeights[index]
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              className="flex flex-col"
            >
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                {/* Number at the top */}
                <div className="mb-1 md:mb-2">
                  <span className="font-ibm-plex-mono text-xs md:text-sm text-white">
                    {String(project.week).padStart(2, '0')}
                  </span>
                </div>

                {/* Thumbnail with random height */}
                <div
                  className="w-full bg-gray-600 relative overflow-hidden"
                  style={{ height: `${height}px` }}
                >
                  {project.thumbnails && project.thumbnails.length > 0 ? (
                    <Image
                      src={project.thumbnails[0]}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

