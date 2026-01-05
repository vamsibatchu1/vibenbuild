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

  return (
    <div className="w-full max-w-[800px] mx-auto bg-white font-ibm-plex-mono">
      {/* Header Section */}
      <div className="mb-8">
        <div className="mb-6">
          <div className="text-xs text-black/70 leading-relaxed max-w-md mb-4">
            Welcome to our brand new exhibition space. All pieces exhibited are part of the 2026 collection designed with Google AI Studio.
          </div>
          <div className="text-xs text-black/70 leading-relaxed max-w-md">
            All items on display for demonstration purposes only. Please feel free to ask us for your preferred item and size.
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="mb-2">
        <div className="flex gap-4 text-xs text-black/80 uppercase tracking-wide items-start">
          <div className="w-16 flex-shrink-0 text-left">Week</div>
          <div className="w-24 flex-shrink-0 text-left">Project Name</div>
          <div className="w-24 flex-shrink-0 text-left">Tags</div>
          <div className="flex-1 min-w-[300px] text-left">Description</div>
          <div className="w-16 flex-shrink-0 text-right">Link</div>
        </div>
      </div>

      {/* Product List */}
      <div className="mb-12">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: index * 0.01 }}
            className={index > 0 ? 'mt-4' : ''}
          >
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:bg-black/5 transition-colors -mt-4 pt-4"
            >
              <div className="flex gap-4 text-xs text-black items-start border-b-2 border-solid border-black pb-4">
                {/* Week Number */}
                <div className="w-16 flex-shrink-0 text-black/80 text-left font-plus-jakarta-sans font-bold text-base tracking-tighter">
                  {String(project.week).padStart(2, '0')}
                </div>

                {/* Project Name */}
                <div className="w-24 flex-shrink-0 text-black text-left font-plus-jakarta-sans font-bold text-base tracking-tighter">
                  {project.title}
                </div>

                {/* Tags */}
                <div className="w-24 flex-shrink-0 text-black/70 text-left">
                  {project.tags.join(', ')}
                </div>

                {/* Description */}
                <div className="flex-1 min-w-[300px] text-black/70 leading-relaxed text-left">
                  {project.description}
                </div>

                {/* Link */}
                <div className="w-16 text-right text-black/60">
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
          <div className="text-xs font-bold text-black mb-3 uppercase tracking-wide">
            Tags Index
          </div>
          <div className="space-y-0.5 text-xs text-black/70">
            {allTags.map((tag) => (
              <div key={tag}>
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Project Info Index */}
        <div>
          <div className="text-xs font-bold text-black mb-3 uppercase tracking-wide">
            Project Info
          </div>
          <div className="space-y-0.5 text-xs text-black/70">
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
        <div className="flex justify-between items-center text-xs text-black/60">
          <div>A project by Vamsi Batchu</div>
          <div className="text-right">
            <div>vibenbuild.com</div>
          </div>
        </div>
      </div>
    </div>
  )
}
