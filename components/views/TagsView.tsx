'use client'

import { Project } from '@/types/project'
import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface TagsViewProps {
  projects: Project[]
}

interface Segment {
  fill: 'empty' | 'half' | 'full'
}

interface RowItem {
  project: Project
  percentage: number
  segments: Segment[]
  segmentWidth: number
  showName?: boolean
  showPercentage?: boolean
  isContinuation?: boolean
}

export function TagsView({ projects }: TagsViewProps) {
  // Calculate percentage completed based on week number (out of 52)
  const getPercentage = (week: number): number => {
    return Math.round((week / 52) * 100)
  }

  // Create segments for a percentage (10 segments = 10% each)
  const createSegments = (percentage: number): Segment[] => {
    const segments: Segment[] = []
    for (let i = 0; i < 10; i++) {
      const segmentPercentage = (i + 1) * 10
      if (percentage >= segmentPercentage) {
        segments.push({ fill: 'full' })
      } else if (percentage >= segmentPercentage - 5) {
        segments.push({ fill: 'half' })
      } else {
        segments.push({ fill: 'empty' })
      }
    }
    return segments
  }

  // Process items into rows of 3, with segments that can wrap
  const rows = useMemo(() => {
    const maxRowWidth = 800
    const itemGap = 16 // gap between items
    const internalGap = 8 // gap between name, percentage, segments
    const itemsPerRow = 3
    
    const items = projects.map((project) => ({
      project,
      percentage: getPercentage(project.week),
      segments: createSegments(getPercentage(project.week)),
    }))
    
    // Group into rows of 3
    const groupedRows: typeof items[] = []
    for (let i = 0; i < items.length; i += itemsPerRow) {
      groupedRows.push(items.slice(i, i + itemsPerRow))
    }
    
    // Process each row to calculate segment sizes and handle wrapping
    const processedRows: RowItem[][] = []
    
    for (const row of groupedRows) {
      // Calculate text width for each item
      const itemTextWidths = row.map((item) => {
        const projectNameWidth = item.project.title.length * 10.5
        const percentageWidth = 38
        return projectNameWidth + internalGap + percentageWidth + internalGap
      })
      
      const totalTextWidth = itemTextWidths.reduce((sum, w) => sum + w, 0)
      const totalItemGaps = (row.length - 1) * itemGap
      const availableForSegments = maxRowWidth - totalTextWidth - totalItemGaps
      
      // Calculate segment width to fit all segments (10 per item * 3 items = 30 segments)
      const totalSegments = row.length * 10
      const segmentGap = 2
      const totalSegmentGaps = (totalSegments - row.length) * segmentGap // gaps between segments, but not between items
      const calculatedSegmentWidth = Math.max(8, Math.floor((availableForSegments - totalSegmentGaps) / totalSegments))
      
      // Now process each item in the row - check if all 3 items fit together
      const rowItems: RowItem[] = []
      const continuationRows: RowItem[][] = []
      
      // Calculate if all items with all segments fit
      const totalFullWidth = itemTextWidths.reduce((sum, w) => sum + w, 0) + 
                            totalItemGaps + 
                            (row.length * 10 * (calculatedSegmentWidth + segmentGap) - row.length * segmentGap)
      
      if (totalFullWidth <= maxRowWidth) {
        // All items fit completely
        for (const item of row) {
          rowItems.push({
            project: item.project,
            percentage: item.percentage,
            segments: item.segments,
            segmentWidth: calculatedSegmentWidth,
            showName: true,
            showPercentage: true,
          })
        }
      } else {
        // Items don't fit completely - need to wrap segments
        let currentRowWidth = 0
        
        for (let i = 0; i < row.length; i++) {
          const item = row[i]
          const gapNeeded = i > 0 ? itemGap : 0
          const textWidth = itemTextWidths[i]
          const allSegmentsWidth = 10 * (calculatedSegmentWidth + segmentGap) - segmentGap
          const fullItemWidth = textWidth + allSegmentsWidth
          
          // Check how much space is left in the row
          const remainingWidth = maxRowWidth - currentRowWidth - gapNeeded
          
          if (remainingWidth >= fullItemWidth) {
            // Full item fits
            rowItems.push({
              project: item.project,
              percentage: item.percentage,
              segments: item.segments,
              segmentWidth: calculatedSegmentWidth,
              showName: true,
              showPercentage: true,
            })
            currentRowWidth += gapNeeded + fullItemWidth
          } else {
            // Item doesn't fit completely
            const segmentsWidthAvailable = remainingWidth - textWidth
            
            if (segmentsWidthAvailable > 0) {
              const segmentsThatFit = Math.max(0, Math.floor((segmentsWidthAvailable + segmentGap) / (calculatedSegmentWidth + segmentGap)))
              
              if (segmentsThatFit > 0) {
                // Add partial item
                rowItems.push({
                  project: item.project,
                  percentage: item.percentage,
                  segments: item.segments.slice(0, segmentsThatFit),
                  segmentWidth: calculatedSegmentWidth,
                  showName: true,
                  showPercentage: true,
                })
                
                // Remaining segments go to continuation row
                if (segmentsThatFit < 10) {
                  continuationRows.push([{
                    project: item.project,
                    percentage: item.percentage,
                    segments: item.segments.slice(segmentsThatFit),
                    segmentWidth: calculatedSegmentWidth,
                    showName: false,
                    showPercentage: true,
                    isContinuation: true,
                  }])
                }
              } else {
                // Only name + percentage fit
                rowItems.push({
                  project: item.project,
                  percentage: item.percentage,
                  segments: [],
                  segmentWidth: calculatedSegmentWidth,
                  showName: true,
                  showPercentage: true,
                })
                
                // All segments go to continuation row
                continuationRows.push([{
                  project: item.project,
                  percentage: item.percentage,
                  segments: item.segments,
                  segmentWidth: calculatedSegmentWidth,
                  showName: false,
                  showPercentage: true,
                  isContinuation: true,
                }])
              }
            } else {
              // Even name + percentage doesn't fit - shouldn't happen, but handle it
              rowItems.push({
                project: item.project,
                percentage: item.percentage,
                segments: [],
                segmentWidth: calculatedSegmentWidth,
                showName: true,
                showPercentage: true,
              })
              
              continuationRows.push([{
                project: item.project,
                percentage: item.percentage,
                segments: item.segments,
                segmentWidth: calculatedSegmentWidth,
                showName: false,
                showPercentage: true,
                isContinuation: true,
              }])
            }
            currentRowWidth = maxRowWidth // Row is full
          }
        }
      }
      
      // Add the main row
      processedRows.push(rowItems)
      
      // Add continuation rows after the main row (these will appear before next project row)
      processedRows.push(...continuationRows)
    }
    
    return processedRows
  }, [projects])

  return (
    <div className="mx-auto bg-white font-newsreader" style={{ width: '800px', maxWidth: '800px', overflow: 'hidden' }}>
      <div className="flex flex-col gap-y-1">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center text-base md:text-lg"
            style={{ width: '800px', maxWidth: '800px', gap: '16px' }}
          >
            {row.map((item, itemIndex) => {
              const globalIndex = rows.slice(0, rowIndex).reduce((sum, r) => sum + r.length, 0) + itemIndex
              const segmentGap = 2
              
              return (
                <motion.div
                  key={`${item.project.id}-${rowIndex}-${itemIndex}${item.isContinuation ? '-cont' : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: globalIndex * 0.02 }}
                  className="inline-flex items-center"
                  style={{ gap: '8px' }}
                >
                  {/* Project Name - only show if not continuation */}
                  {item.showName && (
                    <span className="text-black whitespace-nowrap">
                      {item.project.title.toUpperCase()}
                    </span>
                  )}
                  
                  {/* Percentage - show if continuation or if showPercentage is true */}
                  {(item.showPercentage || item.isContinuation) && (
                    <span className="text-black font-bold whitespace-nowrap">
                      {item.percentage}%
                    </span>
                  )}
                  
                  {/* Segmented Progress Bar */}
                  {item.segments.length > 0 && (
                    <div className="inline-flex items-center" style={{ gap: `${segmentGap}px` }}>
                      {item.segments.map((segment, segIndex) => (
                        <div
                          key={segIndex}
                          className="border border-black bg-white relative overflow-hidden"
                          style={{ width: `${item.segmentWidth}px`, height: '1em' }}
                        >
                          {segment.fill === 'full' && (
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 0.3, delay: globalIndex * 0.02 + segIndex * 0.01 }}
                              className="h-full bg-black"
                            />
                          )}
                          {segment.fill === 'half' && (
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: '50%' }}
                              transition={{ duration: 0.3, delay: globalIndex * 0.02 + segIndex * 0.01 }}
                              className="h-full bg-black"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
