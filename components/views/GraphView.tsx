'use client'

import { Project } from '@/types/project'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

interface GraphViewProps {
  projects: Project[]
}

interface GraphPoint {
  x: number // Complexity/Effort (0-100)
  y: number // Impact/Value (0-100)
  project: Project
}

export function GraphView({ projects }: GraphViewProps) {
  // Generate random positions for demo (in real app, these would come from project metadata)
  const [points] = useState<GraphPoint[]>(() =>
    projects.map((project) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      project,
    }))
  )

  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null)

  return (
    <div className="w-full max-w-[800px] mx-auto">
      <div className="relative aspect-square bg-black p-8">
        {/* Axes */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* X-axis */}
          <div className="absolute bottom-12 left-12 right-12 h-0.5 bg-white/30">
            <div className="absolute left-0 top-2 font-ibm-plex-mono text-xs text-white/60">
              Low
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-2 font-ibm-plex-mono text-xs text-white/60 whitespace-nowrap">
              Complexity / Effort
            </div>
            <div className="absolute right-0 top-2 font-ibm-plex-mono text-xs text-white/60">
              High
            </div>
          </div>
          {/* Y-axis */}
          <div className="absolute top-12 bottom-12 left-12 w-0.5 bg-white/30">
            <div className="absolute top-0 -left-12 font-ibm-plex-mono text-xs text-white/60 whitespace-nowrap text-left">
              High
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 -left-12 font-ibm-plex-mono text-xs text-white/60 whitespace-nowrap -rotate-90 origin-left text-left">
              Impact / Value
            </div>
            <div className="absolute bottom-0 -left-12 font-ibm-plex-mono text-xs text-white/60 whitespace-nowrap text-left">
              Low
            </div>
          </div>
        </div>

        {/* Grid lines */}
        <div className="absolute inset-12">
          {[0, 25, 50, 75, 100].map((value) => (
            <div key={value}>
              <div
                className="absolute w-full h-0.5 bg-white/10"
                style={{ bottom: `${value}%` }}
              />
              <div
                className="absolute h-full w-0.5 bg-white/10"
                style={{ left: `${value}%` }}
              />
            </div>
          ))}
        </div>

        {/* Quadrant labels */}
        <div className="absolute top-16 left-16 font-ibm-plex-mono text-xs text-white/40">
          High Impact, Low Effort
        </div>
        <div className="absolute top-16 right-16 font-ibm-plex-mono text-xs text-white/40 text-right">
          High Impact, High Effort
        </div>
        <div className="absolute bottom-16 left-16 font-ibm-plex-mono text-xs text-white/40">
          Low Impact, Low Effort
        </div>
        <div className="absolute bottom-16 right-16 font-ibm-plex-mono text-xs text-white/40 text-right">
          Low Impact, High Effort
        </div>

        {/* Data points */}
        <div className="absolute inset-12">
          {points.map((point, index) => (
            <motion.div
              key={point.project.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              className="absolute"
              style={{
                left: `${point.x}%`,
                bottom: `${point.y}%`,
                transform: 'translate(-50%, 50%)',
              }}
              onMouseEnter={() => setHoveredPoint(point.project.id)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <Link
                href={point.project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div
                  className={`w-3 h-3 rounded-full border-2 border-white bg-white transition-all cursor-pointer ${
                    hoveredPoint === point.project.id ? 'scale-150 z-10' : ''
                  }`}
                />
                {hoveredPoint === point.project.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-black border-2 border-white p-2 min-w-[200px] z-20"
                  >
                    <div className="font-ibm-plex-mono text-xs text-white/60 mb-1">
                      {String(point.project.week).padStart(2, '0')}
                    </div>
                    <div className="font-newsreader text-sm font-light text-white mb-1">
                      {point.project.title}
                    </div>
                    <div className="font-ibm-plex-mono text-xs text-white/70">
                      {point.project.description.slice(0, 100)}...
                    </div>
                  </motion.div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

