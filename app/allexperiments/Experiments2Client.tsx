'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, FormEvent } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Mail, ExternalLink, Menu, X, Globe, Play } from 'lucide-react'
import Link from 'next/link'
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import experimentsData from './experiments.json'
import wipIdeasData from './wip-ideas.json'

interface Experiment {
  id: string
  title: string
  tags: string[]
  tokens: number
  link: string
  text: string
  images: number[]
  video?: string
}

// Load experiments from JSON file
const experiments: Experiment[] = experimentsData as Experiment[]
const filteredExperiments = experiments.filter((experiment) => experiment.id !== 'exp-10')

export function Experiments2Client() {
  const [isMobile, setIsMobile] = useState(false)
  const [currentColumnIndex, setCurrentColumnIndex] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null)

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
    const totalColumns = filteredExperiments.length + 2 // +1 for welcome column, +1 for exit column
    setCurrentColumnIndex((prev) => (prev < totalColumns - 1 ? prev + 1 : prev))
  }

  const handlePrevious = () => {
    setCurrentColumnIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const allColumns = [
    { type: 'welcome' as const },
    ...filteredExperiments.map((exp, idx) => ({ type: 'experiment' as const, experiment: exp, index: idx + 1 })),
    { type: 'exit' as const }
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
          {/* Navigation Row - Sticky */}
          <div 
            className="flex justify-between items-center"
            style={{
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
            {/* Menu Icon - Left */}
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
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
              <Menu size={24} className="text-black" />
            </button>

            {/* Navigation Arrows - Right */}
            <div className="flex gap-2">
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
          </div>

          {/* Menu Modal */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 20
                  }}
                />
                {/* Modal */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  style={{
                    position: 'fixed',
                    top: '80px',
                    left: '16px',
                    right: '16px',
                    backgroundColor: '#ffffff',
                    border: '1px dashed #000000',
                    zIndex: 21,
                    padding: '20px'
                  }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-xs font-ibm-plex-mono uppercase text-black">Navigation</div>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      aria-label="Close menu"
                      style={{
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px dashed #000000',
                        backgroundColor: '#ffffff',
                        padding: 0
                      }}
                    >
                      <X size={20} className="text-black" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <Link
                      href="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-left px-4 py-3 border border-black/30 hover:bg-black/5 transition-colors font-ibm-plex-mono text-sm uppercase text-black"
                    >
                      Home
                    </Link>
                    <Link
                      href="/allexperiments"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-left px-4 py-3 border border-black/30 hover:bg-black/5 transition-colors font-ibm-plex-mono text-sm uppercase text-black"
                    >
                      Experiments
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        // Navigate to exit column (last column)
                        setCurrentColumnIndex(allColumns.length - 1)
                        // Small delay to ensure column is rendered, then switch to About Me tab
                        setTimeout(() => {
                          const exitColumn = document.querySelector('[data-exit-column]')
                          if (exitColumn) {
                            const aboutMeButton = exitColumn.querySelector('[data-about-me-tab]') as HTMLButtonElement
                            if (aboutMeButton) {
                              aboutMeButton.click()
                            }
                          }
                        }, 100)
                      }}
                      className="block w-full text-left px-4 py-3 border border-black/30 hover:bg-black/5 transition-colors font-ibm-plex-mono text-sm uppercase text-black"
                    >
                      About Me
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

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
                    onVideoClick={(url) => setVideoModalUrl(url)}
                  />
                </motion.div>
              ) : allColumns[currentColumnIndex]?.type === 'exit' ? (
                <motion.div
                  key="exit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%' }}
                >
                  <div data-exit-column>
                    <ExitColumn mobile={true} />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </main>

        {/* Video Modal */}
        <AnimatePresence>
          {videoModalUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setVideoModalUrl(null)}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
              style={{ padding: '20px' }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative"
                style={{ width: '70%' }}
              >
                <button
                  onClick={() => setVideoModalUrl(null)}
                  className="absolute -top-10 right-0 text-white hover:text-white/80 transition-colors"
                  style={{ zIndex: 10 }}
                >
                  <X size={24} />
                </button>
                <video
                  src={videoModalUrl}
                  controls
                  autoPlay
                  className="w-full h-auto"
                  style={{ maxHeight: '90vh' }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Desktop view (unchanged)
  return (
    <>
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
                  onVideoClick={(url) => setVideoModalUrl(url)}
                />
              ))}
              
              {/* Exit Column */}
              <ExitColumn />
            </div>
          </div>
        </div>
      </main>

      {/* Video Modal */}
      <AnimatePresence>
        {videoModalUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVideoModalUrl(null)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            style={{ padding: '20px' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
              style={{ width: '70%' }}
            >
              <button
                onClick={() => setVideoModalUrl(null)}
                className="absolute -top-10 right-0 text-white hover:text-white/80 transition-colors"
                style={{ zIndex: 10 }}
              >
                <X size={24} />
              </button>
              <video
                src={videoModalUrl}
                controls
                autoPlay
                className="w-full h-auto"
                style={{ maxHeight: '90vh' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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

// Animated Pixel Art Component (similar to ListView)
function AnimatedPixelArt() {
  const rows = 13
  const cols = 40
  const [pixels, setPixels] = useState<boolean[][]>([])

  useEffect(() => {
    const createPattern = (seed: number) => {
      return Array(rows).fill(null).map((_, i) =>
        Array(cols).fill(null).map((_, j) => {
          const distanceFromTopLeft = Math.sqrt(i * i + j * j)
          const maxDistance = Math.sqrt(rows * rows + cols * cols)
          const normalizedDistance = distanceFromTopLeft / maxDistance
          
          const irregularEdge = 0.15 + (Math.sin(i * 0.8) * Math.cos(j * 0.6) * 0.08) + (Math.random() * 0.1)
          const shouldHide = normalizedDistance < irregularEdge
          
          if (shouldHide) {
            return false
          }
          
          const wave1 = Math.sin((i + seed) * 0.5) * Math.cos((j + seed) * 0.3)
          const wave2 = Math.cos((i + seed) * 0.4) * Math.sin((j + seed) * 0.5)
          const combined = (wave1 + wave2) / 2
          
          const positionHash = ((i * 17 + j * 23 + seed * 7) % 100) / 100
          const value = (combined * 0.5) + (positionHash * 0.5)
          const threshold = 0.4
          
          return value > threshold
        })
      )
    }

    setPixels(createPattern(0))
    let seed = 0
    const interval = setInterval(() => {
      seed += 0.5 + Math.random() * 0.3
      setPixels(createPattern(seed))
    }, 80)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-end">
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {pixels.map((row, i) =>
          row.map((isBlack, j) => (
            <motion.div
              key={`${i}-${j}`}
              className="w-1.5 h-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: isBlack ? 1 : 0 }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
            >
              {isBlack && (
                <div className="w-full h-full bg-black rounded-sm" />
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

interface ExitColumnProps {
  mobile?: boolean
}

function ExitColumn({ mobile = false }: ExitColumnProps) {
  const [idea, setIdea] = useState('')
  const [email, setEmail] = useState('')
  const [ideaStatus, setIdeaStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [ideaError, setIdeaError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [activeTab, setActiveTab] = useState<'keep-reading' | 'about-me'>('keep-reading')

  // Work in progress projects - loaded from JSON file
  const workInProgress: string[] = wipIdeasData as string[]

  const handleIdeaSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!idea.trim()) {
      setIdeaError('Please enter your idea')
      setIdeaStatus('error')
      return
    }

    setIdeaStatus('loading')
    setIdeaError('')

    try {
      // Save idea to Firestore 'ideas' collection
      await addDoc(collection(db, 'ideas'), {
        idea: idea.trim(),
        submittedAt: serverTimestamp()
      })
      setIdeaStatus('success')
      setIdea('')
      setTimeout(() => setIdeaStatus('idle'), 3000)
    } catch (error: any) {
      console.error('Error submitting idea:', error)
      console.error('Error code:', error?.code)
      console.error('Error message:', error?.message)
      
      // Provide more specific error messages
      let errorMsg = 'Failed to submit idea. Please try again.'
      
      if (error?.code === 'permission-denied') {
        errorMsg = 'Permission denied. Please check Firestore security rules.'
      } else if (error?.code === 'unavailable') {
        errorMsg = 'Firestore is unavailable. Please check your internet connection.'
      } else if (error?.code === 'failed-precondition') {
        errorMsg = 'Firestore is not available. Please check your Firebase configuration.'
      } else if (error?.message) {
        errorMsg = `Error: ${error.message}`
      }
      
      setIdeaError(errorMsg)
      setIdeaStatus('error')
      // Reset loading state after showing error
      setTimeout(() => setIdeaStatus('idle'), 5000)
    }
  }

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setEmailError('Please enter your email address')
      setEmailStatus('error')
      return
    }

    setEmailStatus('loading')
    setEmailError('')

    try {
      const normalizedEmail = email.toLowerCase().trim()
      const emailsRef = collection(db, 'subscribers')
      const q = query(emailsRef, where('email', '==', normalizedEmail))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        setEmailError('This email is already subscribed')
        setEmailStatus('error')
        setTimeout(() => setEmailStatus('idle'), 5000)
        return
      }

      // Add email to Firestore (same collection as home page)
      await addDoc(emailsRef, {
        email: normalizedEmail,
        subscribedAt: serverTimestamp()
      })

      setEmailStatus('success')
      setEmail('')
      setTimeout(() => setEmailStatus('idle'), 3000)
    } catch (error: any) {
      console.error('Error adding subscriber:', error)
      console.error('Error code:', error?.code)
      console.error('Error message:', error?.message)
      
      // Provide more specific error messages (matching EmailModal)
      let errorMsg = 'Failed to subscribe. Please try again.'
      
      if (error?.code === 'permission-denied') {
        errorMsg = 'Permission denied. Please check Firestore security rules.'
      } else if (error?.code === 'unavailable') {
        errorMsg = 'Firestore is unavailable. Please check your internet connection.'
      } else if (error?.code === 'failed-precondition') {
        errorMsg = 'Firestore is not available. Please check your Firebase configuration.'
      } else if (error?.message) {
        errorMsg = `Error: ${error.message}`
      }
      
      setEmailError(errorMsg)
      setEmailStatus('error')
      // Reset loading state after showing error
      setTimeout(() => setEmailStatus('idle'), 5000)
    }
  }

  if (mobile) {
    return (
      <div className="bg-white flex flex-col" style={{ width: '100%', minHeight: '100%' }}>
        {/* Thank You Section */}
        <div className="mb-8">
          <div className="mb-6">
            <div className="text-xs text-black/70 leading-relaxed mb-4 uppercase font-ibm-plex-mono">
              Thank you for exploring my digital experiment gallery. This journey of 52 weeks, 52 apps continues to evolve.
            </div>
            <div className="flex-shrink-0">
              <AnimatedPixelArt />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b-2 border-black">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('keep-reading')}
              className={`px-4 py-2 text-xs font-ibm-plex-mono uppercase transition-colors ${
                activeTab === 'keep-reading'
                  ? 'bg-black text-white'
                  : 'bg-transparent text-black hover:bg-black/5'
              }`}
            >
              Keep Reading
            </button>
            <button
              onClick={() => setActiveTab('about-me')}
              data-about-me-tab
              className={`px-4 py-2 text-xs font-ibm-plex-mono uppercase transition-colors ${
                activeTab === 'about-me'
                  ? 'bg-black text-white'
                  : 'bg-transparent text-black hover:bg-black/5'
              }`}
            >
              About Me
            </button>
          </div>
        </div>

        {/* Keep Reading Tab */}
        {activeTab === 'keep-reading' && (
          <>
            {/* Work in Progress */}
            <div className="mb-8">
              <div className="text-xs text-black/70 leading-relaxed mb-4 uppercase font-ibm-plex-mono">
                Ideas that are work in progress
              </div>
              <div className="space-y-4">
                {workInProgress.map((text, idx) => (
                  <div key={idx} className="border-b border-black/20 pb-4 text-sm text-black/60 font-gilda-display" style={{ marginBottom: idx < workInProgress.length - 1 ? '20px' : '0' }}>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit an Idea */}
            <div className="mb-8">
              <form onSubmit={handleIdeaSubmit}>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Share your idea for a future experiment..."
                  className="w-full p-3 border border-black/30 rounded-sm font-ibm-plex-mono text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  style={{ minHeight: '100px', resize: 'vertical' }}
                />
                <button
                  type="submit"
                  disabled={ideaStatus === 'loading'}
                  className="w-full h-10 font-ibm-plex-mono text-sm uppercase transition-colors disabled:opacity-50"
                  style={{
                    border: '1px dashed #000000',
                    backgroundColor: '#ffffff',
                    color: '#000000'
                  }}
                >
                  {ideaStatus === 'loading' ? 'Submitting...' : ideaStatus === 'success' ? 'Submitted!' : 'Submit Idea'}
                </button>
                {ideaError && <div className="text-xs text-red-600 mt-2 font-ibm-plex-mono">{ideaError}</div>}
              </form>
            </div>

            {/* Email Notification */}
            <div className="mb-8">
              <div className="text-xs text-black/70 leading-relaxed mb-4 uppercase font-ibm-plex-mono">
                Get notified when new projects are released. Enter your email below to stay updated.
              </div>
              <form onSubmit={handleEmailSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full p-3 border border-black/30 rounded-sm font-ibm-plex-mono text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
                <button
                  type="submit"
                  disabled={emailStatus === 'loading'}
                  className="w-full h-10 font-ibm-plex-mono text-sm uppercase transition-colors disabled:opacity-50"
                  style={{
                    border: '1px dashed #000000',
                    backgroundColor: '#ffffff',
                    color: '#000000'
                  }}
                >
                  {emailStatus === 'loading' ? 'Subscribing...' : emailStatus === 'success' ? 'Subscribed!' : 'Subscribe'}
                </button>
                {emailError && <div className="text-xs text-red-600 mt-2 font-ibm-plex-mono">{emailError}</div>}
              </form>
            </div>

            {/* Contact Links */}
            <div>
              <div className="text-xs text-black/70 leading-relaxed mb-4 uppercase font-ibm-plex-mono">
                Connect with me on social media or reach out via email.
              </div>
              <div className="space-y-3">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-black/70 hover:text-black transition-colors font-ibm-plex-mono text-sm uppercase">
                  <ExternalLink size={16} />
                  Twitter
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-black/70 hover:text-black transition-colors font-ibm-plex-mono text-sm uppercase">
                  <ExternalLink size={16} />
                  LinkedIn
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-black/70 hover:text-black transition-colors font-ibm-plex-mono text-sm uppercase">
                  <ExternalLink size={16} />
                  GitHub
                </a>
                <a href="mailto:contact@example.com" className="flex items-center gap-2 text-black/70 hover:text-black transition-colors font-ibm-plex-mono text-sm uppercase">
                  <Mail size={16} />
                  Email
                </a>
              </div>
            </div>
          </>
        )}

        {/* About Me Tab */}
        {activeTab === 'about-me' && (
          <div className="space-y-6">
            {/* Profile Image with Glitch Effect */}
            <div className="glitch-image-container">
              <Image
                src="/images/vamsi.webp"
                alt="Vamsi"
                width={200}
                height={200}
                className="glitch-image rounded-sm"
                style={{ objectFit: 'cover' }}
              />
            </div>
            
            <div className="text-sm text-black/60 font-gilda-display">
              <p className="mb-4">
                Originally from India, I am a designer currently living in Atlanta with my wife and dog. I like to call myself a <strong>product builder</strong> and a <strong>software tinkerer</strong>. With a background in computer science, I found my calling in it&apos;s intersection with art and curiosity.
              </p>
              <p className="mb-4">
                With a proven track record leading cross-functional initiatives to shape product strategy, I specialize in defining the vision for <strong>zero-to-one</strong>, <strong>AI-native</strong> products and evolving <strong>data-informed design systems</strong>. I thrive on collaborating with product and business partners to drive innovation and deliver measurable impact.
              </p>
              <p>
                Beyond designing products, I&apos;m actively advancing AI fluency at Rocket through multiple initiatives and serving on the <strong>AI Leadership Council</strong> to shape tool strategy, training programs, and adoption.
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 + 0.5 * (filteredExperiments.length + 1), ease: 'easeOut' }}
      className="flex-shrink-0 bg-white h-full flex flex-col experiment-column-scroll"
      style={{ 
        width: '360px',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      {/* Thank You Section */}
      <div className="mb-8">
        <div className="mb-6">
          <div className="text-xs text-black/70 leading-relaxed mb-4 uppercase font-ibm-plex-mono">
            Thank you for exploring my digital experiment gallery. This journey of 52 weeks, 52 apps continues to evolve.
          </div>
          <div className="flex-shrink-0">
            <AnimatedPixelArt />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b-2 border-black">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('keep-reading')}
            className={`px-4 py-2 text-xs font-ibm-plex-mono uppercase transition-colors ${
              activeTab === 'keep-reading'
                ? 'bg-black text-white'
                : 'bg-transparent text-black hover:bg-black/5'
            }`}
          >
            Keep Reading
          </button>
          <button
            onClick={() => setActiveTab('about-me')}
            className={`px-4 py-2 text-xs font-ibm-plex-mono uppercase transition-colors ${
              activeTab === 'about-me'
                ? 'bg-black text-white'
                : 'bg-transparent text-black hover:bg-black/5'
            }`}
          >
            About Me
          </button>
        </div>
      </div>

      {/* Keep Reading Tab */}
      {activeTab === 'keep-reading' && (
        <>
          {/* Work in Progress */}
          <div className="mb-8">
            <div className="text-xs text-black/70 leading-relaxed mb-4 uppercase font-ibm-plex-mono">
              Ideas that are work in progress
            </div>
            <div className="space-y-4">
              {workInProgress.map((text, idx) => (
                <div key={idx} className="border-b border-black/20 pb-4 text-sm text-black/60 font-gilda-display" style={{ marginBottom: idx < workInProgress.length - 1 ? '20px' : '0' }}>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Submit an Idea */}
          <div className="mb-8">
            <form onSubmit={handleIdeaSubmit}>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Share your idea for a future experiment..."
                className="w-full p-3 border border-black/30 rounded-sm font-ibm-plex-mono text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                style={{ minHeight: '100px', resize: 'vertical' }}
              />
              <button
                type="submit"
                disabled={ideaStatus === 'loading'}
                className="w-full h-10 font-ibm-plex-mono text-sm uppercase transition-colors disabled:opacity-50"
                style={{
                  border: '1px dashed #000000',
                  backgroundColor: '#ffffff',
                  color: '#000000'
                }}
              >
                {ideaStatus === 'loading' ? 'Submitting...' : ideaStatus === 'success' ? 'Submitted!' : 'Submit Idea'}
              </button>
              {ideaError && <div className="text-xs text-red-600 mt-2 font-ibm-plex-mono">{ideaError}</div>}
            </form>
          </div>

          {/* Email Notification */}
          <div className="mb-8">
            <div className="text-xs text-black/70 leading-relaxed mb-4 uppercase font-ibm-plex-mono">
              Get notified when new projects are released. Enter your email below to stay updated.
            </div>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border border-black/30 rounded-sm font-ibm-plex-mono text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
              <button
                type="submit"
                disabled={emailStatus === 'loading'}
                className="w-full h-10 font-ibm-plex-mono text-sm uppercase transition-colors disabled:opacity-50"
                style={{
                  border: '1px dashed #000000',
                  backgroundColor: '#ffffff',
                  color: '#000000'
                }}
              >
                {emailStatus === 'loading' ? 'Subscribing...' : emailStatus === 'success' ? 'Subscribed!' : 'Subscribe'}
              </button>
              {emailError && <div className="text-xs text-red-600 mt-2 font-ibm-plex-mono">{emailError}</div>}
            </form>
          </div>

          {/* Contact Links */}
          <div>
            <div className="text-xs text-black/70 leading-relaxed mb-4 uppercase font-ibm-plex-mono">
              Connect with me on social media or reach out via email.
            </div>
            <div className="space-y-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-black/70 hover:text-black transition-colors font-ibm-plex-mono text-sm uppercase">
                <ExternalLink size={16} />
                Twitter
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-black/70 hover:text-black transition-colors font-ibm-plex-mono text-sm uppercase">
                <ExternalLink size={16} />
                LinkedIn
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-black/70 hover:text-black transition-colors font-ibm-plex-mono text-sm uppercase">
                <ExternalLink size={16} />
                GitHub
              </a>
              <a href="mailto:contact@example.com" className="flex items-center gap-2 text-black/70 hover:text-black transition-colors font-ibm-plex-mono text-sm uppercase">
                <Mail size={16} />
                Email
              </a>
            </div>
          </div>
        </>
      )}

      {/* About Me Tab */}
      {activeTab === 'about-me' && (
        <div className="space-y-6">
          {/* Profile Image with Glitch Effect */}
          <div className="glitch-image-container">
            <Image
              src="/images/vamsi.webp"
              alt="Vamsi"
              width={200}
              height={200}
              className="glitch-image rounded-sm"
              style={{ objectFit: 'cover' }}
            />
          </div>
          
          <div className="text-sm text-black/80 leading-relaxed font-gilda-display">
            <p className="mb-4">
              Originally from India, I am a designer currently living in Atlanta with my wife and dog. I like to call myself a <strong>product builder</strong> and a <strong>software tinkerer</strong>. With a background in computer science, I found my calling in it&apos;s intersection with art and curiosity.
            </p>
            <p className="mb-4">
              With a proven track record leading cross-functional initiatives to shape product strategy, I specialize in defining the vision for <strong>zero-to-one</strong>, <strong>AI-native</strong> products and evolving <strong>data-informed design systems</strong>. I thrive on collaborating with product and business partners to drive innovation and deliver measurable impact.
            </p>
            <p>
              Beyond designing products, I&apos;m actively advancing AI fluency at Rocket through multiple initiatives and serving on the <strong>AI Leadership Council</strong> to shape tool strategy, training programs, and adoption.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

interface ExperimentColumnProps {
  experiment: Experiment
  index: number
  mobile?: boolean
  onVideoClick?: (videoUrl: string) => void
}

function ExperimentColumn({ experiment, index, mobile = false, onVideoClick }: ExperimentColumnProps) {
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
                    <div className="text-xs text-black/60 uppercase font-ibm-plex-mono" style={{ marginBottom: '12px' }}>
                      Tokens: {experiment.tokens.toLocaleString()}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <a
                        href={experiment.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 h-10 font-ibm-plex-mono text-sm uppercase transition-colors flex items-center justify-center gap-1.5"
                        style={{
                          border: '1px dashed #000000',
                          backgroundColor: '#ffffff',
                          color: '#000000'
                        }}
                      >
                        <Globe size={14} />
                        View Experiment
                      </a>
                      <button
                        onClick={() => {
                          if (experiment.video && onVideoClick) {
                            onVideoClick(`/videos/experiments2/${experiment.video}`)
                          }
                        }}
                        disabled={!experiment.video}
                        className="flex-1 h-10 font-ibm-plex-mono text-sm uppercase transition-colors flex items-center justify-center gap-1.5"
                        style={{
                          border: '1px dashed #000000',
                          backgroundColor: '#ffffff',
                          color: experiment.video ? '#000000' : '#00000040',
                          cursor: experiment.video ? 'pointer' : 'not-allowed',
                          opacity: experiment.video ? 1 : 0.5
                        }}
                      >
                        <Play size={14} />
                        Watch Video
                      </button>
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
                  <div className="text-xs text-black/60 uppercase font-ibm-plex-mono" style={{ marginBottom: '12px' }}>
                    Tokens: {experiment.tokens.toLocaleString()}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <a
                      href={experiment.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-10 font-ibm-plex-mono text-sm uppercase transition-colors flex items-center justify-center gap-1.5"
                      style={{
                        border: '1px dashed #000000',
                        backgroundColor: '#ffffff',
                        color: '#000000'
                      }}
                    >
                      <Globe size={14} />
                      View Experiment
                    </a>
                    <button
                      onClick={() => {
                        if (experiment.video && onVideoClick) {
                          onVideoClick(`/videos/experiments2/${experiment.video}`)
                        }
                      }}
                      disabled={!experiment.video}
                      className="flex-1 h-10 font-ibm-plex-mono text-sm uppercase transition-colors flex items-center justify-center gap-1.5"
                      style={{
                        border: '1px dashed #000000',
                        backgroundColor: '#ffffff',
                        color: experiment.video ? '#000000' : '#00000040',
                        cursor: experiment.video ? 'pointer' : 'not-allowed',
                        opacity: experiment.video ? 1 : 0.5
                      }}
                    >
                      <Play size={14} />
                      Watch Video
                    </button>
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
