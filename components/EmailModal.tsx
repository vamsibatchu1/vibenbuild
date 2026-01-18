'use client'

import { useState, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EmailModal({ isOpen, onClose }: EmailModalProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setErrorMessage('Please enter your email address')
      setStatus('error')
      return
    }

    setIsLoading(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      const normalizedEmail = email.toLowerCase().trim()

      // Check if email already exists
      const emailsRef = collection(db, 'subscribers')
      const q = query(emailsRef, where('email', '==', normalizedEmail))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        setErrorMessage('This email is already subscribed')
        setStatus('error')
        setIsLoading(false)
        return
      }

      // Add email to Firestore
      await addDoc(emailsRef, {
        email: normalizedEmail,
        subscribedAt: serverTimestamp(),
      })

      setStatus('success')
      setEmail('')
      // Auto-close after 2 seconds on success
      setTimeout(() => {
        onClose()
        setStatus('idle')
      }, 2000)
    } catch (error: any) {
      console.error('Error adding subscriber:', error)
      
      // Provide more specific error messages
      let errorMsg = 'Failed to subscribe. Please try again.'
      
      if (error?.code === 'permission-denied') {
        errorMsg = 'Permission denied. Please check Firestore security rules.'
      } else if (error?.code === 'unavailable') {
        errorMsg = 'Firestore is unavailable. Please check your internet connection.'
      } else if (error?.message) {
        errorMsg = `Error: ${error.message}`
      }
      
      setErrorMessage(errorMsg)
      setStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setEmail('')
      setStatus('idle')
      setErrorMessage('')
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/90 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-black border-2 border-white max-w-[400px] w-full p-6 relative">
              {status === 'success' ? (
                <div className="text-center">
                  <div className="mb-4">
                    <svg
                      className="mx-auto h-12 w-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="font-ibm-plex-mono text-xl text-white mb-2">
                    You&apos;re subscribed!
                  </h2>
                  <p className="font-ibm-plex-mono text-sm text-white/80">
                    We&apos;ll notify you about new projects and updates.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-ibm-plex-mono text-xl text-white">
                      Get notified
                    </h2>
                    <button
                      onClick={handleClose}
                      disabled={isLoading}
                      className="text-white hover:opacity-70 transition-opacity disabled:opacity-50"
                      aria-label="Close modal"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="font-ibm-plex-mono text-sm text-white/80 mb-6">
                    Enter your email to get updates about new projects.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        disabled={isLoading}
                        className="w-full h-11 px-4 border-2 border-white bg-black text-white font-ibm-plex-mono text-base placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
                        required
                      />
                      {status === 'error' && errorMessage && (
                        <p className="mt-2 font-ibm-plex-mono text-sm text-red-400">
                          {errorMessage}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-11 border-2 border-white bg-white font-ibm-plex-mono text-base text-black hover:bg-transparent hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

