import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, 
  SkipBack, 
  Pause, 
  Play,
  SkipForward, 
  RotateCcw, 
  VolumeX, 
  Volume2,
  Maximize, 
  Minimize,
  ExternalLink, 
  Layers, 
  Grid, 
  ChevronUp, 
  ChevronDown, 
  Share2 
} from 'lucide-react';

interface RemoteControlProps {
  title?: string;
  details?: string;
  onNext?: () => void;
  onPrev?: () => void;
  channelNumber?: number;
  totalChannels?: number;
  activeView?: 'layers' | 'grid';
  onViewChange?: (view: 'layers' | 'grid') => void;
  isPlaying?: boolean;
  onPlayChange?: (playing: boolean) => void;
}

export default function RemoteControl({ 
  title = "No Experiment", 
  details = "", 
  onNext, 
  onPrev, 
  channelNumber = 1,
  totalChannels = 1,
  activeView = 'layers',
  onViewChange,
  isPlaying = false,
  onPlayChange
}: RemoteControlProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [hidePrompt, setHidePrompt] = useState(false);

  const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

  return (
    <div className="flex items-center select-none mx-auto w-full justify-center">
      {/* Main Remote Pill */}
      <motion.div 
        layout 
        transition={springConfig}
        className={`bg-[#1c1c1c] rounded-[56px] p-5 flex items-center border border-white/5 shadow-2xl overflow-hidden ${hidePrompt ? 'w-auto' : 'flex-1'}`}
      >
        
        {/* Left Section: Playback Controls */}
        <motion.div layout transition={springConfig} className="flex items-center gap-5 shrink-0 mr-6">
          {/* Large Monitor Button */}
          <button className="w-20 h-20 md:w-[100px] md:h-[100px] rounded-full bg-[#333333] flex items-center justify-center hover:bg-[#3d3d3d] transition-colors group">
            <Monitor className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={1.5} />
          </button>

          {/* Control Grid */}
          <div className="grid grid-cols-3 gap-2">
            <ControlButton icon={<SkipBack size={18} fill="currentColor" />} onClick={onPrev} />
            <ControlButton 
              icon={isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />} 
              isActive={isPlaying}
              onClick={() => onPlayChange?.(!isPlaying)}
            />
            <ControlButton icon={<SkipForward size={18} fill="currentColor" />} onClick={onNext} />
            <ControlButton icon={<RotateCcw size={18} strokeWidth={2.5} />} />
            <ControlButton 
              icon={isMuted ? <VolumeX size={18} strokeWidth={2.5} /> : <Volume2 size={18} strokeWidth={2.5} />} 
              isActive={isMuted}
              onClick={() => setIsMuted(!isMuted)}
            />
            <ControlButton 
              icon={isFullScreen ? <Minimize size={18} strokeWidth={2.5} /> : <Maximize size={18} strokeWidth={2.5} />} 
              isActive={isFullScreen}
              onClick={() => setIsFullScreen(!isFullScreen)}
            />
          </div>

          {/* Toggle Section */}
          <div className="flex flex-col items-center gap-2 px-2">
            <span className="text-white text-[13px] font-medium tracking-tight whitespace-nowrap">Hide Prompt</span>
            <div 
              onClick={() => setHidePrompt(!hidePrompt)}
              className={`w-[52px] h-[28px] rounded-full relative cursor-pointer shadow-inner transition-colors duration-300 ${hidePrompt ? 'bg-white' : 'bg-[#333333]'}`}
            >
              <motion.div 
                layout
                transition={springConfig}
                className={`w-5 h-5 rounded-full absolute top-1 shadow-sm transition-colors duration-300 ${hidePrompt ? 'right-1 bg-[#1c1c1c]' : 'left-1 bg-white/40'}`} 
              />
            </div>
          </div>
        </motion.div>

        {/* Middle Section (Prompt & Divider) */}
        <AnimatePresence mode="wait">
          {!hidePrompt && (
            <motion.div 
              key="middle"
              initial={{ width: 0, flex: 0, opacity: 0, paddingRight: 0 }}
              animate={{ width: 'auto', flex: 1, opacity: 1, paddingRight: 24 }}
              exit={{ width: 0, flex: 0, opacity: 0, paddingRight: 0 }}
              transition={springConfig}
              className="flex items-center overflow-hidden shrink-0"
            >
              <div className="h-20 bg-white/10 w-[1px] shrink-0 origin-center hidden lg:block" />

              <div className="flex-1 flex flex-col gap-2.5 pl-6 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <span className="text-white text-[15px] font-semibold">{title}</span>
                  <span className="bg-[#333333] text-[#a0a0a0] text-[10px] px-2.5 py-0.5 rounded-full font-bold tracking-wider border border-white/5 uppercase">LOG</span>
                </div>
                <div className="relative">
                  <div className="max-h-[80px] overflow-y-auto pr-4 custom-scrollbar-mini">
                    <p className="text-[#e0e0e0] text-[14px] leading-[1.4] font-medium">
                      {details}
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#1c1c1c] to-transparent pointer-events-none" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Section: View & Channel */}
        <motion.div layout transition={springConfig} className="flex items-center gap-4 shrink-0">
          {/* View Toggle Pill */}
          <div className="bg-[#333333] rounded-[32px] p-1.5 flex flex-col gap-1 border border-white/5">
            <button 
              onClick={() => onViewChange?.('layers')}
              className={`p-3 rounded-[24px] transition-all duration-300 ${activeView === 'layers' ? 'bg-white text-black shadow-lg scale-100' : 'text-[#808080] hover:text-white'}`}
            >
              <Layers size={20} strokeWidth={2.5} />
            </button>
            <button 
              onClick={() => onViewChange?.('grid')}
              className={`p-3 rounded-[24px] transition-all duration-300 ${activeView === 'grid' ? 'bg-white text-black shadow-lg scale-100' : 'text-[#808080] hover:text-white'}`}
            >
              <Grid size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Channel Control */}
          <div className="bg-[#333333] rounded-[32px] p-2.5 pr-8 flex items-center gap-4 border border-white/5 overflow-hidden">
            <div className="w-[84px] h-[84px] rounded-[24px] overflow-hidden border border-white/10 shadow-lg shrink-0 relative bg-black">
              <ThumbnailVisualizer channelNumber={channelNumber} title={title} />
            </div>
            <div className="flex flex-col items-center justify-center min-w-[60px] shrink-0">
              <motion.div 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-1.5 mb-1"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] shadow-[0_0_8px_rgba(0,255,204,0.6)]" />
                <span className="text-[#00ffcc] text-[10px] uppercase font-black tracking-[0.15em]">Live</span>
              </motion.div>
              <button 
                onClick={onNext}
                className="text-white hover:scale-125 transition-transform active:scale-95"
              >
                <ChevronUp size={22} strokeWidth={3} />
              </button>
              <div className="text-white text-[11px] font-black tracking-tight text-center leading-[1.1] my-1 tabular-nums">
                EXP {String(channelNumber).padStart(2, '0')}<br />
                &nbsp;
              </div>
              <button 
                onClick={onPrev}
                className="text-white hover:scale-125 transition-transform active:scale-95"
              >
                <ChevronDown size={22} strokeWidth={3} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .custom-scrollbar-mini::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar-mini::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-mini::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar-mini::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}

function ThumbnailVisualizer({ channelNumber, title }: { channelNumber: number, title: string }) {
  // Generate a seeded random-ish number for variations
  const seed = channelNumber * 123.45;
  const isAlt = channelNumber % 3 === 0;
  
  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0a0a0a] flex items-center justify-center font-mono">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: isAlt 
            ? `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`
            : `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: isAlt ? '10px 10px' : `${8 + (channelNumber % 4) * 6}px ${8 + (channelNumber % 4) * 6}px`
        }}
      />

      {/* Dynamic Geometric Shapes */}
      <AnimatePresence mode="wait">
        <motion.div
          key={channelNumber}
          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Glitch Overlay (during transition) */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-white/20 z-10"
          />

          {/* Central Shape */}
          <motion.div 
            animate={{ 
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 0.9, 1],
              borderRadius: channelNumber % 2 === 0 ? ["20%", "50%", "20%"] : ["0%", "0%", "0%"]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className={`w-12 h-12 border border-white/20 flex items-center justify-center overflow-hidden`}
          >
             <div className="w-[1px] h-full bg-white/10 absolute rotate-45" />
             <div className="w-[1px] h-full bg-white/10 absolute -rotate-45" />
             <div className="w-full h-[1px] bg-white/10 absolute" />
             <div className="w-[1px] h-full bg-white/10 absolute" />
          </motion.div>

          {/* Scanning Line */}
          <motion.div 
            animate={{ top: ["-10%", "110%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-[#00ffcc]/30 shadow-[0_0_12px_rgba(0,255,204,0.4)] z-20"
          />
        </motion.div>
      </AnimatePresence>

      {/* Title Overlay (Abbreviated) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <motion.span 
          animate={{ x: [0, 1, -1, 0] }}
          transition={{ duration: 0.1, repeat: Infinity, repeatType: 'reverse' }}
          className="text-white font-black text-[12px] tracking-[0.2em] opacity-90 mix-blend-difference uppercase"
        >
          {title.slice(0, 3)}
        </motion.span>
      </div>

      {/* Static Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* HUD-style Brackets */}
      <div className="absolute inset-2 border border-white/5 pointer-events-none">
        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/40" />
        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/40" />
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/40" />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/40" />
      </div>
    </div>
  );
}

function ControlButton({ icon, isActive, onClick }: { icon: React.ReactNode, isActive?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 border border-white/5 active:scale-90 ${
        isActive 
          ? 'bg-white text-[#1c1c1c] shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
          : 'bg-[#333333] text-white hover:bg-[#3d3d3d] hover:border-white/20'
      }`}
    >
      {icon}
    </button>
  );
}

