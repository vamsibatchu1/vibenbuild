'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Experiment } from '@/app/allexperiments/getExperiments'
import { LayoutGrid, List, Maximize, Layers, ExternalLink, Play, ArrowLeft } from 'lucide-react'

interface NewLayoutClientProps {
  initialExperiments: Experiment[]
}

interface PlacedImage {
  id: string
  src: string
  title: string
  row: number
  col: number
  rowSpan: number
  colSpan: number
  thumbnailVideo?: string
}

const ROWS = 4
const COLS = 4 
const GAP = 16 
const CELL_PADDING = 8 

type ViewMode = 'grid' | 'list' | 'focus' | 'stack'

const getImagePath = (experimentId: string, imageIndex: number): string => {
  const expNumber = experimentId.replace('exp-', '')
  const imgNumber = String(imageIndex + 1).padStart(2, '0')
  return `/images/experiments2/${expNumber}-${imgNumber}.webp`
}

export function NewLayoutClient({ initialExperiments }: NewLayoutClientProps) {
  const [placedImages, setPlacedImages] = useState<PlacedImage[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('list') // Default changed to 'list'
  const [activeMobileView, setActiveMobileView] = useState<'info' | 'experiments'>('info')

  const mainText = "Most vibe-coded apps look the same. I wanted to see what happens when you bring real design thinking to AI tools and ship relentlessly. This is that collection: games, maps, and data viz built to be played with."

  useEffect(() => {
    const allImages: PlacedImage[] = []
    initialExperiments.forEach(exp => {
      if (exp.thumbnailVideo) {
         allImages.push({
           id: exp.id,
           src: 'video-thumb-marker',
           title: exp.title,
           thumbnailVideo: exp.thumbnailVideo,
           row: 0, col: 0, rowSpan: 1, colSpan: 1 
         })
      }

      exp.images.forEach(imgIdx => {
        allImages.push({
          id: exp.id,
          src: getImagePath(exp.id, imgIdx),
          title: exp.title,
          thumbnailVideo: exp.thumbnailVideo,
          row: 0, col: 0, rowSpan: 1, colSpan: 1
        })
      })
    })

    const shuffled = [...allImages].sort(() => Math.random() - 0.5)
    targetPlacement(shuffled)
  }, [initialExperiments])

  const targetPlacement = (shuffled: any[]) => {
    const newPlaced: PlacedImage[] = []
    const occupied = new Set<string>()
    const targetSlotsToFill = 11

    let imagesAttempted = 0
    let slotsSatisfied = 0

    while (slotsSatisfied < targetSlotsToFill && imagesAttempted < shuffled.length) {
      const img = shuffled[imagesAttempted]
      let placed = false
      let attempts = 0
      while (!placed && attempts < 50) {
        const row = Math.floor(Math.random() * ROWS)
        const col = Math.floor(Math.random() * COLS)
        const rand = Math.random()
        let rowSpan = 1
        let colSpan = 1
        
        if (img.thumbnailVideo || rand > 0.94) { rowSpan = 2; colSpan = 2 } 
        else if (rand > 0.88) { rowSpan = 2 }
        else if (rand > 0.82) { colSpan = 2 }

        if (row + rowSpan > ROWS) rowSpan = 1
        if (col + colSpan > COLS) colSpan = 1
        let isOverlap = false
        for (let r = 0; r < rowSpan; r++) {
          for (let c = 0; c < colSpan; c++) {
            if (occupied.has(`${row + r}-${col + c}`)) isOverlap = true
          }
        }
        if (!isOverlap) {
          newPlaced.push({ ...img, row, col, rowSpan, colSpan })
          for (let r = 0; r < rowSpan; r++) {
            for (let c = 0; c < colSpan; c++) {
              occupied.add(`${row + r}-${col + c}`)
              slotsSatisfied++
            }
          }
          placed = true
        }
        attempts++
      }
      imagesAttempted++
    }
    setPlacedImages(newPlaced)
  }

  const getFirstFiveSentences = (text: string) => {
    if (!text) return "";
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    if (!sentences) return text;
    return sentences.slice(0, 5).join(' ');
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden flex flex-col md:flex-row text-white relative font-ibm-plex-mono">
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.2] z-50 mix-blend-screen" 
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} 
      />

      {/* Left Side Panel */}
      <aside className={`w-full md:w-[25%] h-screen px-[32px] py-12 md:py-16 flex-col border-r border-white/10 z-20 relative bg-black/50 backdrop-blur-sm shadow-[20px_0_50px_rgba(0,0,0,0.5)] ${activeMobileView === 'info' ? 'flex' : 'hidden md:flex'}`}>
        {/* Top Section */}
        <div className="space-y-12">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 1, delay: 0.1 }}
             className="w-full"
           >
             <Image 
               src="/images/vibenbuild_landing2.svg"
               alt="Vibe and Build Detailed Logo"
               width={400}
               height={189}
               className="w-full h-auto"
             />
           </motion.div>

           <div className="text-[16px] md:text-[18px] text-white leading-relaxed max-w-[400px]">
             {mainText}
           </div>
        </div>

        {/* Bottom Section: Buttons and Credit - List button made first and default */}
         <div className="mt-auto space-y-8">
            <div className="hidden md:flex gap-4">
               <button 
                 onClick={() => setViewMode('list')}
                 className={`w-12 h-12 flex items-center justify-center border-2 border-white transition-all duration-300 ${viewMode === 'list' ? 'bg-white text-black' : 'bg-transparent text-white hover:bg-white/10'}`}
               >
                 <List size={20} />
               </button>
               <button 
                 onClick={() => setViewMode('grid')}
                 className={`w-12 h-12 flex items-center justify-center border-2 border-white transition-all duration-300 ${viewMode === 'grid' ? 'bg-white text-black' : 'bg-transparent text-white hover:bg-white/10'}`}
               >
                 <LayoutGrid size={20} />
               </button>
               <button 
                 onClick={() => setViewMode('focus')}
                 className={`w-12 h-12 flex items-center justify-center border-2 border-white transition-all duration-300 ${viewMode === 'focus' ? 'bg-white text-black' : 'bg-transparent text-white hover:bg-white/10'}`}
               >
                 <Maximize size={20} />
               </button>
               <button 
                 onClick={() => setViewMode('stack')}
                 className={`w-12 h-12 flex items-center justify-center border-2 border-white transition-all duration-300 ${viewMode === 'stack' ? 'bg-white text-black' : 'bg-transparent text-white hover:bg-white/10'}`}
               >
                 <Layers size={20} />
               </button>
            </div>

            {/* Mobile View Experiments Button */}
            <div className="md:hidden">
               <button 
                 onClick={() => {
                   setActiveMobileView('experiments')
                   setViewMode('list') // Force list mode on mobile for single column
                 }}
                 className="w-full h-14 border-2 border-white flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all duration-300 group"
               >
                 <span className="text-[12px] font-bold uppercase tracking-[0.2em]">view experiments</span>
                 <Play size={16} fill="currentColor" className="group-hover:scale-110 transition-transform" />
               </button>
            </div>
           
           <div className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30 text-white">
             an experimental universe by <a href="https://x.com/vamsibatchuk" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-100 transition-opacity">vamsi batchu</a>
           </div>
        </div>
      </aside>

      {/* Right Side Contents */}
      <main className={`w-full md:w-[75%] h-screen flex items-center justify-center bg-black relative ${activeMobileView === 'experiments' ? 'flex' : 'hidden md:flex'}`}>
        {/* Mobile Back Button */}
        {activeMobileView === 'experiments' && (
          <button 
            onClick={() => setActiveMobileView('info')}
            className="md:hidden fixed top-6 left-6 z-50 bg-white text-black w-10 h-10 flex items-center justify-center border border-white transition-all active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div 
              key="list-view" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="w-full h-full overflow-y-auto px-6 md:px-12 py-12 md:py-16 custom-scrollbar"
            >
              <div className="columns-1 md:columns-2 lg:columns-3 gap-12 w-full">
                {initialExperiments.map((exp, idx) => {
                  return (
                    <motion.div 
                      key={exp.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="break-inside-avoid border-t border-white/20 pt-2 mb-5 flex flex-col group"
                    >
                      <div className="flex justify-between items-center text-[10px] font-bold opacity-30 uppercase tracking-[0.2em] mb-4">
                        <span>EXPERIMENT_LOG</span>
                        <span>{String(idx + 1).padStart(2, '0')}/52</span>
                      </div>

                      <h2 className={`font-newsreader lowercase leading-[0.9] tracking-tight mb-6 text-[42px] font-normal opacity-90 group-hover:opacity-100 transition-opacity`}>
                        {exp.title}
                      </h2>
                      
                      <div className="relative overflow-hidden bg-white/5 transition-all duration-700 mb-6 w-full">
                        {exp.thumbnailVideo ? (
                           <div className="aspect-video relative">
                             <video 
                               src={exp.thumbnailVideo} 
                               autoPlay 
                               loop 
                               muted 
                               playsInline 
                               className="w-full h-full object-cover"
                             />
                           </div>
                        ) : (
                          <div className="w-full relative overflow-hidden group">
                           <img 
                              src={getImagePath(exp.id, exp.images[0])} 
                              alt={exp.title} 
                              className="w-full h-auto object-contain transition-all duration-700 group-hover:scale-105" 
                           />
                          </div>
                        )}
                      </div>

                      <div className="space-y-4 mb-6 text-white/60">
                        <p className={`text-[12px] leading-relaxed text-justify`}>
                          {getFirstFiveSentences(exp.text) || `${exp.title} is an architectural exploration of digital space.`}
                        </p>
                      </div>

                      {/* 
                      <div className="grid grid-cols-2 gap-2 mt-auto">
                         <button className="border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all h-9 flex items-center justify-center gap-2 text-[8px] font-bold uppercase tracking-widest">
                           <ExternalLink size={10} /> VIEW_PROD
                         </button>
                         <button className="border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all h-9 flex items-center justify-center gap-2 text-[8px] font-bold uppercase tracking-widest">
                           <Play size={10} /> REC_FEED
                         </button>
                      </div>
                      */}
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ) : viewMode === 'grid' ? (
            <motion.div 
              key="grid-view" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="w-full max-w-[1200px] h-full flex items-center justify-center p-12 pr-16"
            >
              <div className="w-full relative grid grid-cols-4 grid-rows-4" style={{ gap: `${GAP}px` }}>
                {Array.from({ length: 16 }).map((_, i) => (
                    <div key={`dot-placeholder-${i}`} className="relative w-full aspect-video bg-white/[0.005]">
                        <div className="absolute -top-[2.5px] -left-[2.5px] w-[5px] h-[5px] bg-white rounded-full opacity-30" />
                        <div className="absolute -top-[2.5px] -right-[2.5px] w-[5px] h-[5px] bg-white rounded-full opacity-30" />
                        <div className="absolute -bottom-[2.5px] -left-[2.5px] w-[5px] h-[5px] bg-white rounded-full opacity-30" />
                        <div className="absolute -bottom-[2.5px] -right-[2.5px] w-[5px] h-[5px] bg-white rounded-full opacity-30" />
                    </div>
                ))}
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none" style={{ gap: `${GAP}px` }}>
                  {placedImages.map((img, i) => {
                      return (
                        <motion.div 
                            key={`${img.id}-${i}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                gridRow: `${img.row + 1} / span ${img.rowSpan}`,
                                gridColumn: `${img.col + 1} / span ${img.colSpan}`,
                                padding: `${CELL_PADDING}px`
                            }}
                            className="relative w-full h-full pointer-events-auto"
                        >
                            <div className="w-full h-full relative group overflow-hidden bg-white/5 shadow-2xl">
                                {img.thumbnailVideo ? (
                                   <video 
                                     src={img.thumbnailVideo} 
                                     autoPlay 
                                     loop 
                                     muted 
                                     playsInline 
                                     className="w-full h-full object-cover"
                                   />
                                ) : (
                                   <Image src={img.src} alt={img.title} fill className="object-cover transition-all duration-700 group-hover:scale-105" unoptimized />
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-4 opacity-0 group-hover:opacity-100">
                                    <span className="text-[10px] font-bold text-white bg-black/40 px-3 py-1 uppercase tracking-widest border border-white/20">
                                        {img.title}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                      )
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
              className="text-[12px] font-bold uppercase tracking-widest opacity-20"
            >
              Mode {viewMode.toUpperCase()} coming soon
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.15); }
      `}</style>
    </div>
  )
}
