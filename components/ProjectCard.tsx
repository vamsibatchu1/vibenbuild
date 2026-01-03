'use client'

import { Project } from '@/types/project'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  // Split description into paragraphs if needed
  const descriptionParts = project.description.split('\n').filter(Boolean)
  
  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="border-2 border-black bg-[#FEF0E7] relative">
        {/* Header Section */}
        <div className="border-b-2 border-black p-4 md:p-5 lg:p-6">
          <div className="flex justify-between items-center">
            {/* Project Number - Left, Center Aligned */}
            <div className="font-ibm-plex-mono text-3xl md:text-4xl lg:text-5xl font-bold text-black text-center">
              {String(project.week).padStart(2, '0')}
            </div>

            {/* Title - Right, Center Aligned */}
            <h2 className="font-ibm-plex-mono text-xl md:text-2xl lg:text-3xl font-bold text-black uppercase tracking-tight text-center">
              {project.title}
            </h2>
          </div>
        </div>

        {/* Content Section - Two Columns */}
        <div className="relative flex flex-col md:flex-row">
          {/* Left Column - Text Content */}
          <div className="w-full md:w-[35%] p-6 md:p-8 lg:p-10 space-y-6 md:space-y-8">
            {/* Description Blocks */}
            <div className="space-y-4 md:space-y-6">
              {/* First Description Block */}
              {descriptionParts[0] && (
                <div className="font-ibm-plex-mono text-sm md:text-base lg:text-lg text-black leading-relaxed">
                  {descriptionParts[0]}
                </div>
              )}
              
              {/* Second Description Block */}
              {descriptionParts[1] && (
                <div className="font-ibm-plex-mono text-sm md:text-base lg:text-lg text-black leading-relaxed">
                  {descriptionParts[1]}
                </div>
              )}
            </div>

            {/* Tags and Metadata */}
            <div className="space-y-4 pt-4 border-t-2 border-black">
              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-ibm-plex-mono text-xs md:text-sm text-black border border-black px-2 md:px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Metadata */}
              <div className="font-ibm-plex-mono text-xs md:text-sm text-black">
                <div>Week {project.week}, {project.year}</div>
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block w-[2px] bg-black"></div>
          <div className="md:hidden w-full h-[2px] bg-black"></div>

          {/* Right Column - Images (16:9 aspect ratio) */}
          <div className="flex-1 p-6 md:p-8 lg:p-10">
            <div className="w-full space-y-4">
              {project.thumbnails && project.thumbnails.length > 0 ? (
                project.thumbnails.map((thumbnail, index) => (
                  <div 
                    key={index}
                    className="w-full relative border-2 border-black"
                    style={{ paddingBottom: '56.25%' }} // 16:9 aspect ratio (9/16 = 0.5625)
                  >
                    <Image
                      src={thumbnail}
                      alt={`${project.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="w-full relative" style={{ paddingBottom: '56.25%' }}>
                  <div className="absolute inset-0 border-2 border-black bg-[#FEF0E7] flex items-center justify-center">
                    <span className="font-ibm-plex-mono text-sm text-black">No image</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.a>
  )
}

