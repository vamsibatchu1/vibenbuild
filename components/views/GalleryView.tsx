'use client'

import { Project } from '@/types/project'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface GalleryViewProps {
  projects: Project[]
}

export function GalleryView({ projects }: GalleryViewProps) {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
          >
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="aspect-[2/3] border-2 border-white bg-black relative overflow-hidden">
                {project.thumbnails && project.thumbnails.length > 0 ? (
                  <Image
                    src={project.thumbnails[0]}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <span className="font-ibm-plex-mono text-xs text-white/60 mb-2">
                      {String(project.week).padStart(2, '0')}
                    </span>
                    <h3 className="font-newsreader text-sm font-light text-white text-center mb-2">
                      {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {project.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="font-ibm-plex-mono text-xs text-white/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

