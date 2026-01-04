'use client'

import { Project } from '@/types/project'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface ListViewProps {
  projects: Project[]
}

export function ListView({ projects }: ListViewProps) {
  // Get all unique tags for the index
  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags))).sort()

  // Generate a unique pixel pattern for each project based on its ID
  const generatePixelPattern = (projectId: string): boolean[][] => {
    // Use project ID as seed for consistent pattern per project
    const seed = projectId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const pattern: boolean[][] = []
    
    for (let row = 0; row < 6; row++) {
      pattern[row] = []
      for (let col = 0; col < 6; col++) {
        // Outer ring (border) should always be gray (false)
        if (row === 0 || row === 5 || col === 0 || col === 5) {
          pattern[row][col] = false
        } else {
          // Inner 4x4 area: randomize white pixels
          // Generate pseudo-random value based on seed, row, and col
          const value = (seed + row * 7 + col * 11) % 3
          pattern[row][col] = value === 0 // ~33% chance of white in inner area
        }
      }
    }
    
    return pattern
  }

  return (
    <div className="w-full max-w-[800px] mx-auto bg-black font-ibm-plex-mono">
      {/* Header Section */}
      <div className="mb-8">
        <div className="mb-6">
          <div className="text-xs text-white/70 leading-relaxed max-w-md mb-4">
            Welcome to our brand new exhibition space. All pieces exhibited are part of the 2026 collection designed with Google AI Studio.
          </div>
          <div className="text-xs text-white/70 leading-relaxed max-w-md">
            All items on display for demonstration purposes only. Please feel free to ask us for your preferred item and size.
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="mb-2">
        <div className="flex gap-8 text-xs text-white/80 uppercase tracking-wide items-start">
          <div className="w-16 flex-shrink-0 text-left">Week</div>
          <div className="w-20 flex-shrink-0 text-left">Grid</div>
          <div className="w-24 flex-shrink-0 text-left">Project Name</div>
          <div className="w-24 flex-shrink-0 text-left">Tags</div>
          <div className="flex-1 min-w-[300px] text-left">Description</div>
          <div className="w-16 flex-shrink-0 text-right">Link</div>
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-0 mb-12">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: index * 0.01 }}
          >
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-1.5 hover:bg-white/5 transition-colors"
            >
              <div className="flex gap-8 text-xs text-white items-start">
                {/* Week Number */}
                <div className="w-16 flex-shrink-0 text-white/80 text-left">
                  {String(project.week).padStart(2, '0')}
                </div>

                {/* Pixel Grid */}
                <div className="w-20 flex-shrink-0 flex items-start">
                  <div className="grid grid-cols-6 border border-black" style={{ width: '58px', height: '58px', gap: '2px' }}>
                    {generatePixelPattern(project.id).flatMap((row, rowIdx) =>
                      row.map((isWhite, colIdx) => (
                        <div
                          key={`${rowIdx}-${colIdx}`}
                          style={{
                            backgroundColor: isWhite ? 'white' : '#333333',
                            width: '8px',
                            height: '8px',
                          }}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Project Name */}
                <div className="w-24 flex-shrink-0 text-white text-left">
                  {project.title}
                </div>

                {/* Tags */}
                <div className="w-24 flex-shrink-0 text-white/70 text-left">
                  {project.tags.join(', ')}
                </div>

                {/* Description */}
                <div className="flex-1 min-w-[300px] text-white/70 leading-relaxed text-left">
                  {project.description}
                </div>

                {/* Link */}
                <div className="w-16 text-right text-white/60">
                  →
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Indexes Section */}
      <div className="mb-8">
        {/* Tags Index */}
        <div className="mb-6">
          <div className="text-xs font-bold text-white mb-3 uppercase tracking-wide">
            Tags Index
          </div>
          <div className="space-y-0.5 text-xs text-white/70">
            {allTags.map((tag) => (
              <div key={tag}>
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Project Info Index */}
        <div>
          <div className="text-xs font-bold text-white mb-3 uppercase tracking-wide">
            Project Info
          </div>
          <div className="space-y-0.5 text-xs text-white/70">
            <div>Total Projects: 52</div>
            <div>Year: 2026</div>
            <div>Frequency: Weekly</div>
            <div>Platform: Google AI Studio</div>
            <div className="mt-2">Powered by: Gemini</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6">
        <div className="flex justify-between items-center text-xs text-white/60">
          <div>A project by Vamsi Batchu</div>
          <div className="text-right">
            <div>vibenbuild.com</div>
          </div>
        </div>
      </div>
    </div>
  )
}
