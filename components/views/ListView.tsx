'use client'

import { Project } from '@/types/project'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface ListViewProps {
  projects: Project[]
}

export function ListView({ projects }: ListViewProps) {
  // Get all unique tags for the index
  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags))).sort()
  
  // State for keyboard navigation
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const keyRepeatTimerRef = useRef<NodeJS.Timeout | null>(null)
  const selectedIndexRef = useRef<number | null>(null)
  
  // Keep ref in sync with state
  useEffect(() => {
    selectedIndexRef.current = selectedIndex
  }, [selectedIndex])
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => {
          const newIndex = prev === null ? 0 : Math.min(prev + 1, projects.length - 1)
          // Scroll to selected row
          setTimeout(() => {
            rowRefs.current[newIndex]?.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'nearest' 
            })
          }, 0)
          return newIndex
        })
        
        // Handle key repeat for smooth navigation
        if (!keyRepeatTimerRef.current) {
          keyRepeatTimerRef.current = setInterval(() => {
            setSelectedIndex((prev) => {
              if (prev === null) return 0
              const newIndex = Math.min(prev + 1, projects.length - 1)
              setTimeout(() => {
                rowRefs.current[newIndex]?.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'nearest' 
                })
              }, 0)
              return newIndex === prev ? prev : newIndex
            })
          }, 100) // Fast repeat rate for smooth movement
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => {
          const newIndex = prev === null ? projects.length - 1 : Math.max(prev - 1, 0)
          // Scroll to selected row
          setTimeout(() => {
            rowRefs.current[newIndex]?.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'nearest' 
            })
          }, 0)
          return newIndex
        })
        
        // Handle key repeat for smooth navigation
        if (!keyRepeatTimerRef.current) {
          keyRepeatTimerRef.current = setInterval(() => {
            setSelectedIndex((prev) => {
              if (prev === null) return projects.length - 1
              const newIndex = Math.max(prev - 1, 0)
              setTimeout(() => {
                rowRefs.current[newIndex]?.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'nearest' 
                })
              }, 0)
              return newIndex === prev ? prev : newIndex
            })
          }, 100) // Fast repeat rate for smooth movement
        }
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const currentIndex = selectedIndexRef.current
        if (currentIndex !== null && rowRefs.current[currentIndex]) {
          // Click the link programmatically
          rowRefs.current[currentIndex]?.click()
        }
      }
    }
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (keyRepeatTimerRef.current) {
          clearInterval(keyRepeatTimerRef.current)
          keyRepeatTimerRef.current = null
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (keyRepeatTimerRef.current) {
        clearInterval(keyRepeatTimerRef.current)
      }
    }
  }, [projects.length])

  return (
    <div className="w-full max-w-[800px] mx-auto bg-white font-ibm-plex-mono">
      {/* Header Section */}
      <div className="mb-8">
        <div className="mb-6">
          <div className="text-xs text-black/70 leading-relaxed max-w-md mb-4 uppercase">
            Welcome to my digital experiment gallery. All apps featured here are part of the 2026 product suite built with Google AI Studio.
          </div>
          <div className="text-xs text-black/70 leading-relaxed max-w-md uppercase flex items-center gap-1 flex-wrap">
            Scroll and Click or Press, up <ArrowUp className="inline-block w-3 h-3" /> and down <ArrowDown className="inline-block w-3 h-3" /> arrows to navigate.
          </div>
        </div>
      </div>

      {/* Column Headers - Hidden on mobile */}
      <div className="mb-2 hidden md:block">
        <div className="flex gap-4 text-xs text-black/80 uppercase tracking-wide items-start border-t-2 border-b-2 border-solid border-black py-2">
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
              className={`block transition-colors ${index === 0 ? '-mt-2 pt-2' : '-mt-4 pt-4'} ${
                selectedIndex === index ? 'bg-black/10' : 'hover:bg-black/5'
              }`}
              ref={(el) => {
                rowRefs.current[index] = el
              }}
            >
              <div className="flex gap-2 md:gap-4 text-xs text-black items-start border-b-2 border-solid border-black pb-4">
                {/* Week Number */}
                <div className="w-12 md:w-16 flex-shrink-0 text-black/80 text-left font-plus-jakarta-sans font-bold text-base tracking-tighter">
                  {String(project.week).padStart(2, '0')}
                </div>

                {/* Project Name */}
                <div className="w-20 md:w-24 flex-shrink-0 text-black text-left font-plus-jakarta-sans font-bold text-base tracking-tighter">
                  {project.title}
                </div>

                {/* Tags - Hidden on mobile */}
                <div className="hidden md:block w-24 flex-shrink-0 text-black/70 text-left">
                  {project.tags.join(', ')}
                </div>

                {/* Description */}
                <div className="flex-1 min-w-0 md:min-w-[300px] text-black/70 leading-relaxed text-left">
                  {project.description}
                </div>

                {/* Link */}
                <div className="w-8 md:w-16 text-right text-black/60">
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
