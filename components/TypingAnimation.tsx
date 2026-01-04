'use client'

import { useState, useEffect, useRef } from 'react'

interface TypingAnimationProps {
  text: string
  speed?: number
  onComplete?: () => void
}

export function TypingAnimation({ text, speed = 30, onComplete }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [isComplete, setIsComplete] = useState(false)
  const onCompleteRef = useRef(onComplete)

  // Update ref when onComplete changes
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (isComplete) return

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(interval)
        setIsComplete(true)
        if (onCompleteRef.current) {
          onCompleteRef.current()
        }
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, isComplete])

  // Blinking cursor animation
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)

    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <span className="inline">
      {displayedText}
      <span 
        className={`inline-block bg-white align-middle ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}
        style={{ width: '16px', height: '1em', marginLeft: '2px' }}
      />
    </span>
  )
}

