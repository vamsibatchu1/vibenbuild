'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TypingAnimation } from './TypingAnimation'

export function LandingPage() {
  const [showSubtext, setShowSubtext] = useState(false)
  const [showButton, setShowButton] = useState(false)

  const mainText = "One app per week. Every week. All year. A creative challenge exploring what's possible when you ship consistently with Google AI Studio. 52 weeks. 52 apps. 52 learning opportunities."

  const handleMainTextComplete = () => {
    setTimeout(() => {
      setShowSubtext(true)
      setTimeout(() => {
        setShowButton(true)
      }, 600)
    }, 800)
  }

  return (
    <main className="min-h-screen bg-[#FEF0E7] flex items-center justify-center p-4">
      <div className="max-w-[400px] w-full">
        {/* Main Typing Text */}
        <div className="mb-8">
          <div className="font-ibm-plex-mono text-base md:text-lg text-black text-left leading-relaxed">
            <TypingAnimation text={mainText} speed={30} onComplete={handleMainTextComplete} />
          </div>
        </div>

        {/* Subtext with dotted underline only on Vamsi batchu - space reserved from start */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showSubtext ? 1 : 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="font-ibm-plex-mono text-sm md:text-base text-black text-left leading-loose">
            A project by{' '}
            <span className="border-b-2 border-dotted border-black pb-1">Vamsi batchu</span>
            {' '}& powered by Gemini
          </div>
        </motion.div>

        {/* Button - space reserved from start */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showButton ? 1 : 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mt-8"
        >
          <button className="w-full max-w-[400px] h-11 border-2 border-black bg-transparent font-ibm-plex-mono text-base text-black hover:bg-black hover:text-[#FEF0E7] transition-colors">
            View experiments
          </button>
        </motion.div>
      </div>
    </main>
  )
}

