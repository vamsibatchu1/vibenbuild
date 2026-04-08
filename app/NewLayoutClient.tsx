'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Experiment } from '@/app/allexperiments/getExperiments'
import { LayoutGrid, List, Maximize, Layers, ExternalLink, Play, ArrowLeft } from 'lucide-react'
import RemoteControl from './RemoteControl'

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

const PANEL_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

const PANEL_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}

const EXPERIMENT_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 1.2 // Loading starts after left panel is mostly done
    }
  }
}

const EXPERIMENT_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({ 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      // If we want a specific order, we can either use staggerChildren 
      // or calculate a direct delay if we have the index.
      // But using staggerChildren is cleaner, we just need to order the items.
    }
  })
}

export function NewLayoutClient({ initialExperiments }: NewLayoutClientProps) {
  const [placedImages, setPlacedImages] = useState<PlacedImage[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('focus') // Default changed to 'focus'
  const [activeMobileView, setActiveMobileView] = useState<'info' | 'experiments'>('info')
  const [activeExperimentIndex, setActiveExperimentIndex] = useState(0)
  const [focusViewMode, setFocusViewMode] = useState<'layers' | 'grid'>('layers')
  const [isChannelChanging, setIsChannelChanging] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)

  const activeExp = initialExperiments[activeExperimentIndex] || initialExperiments[0]

  const triggerChannelChange = (newIndex: number) => {
    setIsChannelChanging(true)
    setActiveExperimentIndex(newIndex)
    setTimeout(() => {
      setIsChannelChanging(false)
    }, 250) // Small burst of static
  }

  const handleNext = () => {
    triggerChannelChange((activeExperimentIndex + 1) % initialExperiments.length)
  }

  const handlePrev = () => {
    triggerChannelChange((activeExperimentIndex - 1 + initialExperiments.length) % initialExperiments.length)
  }

  // Auto-play ticker
  useEffect(() => {
    let interval: any;
    if (isAutoPlaying && viewMode === 'focus' && focusViewMode === 'layers') {
      interval = setInterval(() => {
        handleNext();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, viewMode, focusViewMode, activeExperimentIndex]);

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
    
    // Sort experiments by ID if they aren't already, but they usually are.
    // However, the visual order should be stable.
    
    const shuffled = [...allImages].sort(() => Math.random() - 0.5)
    targetPlacement(shuffled)
  }, [initialExperiments])

  // Sequental loading state
  const [loadingSequenceIndex, setLoadingSequenceIndex] = useState(-1)
  const loadingIndexRef = useRef(-1)
  const processingIndexRef = useRef(-1)
  
  useEffect(() => {
    loadingIndexRef.current = loadingSequenceIndex
  }, [loadingSequenceIndex])

  useEffect(() => {
    // Phase 1: Thumbnails show up first.
    // Calculate how long it takes for all thumbnails to stagger in
    // Initial delay (1.5s) + (number of experiments * stagger (0.1s)) + buffer
    const totalThumbnailTime = 1500 + (initialExperiments.length * 100) + 500;
    
    const timer = setTimeout(() => {
      setLoadingSequenceIndex(0)
    }, totalThumbnailTime)
    return () => clearTimeout(timer)
  }, [initialExperiments.length])

  const handleMediaLoaded = useCallback((index: number) => {
    // Only proceed if this is the item we are currently waiting for 
    // and we haven't already started the timer for it.
    if (index === loadingIndexRef.current && processingIndexRef.current !== index) {
      processingIndexRef.current = index;
      
      // Delay before moving to the next video for a "one by one" feel
      setTimeout(() => {
        setLoadingSequenceIndex(prev => prev + 1);
      }, 300);
    }
  }, [])

  // Fallback timer to prevent getting stuck on a slow-loading video
  useEffect(() => {
    if (loadingSequenceIndex >= 0 && loadingSequenceIndex < initialExperiments.length) {
      const fallback = setTimeout(() => {
        setLoadingSequenceIndex(prev => prev + 1)
      }, 6000) 
      return () => clearTimeout(fallback)
    }
  }, [loadingSequenceIndex, initialExperiments.length])

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
      <motion.aside 
        variants={PANEL_VARIANTS}
        initial="hidden"
        animate="show"
        className={`w-full md:w-[25%] h-screen px-[32px] py-12 md:py-16 flex-col border-r border-white/10 z-20 relative bg-black/50 backdrop-blur-sm shadow-[20px_0_50px_rgba(0,0,0,0.5)] ${activeMobileView === 'info' ? 'flex' : 'hidden md:flex'}`}>
        {/* Top Section */}
        <div className="space-y-12">
           <motion.div 
             variants={PANEL_ITEM_VARIANTS}
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

           <motion.div 
             variants={PANEL_ITEM_VARIANTS}
             className="text-[16px] md:text-[18px] text-white/80 leading-relaxed max-w-[420px] font-ibm-plex-mono tracking-tighter uppercase"
           >
             {mainText}
           </motion.div>
        </div>

        {/* Bottom Section: Buttons and Credit - List button made first and default */}
         <div className="mt-auto space-y-8">
            <motion.div variants={PANEL_ITEM_VARIANTS} className="hidden md:flex gap-4">
               <button 
                 onClick={() => setViewMode('list')}
                 className={`w-12 h-12 flex items-center justify-center border-2 border-white transition-all duration-300 ${viewMode === 'list' ? 'bg-white text-black' : 'bg-transparent text-white hover:bg-white/10'}`}
               >
                 <List size={20} />
               </button>
               <button 
                 onClick={() => setViewMode('focus')}
                 className={`w-12 h-12 flex items-center justify-center border-2 border-white transition-all duration-300 ${viewMode === 'focus' ? 'bg-white text-black' : 'bg-transparent text-white hover:bg-white/10'}`}
               >
                 <Maximize size={20} />
               </button>
            </motion.div>

            {/* Mobile View Experiments Button - Visible on mobile only */}
            <motion.div variants={PANEL_ITEM_VARIANTS} className="md:hidden">
               <button 
                 onClick={() => {
                   setActiveMobileView('experiments')
                   setViewMode('focus')
                 }}
                 className="w-full h-14 border-2 border-white flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all duration-300 group"
               >
                 <span className="text-[12px] font-bold uppercase tracking-[0.2em]">view experiments</span>
                 <Play size={16} fill="currentColor" className="group-hover:scale-110 transition-transform" />
               </button>
            </motion.div>
           
           <motion.div variants={PANEL_ITEM_VARIANTS} className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30 text-white">
             an experimental universe by <a href="https://x.com/vamsibatchuk" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-100 transition-opacity">vamsi batchu</a>
           </motion.div>
        </div>
      </motion.aside>

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
              variants={EXPERIMENT_VARIANTS}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="w-full h-full overflow-y-auto px-6 md:px-12 py-12 md:py-16 custom-scrollbar"
            >
              {/* Desktop View: Three Column Masonry with Horizontal Stagger Order */}
              <div className="hidden lg:flex gap-12 w-full items-start">
                {[0, 1, 2].map((colIdx) => (
                  <div key={`col-${colIdx}`} className="flex-1 flex flex-col">
                    {initialExperiments
                      .filter((_, i) => i % 3 === colIdx)
                      .map((exp) => (
                        <ExperimentItem 
                          key={exp.id} 
                          exp={exp} 
                          idx={initialExperiments.indexOf(exp)} 
                          visualOrder={initialExperiments.indexOf(exp)} 
                          loadingSequenceIndex={loadingSequenceIndex}
                          onLoadComplete={handleMediaLoaded}
                          getFirstFiveSentences={getFirstFiveSentences}
                        />
                      ))
                    }
                  </div>
                ))}
              </div>

              {/* Tablet View: Two Column Masonry */}
              <div className="hidden md:flex lg:hidden gap-8 w-full items-start">
                {[0, 1].map((colIdx) => (
                  <div key={`col-tab-${colIdx}`} className="flex-1 flex flex-col">
                    {initialExperiments
                      .filter((_, i) => i % 2 === colIdx)
                      .map((exp) => (
                        <ExperimentItem 
                          key={exp.id} 
                          exp={exp} 
                          idx={initialExperiments.indexOf(exp)} 
                          visualOrder={initialExperiments.indexOf(exp)} 
                          loadingSequenceIndex={loadingSequenceIndex}
                          onLoadComplete={handleMediaLoaded}
                          getFirstFiveSentences={getFirstFiveSentences}
                        />
                      ))
                    }
                  </div>
                ))}
              </div>

              {/* Mobile View: Single Column */}
              <div className="flex md:hidden flex-col gap-6 w-full">
                {initialExperiments.map((exp, idx) => (
                  <ExperimentItem 
                    key={exp.id} 
                    exp={exp} 
                    idx={idx} 
                    visualOrder={idx} 
                    loadingSequenceIndex={loadingSequenceIndex}
                    onLoadComplete={handleMediaLoaded}
                    getFirstFiveSentences={getFirstFiveSentences}
                  />
                ))}
              </div>
            </motion.div>
          ) : viewMode === 'grid' ? (
            <motion.div 
              key="grid-view" 
              variants={EXPERIMENT_VARIANTS}
              initial="hidden"
              animate="show"
              exit="hidden"
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
                      const absoluteIndex = initialExperiments.findIndex(exp => exp.id === img.id);
                      return (
                        <GridExperimentItem 
                          key={`${img.id}-${i}`}
                          img={img}
                          idx={absoluteIndex}
                          loadingSequenceIndex={loadingSequenceIndex}
                          onLoadComplete={handleMediaLoaded}
                        />
                      )
                  })}
                </div>
              </div>
            </motion.div>
          ) : viewMode === 'focus' ? (
            <motion.div 
              key="focus-view" 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full flex flex-col items-center justify-between pb-[40px] px-[40px]"
            >
              <div className="flex-1 w-full flex items-center justify-center p-8 overflow-hidden">
                <AnimatePresence mode="wait">
                  {focusViewMode === 'layers' ? (
                    <motion.div 
                      key={`focus-thumb-${activeExp.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="w-full max-w-[1000px] aspect-video relative rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                    >
                      <AnimatePresence>
                        {(isChannelChanging) && (
                          <motion.div 
                            key="static-fill"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-20"
                          >
                            <TVStatic />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <TrackedImage 
                         src={activeExp.thumbnailVideo || getImagePath(activeExp.id, activeExp.images[0])}
                         alt={activeExp.title}
                         isVideo={!!activeExp.thumbnailVideo}
                      />
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="focus-grid"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="w-full max-w-[1000px] aspect-video h-full grid grid-cols-3 grid-rows-3 gap-3"
                    >
                      {initialExperiments.slice(0, 9).map((exp, i) => (
                        <div 
                          key={`focus-grid-item-${exp.id}`}
                          onClick={() => {
                            triggerChannelChange(i);
                            setFocusViewMode('layers');
                          }}
                          className={`relative overflow-hidden rounded-lg cursor-pointer border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${activeExperimentIndex === i ? 'border-white' : 'border-white/10 hover:border-white/40'}`}
                        >
                          <TrackedImage 
                             src={exp.thumbnailVideo || getImagePath(exp.id, exp.images[0])}
                             alt={exp.title}
                             isVideo={!!exp.thumbnailVideo}
                             hideStaticOnLoad={false}
                          />
                          <div className="absolute inset-0 bg-black/20 hover:bg-black/0 transition-colors" />
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white opacity-0 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis max-w-[90%] group-hover:opacity-100 uppercase tracking-tighter">
                            {exp.title}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-full max-w-[1000px] flex justify-center mt-auto">
                <RemoteControl 
                  title={activeExp.title} 
                  details={activeExp.text} 
                  onNext={handleNext}
                  onPrev={handlePrev}
                  channelNumber={activeExperimentIndex + 1}
                  totalChannels={initialExperiments.length}
                  activeView={focusViewMode}
                  onViewChange={setFocusViewMode}
                  isPlaying={isAutoPlaying}
                  onPlayChange={setIsAutoPlaying}
                />
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

        @keyframes placeholder-pulsate {
          0% { opacity: 0.1; }
          50% { opacity: 0.25; }
          100% { opacity: 0.1; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scanline {
          animation: scanline 4s linear infinite;
        }
      `}</style>
    </div>
  )
}

function ExperimentItem({ exp, idx, visualOrder, getFirstFiveSentences, loadingSequenceIndex, onLoadComplete }: any) {
  const [isLoaded, setIsLoaded] = useState(false);
  const shouldLoad = idx <= loadingSequenceIndex;

  // Notify parent when loaded to trigger next in sequence
  useEffect(() => {
    if (shouldLoad && isLoaded) {
      onLoadComplete(idx);
    }
  }, [shouldLoad, isLoaded, idx, onLoadComplete]);

  // Helper to get image path inside sub-component
  const getImagePath = (experimentId: string, imageIndex: number): string => {
    const expNumber = experimentId.replace('exp-', '')
    const imgNumber = String(imageIndex + 1).padStart(2, '0')
    return `/images/experiments2/${expNumber}-${imgNumber}.webp`
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: 1.5 + (visualOrder * 0.1), // Increased stagger for "one by one" cell appearance
        ease: "easeOut" 
      }}
      className="break-inside-avoid border-t border-white/20 pt-2 mb-12 flex flex-col group"
    >
      <div className="flex justify-between items-center text-[10px] font-bold opacity-30 uppercase tracking-[0.2em] mb-4">
        <span>EXPERIMENT_LOG</span>
        <span>{String(idx + 1).padStart(2, '0')}/52</span>
      </div>

      <h2 className={`font-newsreader lowercase leading-[0.9] tracking-tight mb-6 text-[42px] font-normal opacity-90 group-hover:opacity-100 transition-opacity`}>
        {exp.title}
      </h2>
      
      <div className="relative overflow-hidden bg-white/5 mb-6 w-full aspect-video rounded-sm shadow-xl">
        {/* Grey Pulsating Placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 z-10 bg-white/[0.05] animate-pulsate" />
        )}

        <div className={`w-full h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {shouldLoad && (
            <>
              {exp.thumbnailVideo ? (
                <video 
                  src={exp.thumbnailVideo} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  onLoadedData={() => setIsLoaded(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                   src={getImagePath(exp.id, exp.images[0])} 
                   alt={exp.title} 
                   onLoad={() => setIsLoaded(true)}
                   className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
                />
              )}
            </>
          )}
        </div>
      </div>

      <div className="space-y-4 mb-6 text-white/60">
        <p className={`text-[12px] leading-relaxed text-justify`}>
          {getFirstFiveSentences(exp.text) || `${exp.title} is an architectural exploration of digital space.`}
        </p>
      </div>
    </motion.div>
  );
}

function GridExperimentItem({ img, idx, loadingSequenceIndex, onLoadComplete }: any) {
  const [isLoaded, setIsLoaded] = useState(false);
  const shouldLoad = idx <= loadingSequenceIndex;

  // Use absolute index for stagger as well, but compressed since grid is smaller
  // or just use 0.1s consistent with the list view.
  const staggerDelay = 1.5 + (idx * 0.1);

  useEffect(() => {
    if (shouldLoad && isLoaded) {
      onLoadComplete(idx);
    }
  }, [shouldLoad, isLoaded, idx, onLoadComplete]);

  return (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
            duration: 0.8, 
            delay: staggerDelay,
            ease: [0.16, 1, 0.3, 1] 
        }}
        style={{
            gridRow: `${img.row + 1} / span ${img.rowSpan}`,
            gridColumn: `${img.col + 1} / span ${img.colSpan}`,
            padding: `${CELL_PADDING}px`
        }}
        className="relative w-full h-full pointer-events-auto"
    >
        <div className="w-full h-full relative group overflow-hidden bg-white/5 shadow-2xl">
            {/* Grey Pulsating Placeholder */}
            {!isLoaded && (
              <div className="absolute inset-0 z-10 bg-white/[0.05] animate-pulsate" />
            )}

            <div className={`w-full h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              {shouldLoad && (
                <>
                  {img.thumbnailVideo ? (
                      <video 
                        src={img.thumbnailVideo} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        onLoadedData={() => setIsLoaded(true)}
                        className="w-full h-full object-cover"
                      />
                  ) : (
                      <Image 
                        src={img.src} 
                        alt={img.title} 
                        fill 
                        onLoad={() => setIsLoaded(true)}
                        className="object-cover transition-all duration-700 group-hover:scale-105" 
                        unoptimized 
                      />
                  )}
                </>
              )}
            </div>

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-4 opacity-0 group-hover:opacity-100">
                <span className="text-[10px] font-bold text-white bg-black/40 px-3 py-1 uppercase tracking-widest border border-white/20">
                    {img.title}
                </span>
            </div>
        </div>
    </motion.div>
  );
}

function TVStatic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      <canvas 
        ref={canvasRef} 
        width="256" 
        height="256" 
        className="w-full h-full object-cover opacity-40 mix-blend-screen"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.03] to-transparent bg-[length:100%_4px] animate-scanline pointer-events-none" />
    </div>
  );
}

function TrackedImage({ src, alt, isVideo = false, hideStaticOnLoad = true }: { src: string, alt: string, isVideo?: boolean, hideStaticOnLoad?: boolean }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full bg-black">
      <AnimatePresence>
        {(!isLoaded && hideStaticOnLoad) && (
          <motion.div 
            key="static-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
          >
            <TVStatic />
          </motion.div>
        )}
      </AnimatePresence>
      
      {isVideo ? (
        <video 
          key={src}
          src={src} 
          autoPlay 
          loop 
          muted 
          playsInline 
          onLoadedData={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      ) : (
        <img 
          src={src} 
          alt={alt} 
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
        />
      )}
    </div>
  );
}
