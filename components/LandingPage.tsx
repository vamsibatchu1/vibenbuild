'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { TypingAnimation } from './TypingAnimation'

export function LandingPage() {
  const [showImage, setShowImage] = useState(false)
  const [showButton, setShowButton] = useState(false)

  const mainText = "One app per week. Every week. All year. A creative challenge exploring what's possible when you ship consistently with Google AI Studio. 52 weeks. 52 apps. 52 learning opportunities."

  const handleMainTextComplete = () => {
    setTimeout(() => {
      setShowImage(true)
      setTimeout(() => {
        setShowButton(true)
      }, 800) // Show button 800ms after image starts fading in
    }, 800) // Show image 800ms after typing completes
  }

  return (
    <main className="h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-[400px] w-full">
        {/* Main Typing Text */}
        <div className="mb-9">
          <div className="font-ibm-plex-mono text-base md:text-lg text-white text-left leading-relaxed">
            <TypingAnimation text={mainText} speed={30} onComplete={handleMainTextComplete} />
          </div>
        </div>

        {/* SVG Logo - space reserved from start */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showImage ? 1 : 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-9"
        >
          <Image
            src="/images/vibenbuild_landing2.svg"
            alt="Vibe and Build"
            width={400}
            height={189}
            className="w-full max-w-[400px]"
          />
        </motion.div>

        {/* Button - space reserved from start */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showButton ? 1 : 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Link href="/experiments">
            <button className="w-full max-w-[400px] h-11 border-2 border-white bg-white font-ibm-plex-mono text-base text-black hover:bg-transparent hover:text-white transition-colors">
              View experiments
            </button>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

