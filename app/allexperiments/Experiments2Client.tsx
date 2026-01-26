'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import experimentsData from './experiments.json'

interface Experiment {
  id: string
  title: string
  tags: string[]
  tokens: number
  link: string
  text: string
  images: number[]
}

// Load experiments from JSON file
const experiments: Experiment[] = experimentsData as Experiment[]
const filteredExperiments = experiments.filter((experiment) => experiment.id !== 'exp-10')

export function Experiments2Client() {
  const [isMobile, setIsMobile] = useState(false)
  const [currentColumnIndex, setCurrentColumnIndex] = useState(0)

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is typically the breakpoint for mobile
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  useEffect(() => {
    // Prevent body scrolling only on desktop
    if (!isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobile])

  const handleNext = () => {
    const totalColumns = filteredExperiments.length + 1 // +1 for welcome column
    setCurrentColumnIndex((prev) => (prev < totalColumns - 1 ? prev + 1 : prev))
  }

  const handlePrevious = () => {
    setCurrentColumnIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const allColumns = [
    { type: 'welcome' as const },
    ...filteredExperiments.map((exp, idx) => ({ type: 'experiment' as const, experiment: exp, index: idx + 1 }))
  ]

  // Mobile view
  if (isMobile) {
    return (
      <div style={{ width: '100%', minHeight: '100vh' }}>
        <main 
          className="bg-white" 
          style={{ 
            width: '100%',
            minHeight: '100vh',
            boxSizing: 'border-box',
            position: 'relative'
          }}
        >
          {/* Navigation Arrows - Sticky */}
          <div 
            className="flex justify-between items-center"
            style={{
              position: '-webkit-sticky',
              position: 'sticky',
              top: '0',
              zIndex: 10,
              backgroundColor: '#ffffff',
              padding: '20px 16px 16px 16px',
              marginBottom: '0',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <button
              onClick={handlePrevious}
              disabled={currentColumnIndex === 0}
              className={currentColumnIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}
              aria-label="Previous column"
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed #000000',
                backgroundColor: '#ffffff',
                padding: 0
              }}
            >
              <ChevronLeft size={24} className="text-black" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentColumnIndex === allColumns.length - 1}
              className={currentColumnIndex === allColumns.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}
              aria-label="Next column"
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed #000000',
                backgroundColor: '#ffffff',
                padding: 0
              }}
            >
              <ChevronRight size={24} className="text-black" />
            </button>
          </div>

          {/* Column Container */}
          <div 
            style={{ 
              padding: '0 16px 20px 16px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <AnimatePresence mode="wait">
              {allColumns[currentColumnIndex]?.type === 'welcome' ? (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%' }}
                >
                  <WelcomeColumn mobile={true} />
                </motion.div>
              ) : allColumns[currentColumnIndex]?.type === 'experiment' ? (
                <motion.div
                  key={allColumns[currentColumnIndex].experiment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%' }}
                >
                  <ExperimentColumn
                    experiment={allColumns[currentColumnIndex].experiment}
                    index={allColumns[currentColumnIndex].index}
                    mobile={true}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </main>
      </div>
    )
  }

  // Desktop view (unchanged)
  return (
    <main 
      className="bg-white overflow-hidden" 
      style={{ 
        padding: '20px',
        height: '100vh',
        width: '100vw',
        boxSizing: 'border-box'
      }}
    >
      {/* Horizontal Scroll Container */}
      <div className="relative h-full">
        <div className="overflow-x-auto h-full experiments-horizontal-scroll">
          <div className="flex gap-6 h-full items-stretch" style={{ width: 'max-content' }}>
            {/* Welcome Column */}
            <WelcomeColumn />
            
            {/* Experiment Columns */}
            {filteredExperiments.map((experiment, index) => (
              <ExperimentColumn
                key={experiment.id}
                experiment={experiment}
                index={index + 1}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

interface WelcomeColumnProps {
  mobile?: boolean
}

function WelcomeColumn({ mobile = false }: WelcomeColumnProps) {
  if (mobile) {
    return (
      <div
        style={{ 
          width: '100%',
          minHeight: '400px',
          overflow: 'visible',
          position: 'relative'
        }}
      >
        <Image
          src="/images/experiments2/welcome.webp"
          alt="Welcome to my digital experiment gallery"
          width={360}
          height={800}
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain'
          }}
          unoptimized
        />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      className="flex-shrink-0"
      style={{ 
        width: '360px',
        height: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Image
        src="/images/experiments2/welcome.webp"
        alt="Welcome to my digital experiment gallery"
        width={360}
        height={800}
        style={{
          width: '100%',
          height: 'auto',
          position: 'absolute',
          bottom: 0,
          left: 0,
          objectFit: 'cover'
        }}
        unoptimized
      />
    </motion.div>
  )
}

interface ExperimentColumnProps {
  experiment: Experiment
  index: number
  mobile?: boolean
}

function ExperimentColumn({ experiment, index, mobile = false }: ExperimentColumnProps) {
  // Helper function to get image path
  const getImagePath = (experimentId: string, imageIndex: number): string => {
    // Extract experiment number from ID (e.g., 'exp-01' -> '01')
    const expNumber = experimentId.replace('exp-', '')
    // Convert 0-based index to 1-based and pad with zero (0 -> '01', 1 -> '02', etc.)
    const imgNumber = String(imageIndex + 1).padStart(2, '0')
    const path = `/images/experiments2/${expNumber}-${imgNumber}.webp`
    // Debug: log the path (remove in production)
    console.log(`Loading image: ${path} for experiment ${experimentId}, imageIndex ${imageIndex}`)
    return path
  }

  // Function to randomly split text and create content blocks
  const createContentBlocks = (text: string, images: number[]): Array<{ type: 'text' | 'image' | 'header', content?: string, imageIndex?: number }> => {
    const blocks: Array<{ type: 'text' | 'image' | 'header', content?: string, imageIndex?: number }> = []
    
    // Create a seeded random function based on experiment index
    let seedValue = index * 1000
    const seededRandom = (max: number) => {
      seedValue = (seedValue * 9301 + 49297) % 233280
      return Math.floor((seedValue / 233280) * max)
    }
    
    // Determine number of text chunks (2-4 chunks)
    const numChunks = 2 + seededRandom(3) // 2, 3, or 4 chunks
    
    // Split text into roughly equal chunks, ensuring all words are included
    const words = text.split(' ').filter(word => word.length > 0) // Remove empty strings
    const wordsPerChunk = Math.ceil(words.length / numChunks)
    const textChunks: string[] = []
    
    for (let i = 0; i < numChunks; i++) {
      const start = i * wordsPerChunk
      const end = Math.min(start + wordsPerChunk, words.length)
      const chunk = words.slice(start, end).join(' ')
      if (chunk.trim().length > 0) {
        textChunks.push(chunk)
      }
    }
    
    // Track which text chunks have been used
    const usedChunks = new Set<number>()
    
    // Determine layout pattern based on experiment index
    const pattern = seededRandom(5) // 0-4 different patterns
    
    if (pattern === 0) {
      // Pattern: Text, Image, Text, Image, Text, Image
      for (let i = 0; i < images.length; i++) {
        if (textChunks[i] && !usedChunks.has(i)) {
          blocks.push({ type: 'text', content: textChunks[i] })
          usedChunks.add(i)
        }
        blocks.push({ type: 'image', imageIndex: images[i] })
      }
      // Add remaining text chunks
      for (let i = images.length; i < textChunks.length; i++) {
        if (textChunks[i] && !usedChunks.has(i)) {
          blocks.push({ type: 'text', content: textChunks[i] })
          usedChunks.add(i)
        }
      }
    } else if (pattern === 1) {
      // Pattern: Image, Image, Text, Image
      blocks.push({ type: 'image', imageIndex: images[0] })
      blocks.push({ type: 'image', imageIndex: images[1] })
      if (textChunks[0] && !usedChunks.has(0)) {
        blocks.push({ type: 'text', content: textChunks[0] })
        usedChunks.add(0)
      }
      blocks.push({ type: 'image', imageIndex: images[2] })
      if (textChunks[1] && !usedChunks.has(1)) {
        blocks.push({ type: 'text', content: textChunks[1] })
        usedChunks.add(1)
      }
    } else if (pattern === 2) {
      // Pattern: Text, Image, Image, Text, Image
      if (textChunks[0] && !usedChunks.has(0)) {
        blocks.push({ type: 'text', content: textChunks[0] })
        usedChunks.add(0)
      }
      blocks.push({ type: 'image', imageIndex: images[0] })
      blocks.push({ type: 'image', imageIndex: images[1] })
      if (textChunks[1] && !usedChunks.has(1)) {
        blocks.push({ type: 'text', content: textChunks[1] })
        usedChunks.add(1)
      }
      blocks.push({ type: 'image', imageIndex: images[2] })
      if (textChunks[2] && !usedChunks.has(2)) {
        blocks.push({ type: 'text', content: textChunks[2] })
        usedChunks.add(2)
      }
    } else if (pattern === 3) {
      // Pattern: Image, Text, Image, Text, Image
      blocks.push({ type: 'image', imageIndex: images[0] })
      if (textChunks[0] && !usedChunks.has(0)) {
        blocks.push({ type: 'text', content: textChunks[0] })
        usedChunks.add(0)
      }
      blocks.push({ type: 'image', imageIndex: images[1] })
      if (textChunks[1] && !usedChunks.has(1)) {
        blocks.push({ type: 'text', content: textChunks[1] })
        usedChunks.add(1)
      }
      blocks.push({ type: 'image', imageIndex: images[2] })
      if (textChunks[2] && !usedChunks.has(2)) {
        blocks.push({ type: 'text', content: textChunks[2] })
        usedChunks.add(2)
      }
    } else {
      // Pattern: Text, Image, Text, Image, Image
      if (textChunks[0] && !usedChunks.has(0)) {
        blocks.push({ type: 'text', content: textChunks[0] })
        usedChunks.add(0)
      }
      blocks.push({ type: 'image', imageIndex: images[0] })
      if (textChunks[1] && !usedChunks.has(1)) {
        blocks.push({ type: 'text', content: textChunks[1] })
        usedChunks.add(1)
      }
      blocks.push({ type: 'image', imageIndex: images[1] })
      blocks.push({ type: 'image', imageIndex: images[2] })
      if (textChunks[2] && !usedChunks.has(2)) {
        blocks.push({ type: 'text', content: textChunks[2] })
        usedChunks.add(2)
      }
    }
    
    // Add any remaining unused text chunks at the end
    for (let i = 0; i < textChunks.length; i++) {
      if (!usedChunks.has(i) && textChunks[i]) {
        blocks.push({ type: 'text', content: textChunks[i] })
        usedChunks.add(i)
      }
    }
    
    // Add header block and randomly position it
    const headerBlock = { type: 'header' as const }
    const headerPosition = seededRandom(blocks.length + 1) // Random position (0 to blocks.length)
    blocks.splice(headerPosition, 0, headerBlock)
    
    return blocks
  }

  const contentBlocks = createContentBlocks(experiment.text, experiment.images)

  if (mobile) {
    return (
      <div
        className="bg-white flex flex-col"
        style={{ 
          width: '100%',
          minHeight: '100%'
        }}
      >
        {/* Content Blocks */}
        <div>
          {contentBlocks.map((block, blockIndex) => (
            <div key={blockIndex} style={{ marginBottom: blockIndex < contentBlocks.length - 1 ? '20px' : '0' }}>
              {block.type === 'header' ? (
                <div>
                  <div style={{ marginBottom: '8px' }}>
                    <h2 className="text-black font-londrina-solid" style={{ fontSize: '40px', fontWeight: 400, marginTop: '0', marginBottom: '0', lineHeight: '1.1' }}>
                      {experiment.title}
                    </h2>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2" style={{ marginBottom: '8px' }}>
                    {experiment.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs uppercase font-ibm-plex-mono"
                        style={{
                          padding: '4px 8px',
                          border: '1px solid #d1d5db',
                          backgroundColor: '#ffffff',
                          color: '#374151',
                          display: 'inline-block'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Metadata */}
                  <div>
                    {/* Tokens */}
                    <div className="text-xs text-black/60 uppercase font-ibm-plex-mono">
                      Tokens: {experiment.tokens.toLocaleString()}
                    </div>
                  </div>
                </div>
              ) : block.type === 'text' ? (
                <p className="text-black/70 font-gilda-display" style={{ fontSize: '14px', textAlign: 'justify', lineHeight: '1.3', marginBottom: '0' }}>
                  {block.content}
                </p>
              ) : (
                <div className="w-full relative" style={{ aspectRatio: '16/9', minHeight: '200px' }}>
                  {block.imageIndex !== undefined ? (
                    <>
                      <Image
                        src={getImagePath(experiment.id, block.imageIndex)}
                        alt={`${experiment.title} - Image ${block.imageIndex + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-sm"
                        unoptimized
                        onError={(e) => {
                          console.error('Image failed to load:', getImagePath(experiment.id, block.imageIndex!))
                          const parent = e.currentTarget.parentElement
                          if (parent) {
                            parent.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><span class="text-xs text-black/40 uppercase font-ibm-plex-mono">Image not found</span></div>'
                          }
                        }}
                      />
                      {/* Fallback for empty/missing images */}
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center pointer-events-none" style={{ zIndex: -1 }}>
                        <span className="text-xs text-black/40 uppercase font-ibm-plex-mono">
                          Loading...
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-black/40 uppercase font-ibm-plex-mono">
                        Image not found
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 + 0.5 * index, ease: 'easeOut' }}
      className="flex-shrink-0 bg-white h-full flex flex-col experiment-column-scroll"
      style={{ 
        width: '360px',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      {/* Content Blocks */}
      <div>
        {contentBlocks.map((block, blockIndex) => (
          <div key={blockIndex} style={{ marginBottom: blockIndex < contentBlocks.length - 1 ? '20px' : '0' }}>
            {block.type === 'header' ? (
              <div>
                <div style={{ marginBottom: '8px' }}>
                  <h2 className="text-black font-londrina-solid" style={{ fontSize: '40px', fontWeight: 400, marginTop: '0', marginBottom: '0', lineHeight: '1.1' }}>
                    {experiment.title}
                  </h2>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2" style={{ marginBottom: '8px' }}>
                  {experiment.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs uppercase font-ibm-plex-mono"
                      style={{
                        padding: '4px 8px',
                        border: '1px solid #d1d5db',
                        backgroundColor: '#ffffff',
                        color: '#374151',
                        display: 'inline-block'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Metadata */}
                <div>
                  {/* Tokens */}
                  <div className="text-xs text-black/60 uppercase font-ibm-plex-mono">
                    Tokens: {experiment.tokens.toLocaleString()}
                  </div>
                </div>
              </div>
            ) : block.type === 'text' ? (
              <p className="text-black/70 font-gilda-display" style={{ fontSize: '14px', textAlign: 'justify', lineHeight: '1.3', marginBottom: '0' }}>
                {block.content}
              </p>
            ) : (
              <div className="w-full relative" style={{ aspectRatio: '16/9', minHeight: '200px' }}>
                {block.imageIndex !== undefined ? (
                  <>
                    <Image
                      src={getImagePath(experiment.id, block.imageIndex)}
                      alt={`${experiment.title} - Image ${block.imageIndex + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-sm"
                      unoptimized
                      onError={(e) => {
                        console.error('Image failed to load:', getImagePath(experiment.id, block.imageIndex!))
                        const parent = e.currentTarget.parentElement
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><span class="text-xs text-black/40 uppercase font-ibm-plex-mono">Image not found</span></div>'
                        }
                      }}
                    />
                    {/* Fallback for empty/missing images */}
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center pointer-events-none" style={{ zIndex: -1 }}>
                      <span className="text-xs text-black/40 uppercase font-ibm-plex-mono">
                        Loading...
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-black/40 uppercase font-ibm-plex-mono">
                      Image not found
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
