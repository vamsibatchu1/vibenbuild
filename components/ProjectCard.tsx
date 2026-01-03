'use client'

import { useState } from 'react'
import { Project } from '@/types/project'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const thumbnails = project.thumbnails || []
  
  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? thumbnails.length - 1 : prev - 1))
  }
  
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === thumbnails.length - 1 ? 0 : prev + 1))
  }

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
                <div className="font-ibm-plex-mono text-xs md:text-sm text-black uppercase mb-3">
                  COPYING...
                </div>
                <div className="flex items-center justify-center">
                  <svg className="w-16 h-16 md:w-20 md:h-20" viewBox="0 0 100 100">
                    {/* Hollow center circle */}
                    <circle cx="50" cy="50" r="8" stroke="black" strokeWidth="1.5" fill="none"/>
                    
                    {/* Rectangular segments in arc (from 10 o'clock to 5 o'clock) */}
                    {Array.from({ length: 24 }).map((_, i) => {
                      // Start at 10 o'clock (210 degrees) and go to 5 o'clock (150 degrees)
                      // That's 210 to 150, but we need to account for clockwise direction
                      // Actually, from 10 o'clock (210°) to 5 o'clock (150°) going clockwise
                      // 210° to 150° clockwise = 210° to 510° (210 + 300) = 300 degrees total
                      const startAngle = 210; // 10 o'clock
                      const endAngle = 150; // 5 o'clock (but we go clockwise)
                      const totalSegments = 24;
                      const angleRange = 300; // 300 degrees clockwise from 10 to 5
                      const angle = (startAngle + (i * angleRange / totalSegments)) * (Math.PI / 180);
                      
                      const innerRadius = 25;
                      const outerRadius = 40;
                      const segmentWidth = 2;
                      
                      const x1 = 50 + innerRadius * Math.cos(angle);
                      const y1 = 50 + innerRadius * Math.sin(angle);
                      const x2 = 50 + outerRadius * Math.cos(angle);
                      const y2 = 50 + outerRadius * Math.sin(angle);
                      
                      // Create rectangular segment
                      const perpAngle = angle + Math.PI / 2;
                      const halfWidth = segmentWidth / 2;
                      const x1a = x1 + halfWidth * Math.cos(perpAngle);
                      const y1a = y1 + halfWidth * Math.sin(perpAngle);
                      const x1b = x1 - halfWidth * Math.cos(perpAngle);
                      const y1b = y1 - halfWidth * Math.sin(perpAngle);
                      const x2a = x2 + halfWidth * Math.cos(perpAngle);
                      const y2a = y2 + halfWidth * Math.sin(perpAngle);
                      const x2b = x2 - halfWidth * Math.cos(perpAngle);
                      const y2b = y2 - halfWidth * Math.sin(perpAngle);
                      
                      return (
                        <polygon
                          key={i}
                          points={`${x1a},${y1a} ${x1b},${y1b} ${x2b},${y2b} ${x2a},${y2a}`}
                          fill="black"
                        />
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
                <div className="flex items-center justify-between mb-2">
                  <span className="font-ibm-plex-mono text-xs md:text-sm text-black">280.50</span>
                  <span className="font-ibm-plex-mono text-xs md:text-sm text-black">OF 561TB</span>
                </div>
                <div className="flex items-end gap-0.5 h-8 md:h-10">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const fillPercentage = 50; // 280.50 / 561 ≈ 50%
                    const barHeight = Math.random() * 0.3 + 0.7; // Random height between 70-100%
                    const shouldFill = i < (fillPercentage / 100) * 20;
                    return (
                      <div
                        key={i}
                        className="flex-1 border border-black"
                        style={{
                          height: `${barHeight * 100}%`,
                          backgroundColor: shouldFill ? 'black' : '#FEF0E7',
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* EST. TIME Section */}
              <div className="flex-1 p-3 md:p-4">
                <div className="font-ibm-plex-mono text-xs md:text-sm text-black uppercase mb-2 text-right">
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
          <div className="flex-1 p-3 md:p-4">
            <div className="w-full space-y-4">
              {/* Image Display */}
              {thumbnails.length > 0 ? (
                <div 
                  className="w-full relative border-2 border-black"
                  style={{ paddingBottom: '56.25%' }} // 16:9 aspect ratio (9/16 = 0.5625)
                >
                  <Image
                    src={thumbnails[currentImageIndex]}
                    alt={`${project.title} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full relative" style={{ paddingBottom: '56.25%' }}>
                  <div className="absolute inset-0 border-2 border-black bg-[#FEF0E7] flex items-center justify-center">
                    <span className="font-ibm-plex-mono text-sm text-black">No image</span>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  className="group w-10 h-10 md:w-12 md:h-12 border-2 border-black bg-[#FEF0E7] hover:bg-black transition-colors flex items-center justify-center cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 !text-black group-hover:!text-[#FEF0E7] transition-colors" />
                </button>
                <button
                  onClick={handleNext}
                  className="group w-10 h-10 md:w-12 md:h-12 border-2 border-black bg-[#FEF0E7] hover:bg-black transition-colors flex items-center justify-center cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 !text-black group-hover:!text-[#FEF0E7] transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.a>
  )
}

