'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, ArrowLeft } from 'lucide-react'

// Variants same as home for consistency
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

export function AboutLayoutClient() {
  const [activeMobileView, setActiveMobileView] = useState<'info' | 'content'>('info')

  const aboutText = "I'm Vamsi Batchu, a designer and developer obsessed with the intersection of high-fidelity aesthetics and agentic AI. This space serves as my digital laboratory where I experiment with layouts, interactions, and the future of web experiences. Every project here is a step towards defining what a truly 'agentic' web feels like."

  return (
    <div className="min-h-screen bg-white overflow-hidden flex flex-col md:flex-row text-black relative font-ibm-plex-mono">
      {/* Texture Overlay - Switched to multiply for white background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.2] z-50 mix-blend-multiply" 
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} 
      />

      {/* Left Side Panel */}
      <motion.aside 
        variants={PANEL_VARIANTS}
        initial="hidden"
        animate="show"
        className={`w-full md:w-[25%] h-screen px-[32px] py-12 md:py-16 flex-col border-r border-black/10 z-20 relative bg-white/50 backdrop-blur-sm shadow-[20px_0_50px_rgba(0,0,0,0.05)] ${activeMobileView === 'info' ? 'flex' : 'hidden md:flex'}`}>
        
        <div className="space-y-12">
           <motion.div variants={PANEL_ITEM_VARIANTS} className="w-full">
             <Image 
               src="/images/vibenbuild_landing2.svg"
               alt="Vibe and Build Logo"
               width={400}
               height={189}
               className="w-full h-auto invert" 
             />
           </motion.div>

           <motion.div 
             variants={PANEL_ITEM_VARIANTS}
             className="text-[16px] md:text-[18px] text-black/80 leading-relaxed max-w-[420px] font-ibm-plex-mono tracking-tighter uppercase"
           >
             {aboutText}
           </motion.div>
        </div>

        <div className="mt-auto space-y-8">
            <motion.div variants={PANEL_ITEM_VARIANTS} className="md:hidden">
               <button 
                 onClick={() => setActiveMobileView('content')}
                 className="w-full h-14 border-2 border-black flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-all duration-300 group"
               >
                 <span className="text-[12px] font-bold uppercase tracking-[0.2em]">view details</span>
                 <Play size={16} fill="currentColor" className="group-hover:scale-110 transition-transform" />
               </button>
            </motion.div>
           
           <motion.div variants={PANEL_ITEM_VARIANTS} className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30 text-black">
             <Link href="/home" className="underline hover:opacity-100 transition-opacity">go back to experiments</Link>
           </motion.div>
        </div>
      </motion.aside>

      {/* Right Side Content Panel */}
      <main className={`w-full md:w-[75%] h-screen flex flex-col bg-white relative overflow-y-auto custom-scrollbar ${activeMobileView === 'content' ? 'flex' : 'hidden md:flex'}`}>
        {/* Mobile Back Button */}
        {activeMobileView === 'content' && (
          <button 
            onClick={() => setActiveMobileView('info')}
            className="md:hidden fixed top-6 left-6 z-50 bg-black text-white w-10 h-10 flex items-center justify-center border border-black transition-all active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <div className="w-full max-w-[1200px] mx-auto px-8 md:px-16 py-16 md:py-24 space-y-24">
          {/* Section 1: Philosophy */}
          <section className="space-y-8">
            <div className="text-[10px] uppercase font-black tracking-[0.4em] text-black/40">Philosophy</div>
            <h2 className="text-[40px] md:text-[64px] font-newsreader leading-[0.9] tracking-tight">Design is an<br/>active experiment.</h2>
            <p className="text-lg md:text-xl text-black/60 font-ibm-plex-mono leading-relaxed max-w-2xl">
              I believe that the best products aren&apos;t just built; they are felt. My work focuses on creating interfaces that react, breathe, and challenge the user to interact in new ways. 
            </p>
          </section>

          {/* Section 2: Experience Grid Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="border border-black/10 p-8 space-y-4 hover:border-black/30 transition-colors bg-black/[0.02]">
              <div className="text-xs uppercase tracking-widest text-[#006655]">Current Focus</div>
              <h3 className="text-2xl font-newsreader">Agentic Interfaces</h3>
              <p className="text-sm opacity-60 leading-relaxed">
                Exploring how AI agents can interact with UI in real-time to create personalized, dynamic user flows.
              </p>
            </div>
            <div className="border border-black/10 p-8 space-y-4 hover:border-black/30 transition-colors bg-white/[0.02]">
              <div className="text-xs uppercase tracking-widest text-[#006655]">Expertise</div>
              <h3 className="text-2xl font-newsreader">Visual Design</h3>
              <p className="text-sm opacity-60 leading-relaxed">
                High-fidelity motion design, brutalist aesthetics, and technical grid layouts.
              </p>
            </div>
          </div>

          {/* Section 3: More content placeholder */}
          <section className="space-y-8 border-t border-black/10 pt-16">
            <div className="text-[10px] uppercase font-black tracking-[0.4em] text-black/40">Continuum</div>
            <p className="text-md opacity-40 italic">More archival content to be indexed here...</p>
          </section>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.15); }
      `}</style>
    </div>
  )
}
