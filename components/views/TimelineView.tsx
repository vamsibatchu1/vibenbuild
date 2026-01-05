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
  const [indicatorPosition, setIndicatorPosition] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const indicatorLineRef = useRef<HTMLDivElement>(null)
  const weekRefs = useRef<(HTMLButtonElement | null)[]>([])
  const scrollAccumulatorRef = useRef(0)
  const lastScrollTimeRef = useRef(0)

  // Get project for selected week
  const selectedProject = projects.find((p) => p.week === selectedWeek)

  // Calculate percentage completed based on week number (out of 52)
  const getPercentage = (week: number): number => {
    return Math.round((week / 52) * 100)
  }

  // Create segments for a percentage (10 segments = 10% each)
  const createSegments = (percentage: number): Array<'empty' | 'half' | 'full'> => {
    const segments: Array<'empty' | 'half' | 'full'> = []
    for (let i = 0; i < 10; i++) {
      const segmentPercentage = (i + 1) * 10
      if (percentage >= segmentPercentage) {
        segments.push('full')
      } else if (percentage >= segmentPercentage - 5) {
        segments.push('half')
      } else {
        segments.push('empty')
      }
    }
    return segments
  }

  // Update indicator position and scroll to selected week
  useEffect(() => {
    const updateIndicatorPosition = () => {
      const weekElement = weekRefs.current[selectedWeek - 1]
      const indicatorLine = indicatorLineRef.current
      const timelineContainer = timelineRef.current
      
      if (weekElement && timelineContainer && indicatorLine) {
        // Calculate scroll position
        const containerRect = timelineContainer.getBoundingClientRect()
        const elementRect = weekElement.getBoundingClientRect()
        const scrollLeft = timelineContainer.scrollLeft + (elementRect.left - containerRect.left) - (containerRect.width / 2) + (elementRect.width / 2)
        
        timelineContainer.scrollTo({
          left: scrollLeft,
          behavior: 'auto',
        })

        // Calculate indicator position relative to the indicator line container
        // We need to account for the scroll position and padding
        const indicatorLineRect = indicatorLine.getBoundingClientRect()
        const weekElementCenter = elementRect.left + (elementRect.width / 2)
        const position = weekElementCenter - indicatorLineRect.left

        setIndicatorPosition(position)
      }
    }

    updateIndicatorPosition()

    // Also update on scroll to keep indicator aligned
    const timelineContainer = timelineRef.current
    if (timelineContainer) {
      timelineContainer.addEventListener('scroll', updateIndicatorPosition)
      return () => {
        timelineContainer.removeEventListener('scroll', updateIndicatorPosition)
      }
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
      const threshold = 30 // Increased threshold to reduce scroll intensity
      const now = Date.now()
      
      // Accumulate scroll delta
      scrollAccumulatorRef.current += deltaY
      
      // Update week if threshold exceeded, but only one at a time
      if (Math.abs(scrollAccumulatorRef.current) > threshold) {
        const direction = scrollAccumulatorRef.current > 0 ? 1 : -1
        scrollAccumulatorRef.current = 0 // Reset accumulator
        
        // Add rate limiting - only change if enough time has passed
        if (now - lastScrollTimeRef.current > 50) {
          setSelectedWeek((prevWeek) => {
            const newWeek = prevWeek + direction
            return Math.max(1, Math.min(52, newWeek))
          })
          
          lastScrollTimeRef.current = now
        }
      }
      
      // Reset accumulator if no scroll for a short period
      if (now - lastScrollTimeRef.current > 150) {
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
          <Link
            href={selectedProject.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full max-w-[400px] transition-transform duration-300 md:hover:-translate-y-2"
          >
            <motion.div 
              key={selectedWeek}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
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
                {/* Title */}
                <div className="mb-2">
                  <h2 className="font-newsreader text-2xl font-light text-black">
                    {selectedProject.title}
                  </h2>
                </div>
              
              {/* Tags Row - Second Row */}
              {selectedProject.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
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
              
              {/* Description - Third Row */}
              <p className="font-ibm-plex-mono text-sm text-black/70 mb-2 leading-relaxed text-justify uppercase">
                {selectedProject.description}
              </p>
              
              {/* Progress Indicator and Week - Last Row */}
              <div className="flex items-center justify-between gap-4">
                {/* Progress Indicator - First Column */}
                <div className="flex items-center gap-2">
                  <span className="font-newsreader text-base font-bold text-black whitespace-nowrap">
                    {getPercentage(selectedProject.week)}%
                  </span>
                  <div className="flex items-center" style={{ gap: '2px' }}>
                    {createSegments(getPercentage(selectedProject.week)).map((segment: 'empty' | 'half' | 'full', index: number) => (
                      <div
                        key={index}
                        className="border border-black bg-white relative overflow-hidden"
                        style={{ width: '24px', height: '1em' }}
                      >
                        {segment === 'full' && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.3, delay: index * 0.01 }}
                            className="h-full bg-black"
                          />
                        )}
                        {segment === 'half' && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '50%' }}
                            transition={{ duration: 0.3, delay: index * 0.01 }}
                            className="h-full bg-black"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Week - Second Column */}
                <div className="font-ibm-plex-mono text-xs text-black/60">
                  Week {String(selectedProject.week).padStart(2, '0')}
                </div>
              </div>
              </div>
            </motion.div>
          </Link>
        ) : (
          <div className="text-center">
            <p className="font-ibm-plex-mono text-black/60">No project found for week {selectedWeek}</p>
          </div>
        )}
      </div>

      {/* Timeline Selector - Stuck to Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white" style={{ paddingBottom: '20px' }}>
        <div className="w-full max-w-[800px] mx-auto">
          {/* Indicator Line with Moving Vertical Marker */}
          <div 
            ref={indicatorLineRef}
            className="relative w-full bg-black mb-2"
            style={{ height: '1px', marginBottom: '8px' }}
          >
            <motion.div
              className="absolute top-0 bg-black"
              style={{
                width: '1px',
                height: '8px',
                left: `${indicatorPosition - 0.5}px`,
                top: '0px',
              }}
              animate={{
                left: `${indicatorPosition - 0.5}px`,
              }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
            />
          </div>
          
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
                    className={`flex-shrink-0 font-inter text-xs transition-colors whitespace-nowrap uppercase ${
                      isSelected
                        ? 'text-black font-bold'
                        : 'text-black/40 hover:text-black/60'
                    }`}
                  >
                    WEEK {week}
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
