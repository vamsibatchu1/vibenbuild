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
          {/* Left Column - Interface Panel */}
          <div className="w-full md:w-[45%] border-r-2 border-black bg-[#FEF0E7]">
            {/* Top Row */}
            <div className="border-b-2 border-black flex">
              {/* COPYING Section */}
              <div className="flex-1 p-3 md:p-4 border-r-2 border-black">
                <div className="font-ibm-plex-mono text-xs md:text-sm text-black uppercase mb-2">
                  COPYING...
                </div>
                <div className="flex items-center justify-center">
                  <svg className="w-12 h-12 md:w-16 md:h-16" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="black" strokeWidth="2" fill="none"/>
                    {Array.from({ length: 12 }).map((_, i) => {
                      const angle = (i * 30 - 90) * (Math.PI / 180);
                      const x1 = 50 + 45 * Math.cos(angle);
                      const y1 = 50 + 45 * Math.sin(angle);
                      const x2 = 50 + 50 * Math.cos(angle);
                      const y2 = 50 + 50 * Math.sin(angle);
                      return (
                        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth="2"/>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* DATA VOLUME Section */}
              <div className="flex-1 p-3 md:p-4 border-r-2 border-black">
                <div className="font-ibm-plex-mono text-xs md:text-sm text-black uppercase mb-2">
                  DATA VOLUME
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-ibm-plex-mono text-xs md:text-sm text-black">280.50</span>
                  <span className="font-ibm-plex-mono text-xs md:text-sm text-black">OF 561TB</span>
                </div>
                <div className="w-full h-4 border-2 border-black bg-[#FEF0E7]">
                  <div className="h-full bg-black" style={{ width: '50%' }}></div>
                </div>
              </div>

              {/* EST. TIME Section */}
              <div className="flex-1 p-3 md:p-4">
                <div className="font-ibm-plex-mono text-xs md:text-sm text-black uppercase mb-2">
                  EST. TIME
                </div>
                <div className="font-ibm-plex-mono text-base md:text-lg font-bold text-black text-right">
                  0h:12m:43s
                </div>
              </div>
            </div>

            {/* Middle Row */}
            <div className="border-b-2 border-black flex">
              <div className="flex-1 p-3 md:p-4 border-r-2 border-black">
                <div className="font-ibm-plex-mono text-xs md:text-sm text-black">
                  OVERALL PROGRESS 50%
                </div>
              </div>
              <div className="flex-1 p-3 md:p-4">
                <div className="font-ibm-plex-mono text-xs md:text-sm text-black text-right">
                  LESS THAN 15 MIN.
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex">
              {/* TRANSFER SPEED Section */}
              <div className="flex-1 p-3 md:p-4 border-r-2 border-black">
                <div className="font-ibm-plex-mono text-xs md:text-sm text-black uppercase mb-2">
                  TRANSFER SPEED
                </div>
                <div className="font-ibm-plex-mono text-base md:text-lg font-bold text-black">
                  36GB/s
                </div>
              </div>

              {/* TRANSFER DETAILS Section */}
              <div className="flex-1 p-3 md:p-4 border-r-2 border-black">
                <div className="font-ibm-plex-mono text-xs md:text-sm text-black uppercase mb-2">
                  TRANSFER DETAILS
                </div>
                <div className="font-ibm-plex-mono text-xs md:text-sm text-black mb-1">
                  12,756,809,126,304 FILES
                </div>
                <div className="flex justify-between">
                  <span className="font-ibm-plex-mono text-xs text-black">FROM LOCAL DRIVE</span>
                  <span className="font-ibm-plex-mono text-xs text-black">TO DROPBOX ENTERPRISE</span>
                </div>
              </div>

              {/* ACTIONS Section */}
              <div className="flex-1 p-3 md:p-4">
                <div className="font-ibm-plex-mono text-xs md:text-sm text-black uppercase mb-2">
                  ACTIONS
                </div>
                <div className="space-y-1">
                  <button className="w-full border-2 border-black bg-[#FEF0E7] hover:bg-black hover:text-[#FEF0E7] transition-colors font-ibm-plex-mono text-xs md:text-sm text-black py-1 px-2 text-left">
                    CANCEL
                  </button>
                  <button className="w-full border-2 border-black bg-[#FEF0E7] hover:bg-black hover:text-[#FEF0E7] transition-colors font-ibm-plex-mono text-xs md:text-sm text-black py-1 px-2 text-left">
                    PAUSE
                  </button>
                  <button className="w-full border-2 border-black bg-[#FEF0E7] hover:bg-black hover:text-[#FEF0E7] transition-colors font-ibm-plex-mono text-xs md:text-sm text-black py-1 px-2 text-left">
                    CLOSE WINDOW
                  </button>
                </div>
              </div>
            </div>
          </div>


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

