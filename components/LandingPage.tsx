'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { TypingAnimation } from './TypingAnimation'
import { EmailModal } from './EmailModal'

export function LandingPage() {
  const [showImage, setShowImage] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [showLink, setShowLink] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

  const mainText = "One app per week. Every week. All year. A creative challenge exploring what's possible when you ship consistently with Google AI Studio. 52 weeks. 52 apps. 52 learning opportunities."

  const handleMainTextComplete = () => {
    setTimeout(() => {
      setShowImage(true)
      setTimeout(() => {
        setShowButton(true)
        setTimeout(() => {
          setShowLink(true)
        }, 300) // Show link 300ms after buttons appear
      }, 800) // Show button 800ms after image starts fading in
    }, 800) // Show image 800ms after typing completes
  }

  return (
    <main className="h-screen bg-black flex items-center justify-center p-4 overflow-hidden fixed inset-0">
      <div className="max-w-[400px] w-full">
        {/* Main Typing Text */}
        <div className="mb-5 md:mb-9">
          <div className="font-ibm-plex-mono text-base md:text-lg text-white text-left leading-relaxed">
            <TypingAnimation text={mainText} speed={30} onComplete={handleMainTextComplete} />
          </div>
        </div>

        {/* SVG Logo - space reserved from start */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showImage ? 1 : 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-5 md:mb-9"
        >
          <Image
            src="/images/vibenbuild_landing2.svg"
            alt="Vibe and Build"
            width={400}
            height={189}
            className="w-full max-w-[400px]"
          />
        </motion.div>

        {/* Buttons Row - space reserved from start */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showButton ? 1 : 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-4 md:mb-5"
        >
          <div className="flex gap-3">
            <Link href="/experiments" className="flex-1">
              <button className="w-full h-11 border-2 border-white bg-white font-ibm-plex-mono text-base text-black hover:bg-transparent hover:text-white transition-colors">
                Enter
              </button>
            </Link>
            <button 
              onClick={() => setIsEmailModalOpen(true)}
              className="flex-1 h-11 border-2 border-white bg-transparent font-ibm-plex-mono text-base text-white hover:bg-white hover:text-black transition-colors"
            >
              Get notified
            </button>
          </div>
        </motion.div>

        {/* LinkedIn Link - below buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showLink ? 1 : 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Link 
            href="https://www.linkedin.com/in/vamsikbatchu/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-ibm-plex-mono text-sm text-white underline decoration-dotted underline-offset-2 hover:opacity-70 transition-opacity"
          >
            vamsi batchu
          </Link>
        </motion.div>
      </div>

      {/* Email Modal */}
      <EmailModal 
        isOpen={isEmailModalOpen} 
        onClose={() => setIsEmailModalOpen(false)} 
      />
    </main>
  )
}

