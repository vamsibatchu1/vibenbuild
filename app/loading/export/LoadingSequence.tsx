'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Plus_Jakarta_Sans } from 'next/font/google';

// Inlined font definition to make the file self-contained
const jakartaFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-jakarta',
  display: 'swap',
});

export default function LoadingSequence() {
  const router = useRouter();
  const [currentSymbol, setCurrentSymbol] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showLandingImage, setShowLandingImage] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const [startTyping, setStartTyping] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);

  const fullText = "vamsi batchu. product designer/tinkerer/engineer who loves solving complex problems through a unique intersection of craft and code. ";

  const symbols = [
    '/images/refresh-images/symbol1.svg', 
    '/images/refresh-images/symbol2.svg', 
    '/images/refresh-images/symbol4.svg',
    '/images/refresh-images/symbol5.svg',
    '/images/refresh-images/symbol3.svg', 
    '/images/refresh-images/symbol6.svg',
    '/images/refresh-images/symbol7.svg'
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSymbol((prev) => {
        const nextSymbol = (prev + 1) % symbols.length;
        // After cycling through all symbols once, show landing image
        if (nextSymbol === 0 && prev === symbols.length - 1) {
          setTimeout(() => {
            setShowLandingImage(true);
            // Start typing animation after landing image appears
            setTimeout(() => {
              setStartTyping(true);
            }, 1000);
          }, 500); // Small delay after completing cycle
        }
        return nextSymbol;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [symbols.length]);

  // Blinking cursor effect - only start blinking when typing starts
  useEffect(() => {
    if (!startTyping) return;
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, [startTyping]);

  // Typing animation effect
  useEffect(() => {
    if (!startTyping) return;

    // Show cursor immediately when typing starts
    setShowCursor(true);

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTypingComplete(true);
      }
    }, 50); // Typing speed - adjust as needed

    return () => clearInterval(typingInterval);
  }, [startTyping, fullText]);

  // Handle Enter key press after typing is complete
  useEffect(() => {
    if (!typingComplete) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        // You can change this to your desired route
        router.push('/home');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [typingComplete, router]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
        duration: 0.6
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.8,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="h-screen bg-[#000000] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Landing Image - shown after symbol animation */}
      <AnimatePresence>
        {showLandingImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed left-1/2 -translate-x-1/2 w-full max-w-[800px] px-4 md:px-0"
            style={{ bottom: '-12px' }}
          >
            <div className="relative w-full max-w-[800px] px-4 md:px-0">
              <Image
                src="/images/port/landing.png"
                alt="Landing"
                width={800}
                height={600}
                className="w-full h-auto"
                priority
              />
              {/* Typing text overlay */}
              <div className="absolute inset-0 flex items-start justify-center pt-[24px] md:pt-[56px] px-4 md:px-0">
                <div className="w-full max-w-[calc(100%-40px)] md:w-[740px]">
                  <p className={`${jakartaFont.className} text-black text-[18px] md:text-[64px] leading-[120%] whitespace-pre-wrap break-words`} style={{ maxWidth: '100%' }}>
                    {typedText}
                    {showCursor && <span className="inline-block w-[16px] md:w-[40px] h-[21.6px] md:h-[76.8px] bg-black ml-2 align-top">|</span>}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - Symbol animation */}
      <AnimatePresence mode="wait">
        {!showLandingImage && (
          <motion.div 
            className="w-full max-w-[800px] flex flex-col gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* First column only - Symbol animation */}
            <motion.div 
              className="flex justify-center"
              variants={containerVariants}
            >
              <motion.div 
                className="w-[120px] md:w-[160px] h-[120px] md:h-[160px]" 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={isMobile ? { delay: 0, duration: 0.6, ease: "easeOut" } : undefined}
              >
                <div className="w-[120px] md:w-[160px] h-[120px] md:h-[160px] flex items-end">
                  <Image
                    src={symbols[currentSymbol]}
                    alt={`Symbol ${currentSymbol + 1}`}
                    width={160}
                    height={160}
                    className="w-[120px] md:w-[160px] h-[120px] md:h-[160px] object-contain transition-opacity duration-300"
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
