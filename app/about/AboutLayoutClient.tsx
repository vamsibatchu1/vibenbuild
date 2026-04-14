'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, ArrowLeft } from 'lucide-react'
import HomeContent from './HomeContent'

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
           
           <motion.div 
             variants={PANEL_ITEM_VARIANTS}
             className="text-[10px] uppercase font-bold tracking-[0.2em] text-black leading-relaxed"
           >
             an <Link href="/home" className="underline decoration-black underline-offset-4 hover:opacity-70 transition-opacity">experimental universe</Link> by vamsi batchu. follow me on <Link href="https://x.com/vamsibatchuk" target="_blank" className="underline decoration-black underline-offset-4 hover:opacity-70 transition-opacity">X</Link>
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

        <div className="w-full mx-auto px-8 md:px-16 py-16 md:py-24">
          <HomeContent />
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
