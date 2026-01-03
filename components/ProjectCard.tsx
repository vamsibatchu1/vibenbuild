'use client'

import { Project } from '@/types/project'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-800">
        {/* Thumbnail */}
        <div className="relative w-full h-48 md:h-64 bg-gray-100 dark:bg-gray-800 overflow-hidden">
          {project.thumbnails && project.thumbnails.length > 0 ? (
            <Image
              src={project.thumbnails[0]}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span>No thumbnail</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          <div className="mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Week {project.week}, {project.year}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
            {project.description}
          </p>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.a>
  )
}

