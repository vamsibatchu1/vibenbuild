'use client'

import { Project } from '@/types/project'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface TimelineViewProps {
  projects: Project[]
}

export function TimelineView({ projects }: TimelineViewProps) {
  const [selectedWeek, setSelectedWeek] = useState(1)
  const timelineRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const weekRefs = useRef<(HTMLButtonElement | null)[]>([])
  const scrollAccumulatorRef = useRef(0)
  const lastScrollTimeRef = useRef(0)

  // Get project for selected week
  const selectedProject = projects.find((p) => p.week === selectedWeek)

  // Scroll to selected week - instant for responsiveness
  useEffect(() => {
    const weekElement = weekRefs.current[selectedWeek - 1]
    if (weekElement && timelineRef.current) {
      const container = timelineRef.current
      const containerRect = container.getBoundingClientRect()
      const elementRect = weekElement.getBoundingClientRect()
      const scrollLeft = container.scrollLeft + (elementRect.left - containerRect.left) - (containerRect.width / 2) + (elementRect.width / 2)
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'auto', // Changed from 'smooth' to 'auto' for instant response
      })
    }
  }, [selectedWeek])

  // Handle vertical scroll to change weeks
  useEffect(() => {
    const contentArea = contentRef.current
    if (!contentArea) return

    const handleWheel = (e: WheelEvent) => {
      // Prevent default vertical scrolling
      e.preventDefault()
      
      const deltaY = e.deltaY
      const threshold = 10 // Reduced threshold for more responsive scrolling
      const now = Date.now()
      
      // Accumulate scroll delta
      scrollAccumulatorRef.current += deltaY
      
      // Update week if threshold exceeded
      if (Math.abs(scrollAccumulatorRef.current) > threshold) {
        const direction = scrollAccumulatorRef.current > 0 ? 1 : -1
        scrollAccumulatorRef.current = 0 // Reset accumulator
        
        setSelectedWeek((prevWeek) => {
          const newWeek = prevWeek + direction
          return Math.max(1, Math.min(52, newWeek))
        })
        
        lastScrollTimeRef.current = now
      }
      
      // Reset accumulator if no scroll for a short period
      if (now - lastScrollTimeRef.current > 100) {
        scrollAccumulatorRef.current = 0
      }
    }

    contentArea.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      contentArea.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (
    <div className="w-full max-w-[800px] mx-auto bg-white flex flex-col relative h-full" style={{ minHeight: '600px' }}>
      {/* Main Content Area - Centered */}
      <div 
        ref={contentRef}
        className="flex-1 flex items-center justify-center px-4 py-2 overflow-y-auto min-h-0" 
        style={{ paddingBottom: '60px' }}
      >
        {selectedProject ? (
          <motion.div 
            key={selectedWeek}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
            className="w-full max-w-[400px]"
          >
            {/* Thumbnail - 16:9 aspect ratio, 400px width */}
            <div className="w-full mb-6 relative" style={{ paddingBottom: '56.25%' }}> {/* 16:9 = 56.25% */}
              {selectedProject.thumbnails && selectedProject.thumbnails.length > 0 ? (
                <Image
                  src={selectedProject.thumbnails[0]}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <span className="font-ibm-plex-mono text-sm text-black/60">No image</span>
                </div>
              )}
            </div>

            {/* Project Details */}
            <div className="text-left">
              {/* Two-column container: Week + Title | View Project Button */}
              <div className="flex items-end justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="font-ibm-plex-mono text-xs text-black/60 mb-2">
                    Week {String(selectedProject.week).padStart(2, '0')}
                  </div>
                  <h2 className="font-newsreader text-2xl font-light text-black">
                    {selectedProject.title}
                  </h2>
                </div>
                <div className="flex-shrink-0">
                  <Link
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block font-ibm-plex-mono text-sm px-6 py-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors"
                  >
                    View Project →
                  </Link>
                </div>
              </div>
              <p className="font-ibm-plex-mono text-sm text-black/70 mb-4 leading-relaxed text-justify uppercase">
                {selectedProject.description}
              </p>
              {selectedProject.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-ibm-plex-mono text-xs px-2 py-1 border border-black/30 text-black/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="text-center">
            <p className="font-ibm-plex-mono text-black/60">No project found for week {selectedWeek}</p>
          </div>
        )}
      </div>

      {/* Timeline Selector - Stuck to Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white" style={{ paddingBottom: '20px' }}>
        <div className="w-full max-w-[800px] mx-auto">
          {/* Week Numbers - Horizontally Scrollable */}
          <div
            ref={timelineRef}
            className="overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex items-center h-8 px-4" style={{ gap: '20px' }}>
              {Array.from({ length: 52 }, (_, i) => {
                const week = i + 1
                const isSelected = week === selectedWeek
                
                return (
                  <button
                    key={week}
                    ref={(el) => {
                      weekRefs.current[i] = el
                    }}
                    onClick={() => setSelectedWeek(week)}
                    className={`flex-shrink-0 font-ibm-plex-mono text-xs transition-colors whitespace-nowrap ${
                      isSelected
                        ? 'text-black font-bold'
                        : 'text-black/40 hover:text-black/60'
                    }`}
                  >
                    week {week}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
