'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
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
        <div className="mb-4">
          <div className="font-ibm-plex-mono text-base md:text-lg text-black text-left leading-relaxed">
            <TypingAnimation text={mainText} speed={30} onComplete={handleMainTextComplete} />
          </div>
        </div>

        {/* Subtext with image and text in two columns with borders - space reserved from start */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showSubtext ? 1 : 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-4"
        >
          <div className="flex items-center border-2 border-black">
            {/* Image Column */}
            <div className="flex-shrink-0 border-r-2 border-black p-2 flex items-center justify-center bg-[#FEF0E7]">
              <Image
                src="/images/retro2.png"
                alt="Retro landing"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            
            {/* Text Column */}
            <div className="flex-1 p-2 font-ibm-plex-mono text-sm md:text-base text-black text-left">
              A project by Vamsi Batchu & powered by Gemini
            </div>
          </div>
        </motion.div>

        {/* Button - space reserved from start */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showButton ? 1 : 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mt-4"
        >
          <Link href="/experiments">
            <button className="w-full max-w-[400px] h-11 border-2 border-black bg-black font-ibm-plex-mono text-base text-[#FEF0E7] hover:bg-transparent hover:text-black transition-colors">
              View experiments
            </button>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

