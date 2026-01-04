'use client'

import Image from 'next/image'

export function ProjectCredits() {
  return (
    <div className="w-full max-w-[800px] mx-auto mt-12 bg-black font-ibm-plex-mono">
      {/* Top Section */}
      <div className="flex justify-between items-start mb-8">
        {/* Top Left - Symbol + Copyright */}
        <div className="flex items-center gap-2">
          {/* Abstract symbol - four-pronged cross with dots */}
          <div className="relative w-6 h-6">
            <svg viewBox="0 0 24 24" className="w-full h-full text-white">
              {/* Center dot */}
              <circle cx="12" cy="12" r="2" fill="white" />
              {/* Four prongs */}
              <circle cx="12" cy="4" r="1.5" fill="white" />
              <circle cx="12" cy="20" r="1.5" fill="white" />
              <circle cx="4" cy="12" r="1.5" fill="white" />
              <circle cx="20" cy="12" r="1.5" fill="white" />
              {/* Connecting lines */}
              <line x1="12" y1="4" x2="12" y2="20" stroke="white" strokeWidth="0.5" />
              <line x1="4" y1="12" x2="20" y2="12" stroke="white" strokeWidth="0.5" />
            </svg>
          </div>
          <span className="text-xs text-white">©VIBE AND BUILD</span>
        </div>

        {/* Top Right - Box with text */}
        <div className="border border-white px-2 py-1">
          <span className="text-xs text-white">2 0 2 6</span>
        </div>
      </div>

      {/* Upper-Middle Section - Two Columns */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Left Column */}
        <div className="space-y-2">
          <div className="text-xs text-white uppercase tracking-wide">
            ALGORITHMICALLY GENERATED
          </div>
          <div className="text-xs text-white uppercase tracking-wide">
            WE ARE
          </div>
          <div className="text-xs text-white uppercase tracking-wide">
            DIMENSIONS:
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          <div className="text-xs text-white uppercase tracking-wide">
            ARCHITECTS OF THE UNSEEN
          </div>
          <div className="text-xs text-white">
            52 WEEKS × 52 APPS × 52 LEARNING OPPORTUNITIES
          </div>
        </div>
      </div>

      {/* Lower-Middle Section */}
      <div className="flex items-start gap-6">
        {/* Dashed Box */}
        <div className="border-dashed border-t border-b border-l border-white p-3 flex-shrink-0">
          <div className="text-xs text-white">
            For Google AI Studio
          </div>
        </div>

        {/* Right side - Logo and List */}
        <div className="flex-1">
          {/* Logo placeholder - using retro-landing.png */}
          <div className="mb-4">
            <Image
              src="/images/retro-landing.png"
              alt="Vibe and Build"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>

          {/* List */}
          <div className="space-y-1">
            <div className="text-xs text-white">GEMINI</div>
            <div className="text-xs text-white">GOOGLE AI STUDIO</div>
            <div className="text-xs text-white">NEXT.JS</div>
            <div className="text-xs text-white">FRAMER MOTION</div>
          </div>
        </div>
      </div>
    </div>
  )
}

