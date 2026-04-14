'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, Minus } from 'lucide-react';

const Terminal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dragControls = useDragControls();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showCommands, setShowCommands] = useState(false);
  
  const experiments = [
    { id: '01', title: 'gridscape', tags: 'ai · mapping', status: 'live' },
    { id: '02', title: 'worldwide', tags: 'geo · tactical', status: 'live' },
    { id: '04', title: 'elemental', tags: 'science · interactive', status: 'live' },
    { id: '05', title: 'canopy', tags: 'viz · cinematic', status: 'wip' },
    { id: '12', title: 'warpfield', tags: 'p5.js · particles', status: 'active' },
  ];

  const SLASH_COMMANDS = [
    { cmd: '/share', desc: 'Copy portfolio link' },
    { cmd: '/message', desc: 'Message Vamsi (Bumsee)' },
    { id: 'linkedin', cmd: '/linkedin', desc: 'Visit LinkedIn profile' },
    { cmd: '/idea', desc: 'Submit an experiment idea' },
    { cmd: '/resume', desc: 'Download technical resume' },
    { cmd: '/clear', desc: 'Clear terminal history' },
  ];
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on history change
  useEffect(() => {
    if (scrollRef.current && !showCommands) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, showCommands]);

  // Handle slash command scroll centering
  useEffect(() => {
    if (showCommands && scrollRef.current && promptRef.current) {
        const topPos = promptRef.current.offsetTop;
        scrollRef.current.scrollTo({
            top: topPos - 40,
            behavior: 'smooth'
        });
    }
  }, [showCommands]);

  useEffect(() => {
    setShowCommands(input.startsWith('/'));
  }, [input]);

  function startDrag(event: React.PointerEvent) {
    dragControls.start(event);
  }

  const handleCommand = async (e: React.KeyboardEvent) => {
    if (showCommands && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        // We could add arrow nav for slash commands here, but keeping it simple for now per user request.
        return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : experiments.length - 1));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < experiments.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'Enter' && input.trim() && !isLoading) {
      const userMessage = input.trim();
      
      // Handle slash commands logic
      if (userMessage === '/clear') {
        setHistory([]);
        setInput('');
        return;
      }
      
      setHistory((prev) => [...prev, `guest@vibebuild:~$ ${userMessage}`]);
      setInput('');
      setIsLoading(true);
      setShowCommands(false);

      try {
        setHistory((prev) => [...prev, `[AI] processing request...`]);
        
        const response = await fetch('/api/terminal/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage }),
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
           throw new Error(`Invalid response format (HTTP ${response.status}). Ensure the API route is deployed.`);
        }

        const data = await response.json();
        
        setHistory((prev) => {
          const newHistory = [...prev];
          newHistory.pop(); // remove [AI] processing...
          if (!response.ok) {
            return [...newHistory, `Error: ${data.error || 'System fault.'}`];
          }
          return [...newHistory, `> ${data.response}`];
        });
      } catch (err: any) {
        setHistory((prev) => {
          const newHistory = [...prev];
          newHistory.pop();
          return [...newHistory, `System error: ${err.message || 'Failed to reach AI kernel.'}`];
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {/* Trigger Button - Bottom Right */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[9998] w-12 h-12 bg-[#1c1c1c] border border-white/20 rounded-full flex items-center justify-center shadow-2xl group"
        >
          <span className="text-white/60 font-mono text-[14px] group-hover:text-green-400 transition-colors">{'>_'}</span>
        </motion.button>
      )}

      {/* Terminal Window */}
      {isOpen && (
        <motion.div
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          className="fixed bottom-10 right-10 z-[10000] w-[400px] h-[300px] bg-[#1c1c1c] rounded-lg overflow-hidden border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.7)] flex flex-col font-mono text-[10px]"
        >
          {/* Title Bar - Drag Handle */}
          <div 
            onPointerDown={startDrag}
            className="h-[32px] bg-[#2d2d2d] flex items-center px-4 cursor-grab active:cursor-grabbing select-none relative shrink-0"
          >
            <div className="flex gap-2 mr-auto z-10 group/controls">
              <button 
                onPointerDown={(e) => e.stopPropagation()} 
                onClick={() => setIsOpen(false)} 
                className="w-3 h-3 bg-[#ff5f56] rounded-full hover:brightness-110 active:brightness-90 transition-all border border-black/10 shadow-sm flex items-center justify-center group"
              >
                <X size={8} className="text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button 
                 onPointerDown={(e) => e.stopPropagation()} 
                 onClick={() => setIsOpen(false)} // Mimicking minimize for now
                 className="w-3 h-3 bg-[#ffbd2e] rounded-full border border-black/10 shadow-sm flex items-center justify-center group"
              >
                <Minus size={8} className="text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <div className="w-3 h-3 bg-[#27c93f] rounded-full border border-black/10 shadow-sm" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-white/40 font-bold tracking-tight pointer-events-none text-[11px]">
              vamsibatchu-cli — zsh — 82×31
            </div>
          </div>

      {/* Terminal Content */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3"
      >
        <div className="flex gap-4 mb-2 font-bold opacity-90 text-[11px]">
            <div className="flex items-center gap-1.5">
                <span className="text-green-400">**</span>
                <span className="text-white">vibenbuild</span>
            </div>
            <span className="text-white/30">status: active</span>
            <span className="text-white border-b border-white/20">v0.4.2</span>
        </div>

        <div>
            <h3 className="text-white/30 font-bold mb-2 text-[11px]">Experiments</h3>
            <div className="space-y-1">
                {experiments.map((item, i) => {
                    const isSelected = i === selectedIndex;
                    return (
                        <div key={i} className={`flex items-center gap-2 pr-2 ml-1 transition-colors ${isSelected ? 'bg-white/5' : ''}`}>
                            <span className={`text-cyan-400 -ml-4 ${isSelected ? 'visible' : 'invisible'}`}>▶</span>
                            <span className={`shrink-0 ${isSelected ? 'text-green-300' : (item.status === 'wip' ? 'text-yellow-500/60' : 'text-green-500/40')}`}>♢</span>
                            <span className={`font-bold truncate ${isSelected ? 'text-white' : 'text-white/60'}`}>{item.title}</span>
                            <span className="text-white/20">·</span>
                            <span className="text-white/30 whitespace-nowrap">{item.tags}</span>
                            <span className="text-white/20 ml-auto">·</span>
                            <span className={`text-[9px] uppercase tracking-tighter ${isSelected ? 'text-green-400' : (item.status === 'wip' ? 'text-yellow-500/30' : 'text-green-400/30')}`}>{item.status}</span>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* History Area */}
        {history.map((line, i) => (
            <div key={i} className="text-white/80 leading-relaxed">{line}</div>
        ))}

        {/* Command Prompt */}
        <div ref={promptRef} className="flex flex-col gap-2 pt-2 relative">
            <div className="flex items-start gap-2 relative">
                <span className="text-green-400 shrink-0">guest@vibebuild:~$</span>
                <div className="flex-1 relative flex items-center min-h-[14px]">
                    {/* Visual Text + Cursor */}
                    <div className="absolute inset-0 pointer-events-none flex items-center whitespace-pre-wrap break-all pr-4">
                        <span className="text-white">{input}</span>
                        <span className={`inline-block w-[7px] h-[13px] bg-white ml-[1px] ${isLoading ? 'opacity-50' : 'animate-terminal-blink'}`} />
                    </div>
                    
                    {/* Real hidden input */}
                    <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleCommand}
                        readOnly={isLoading}
                        autoFocus
                        className="w-full bg-transparent border-none outline-none text-transparent caret-transparent focus:ring-0 p-0 z-10"
                    />
                </div>
            </div>

            {/* Slash Commands Suggester - Now Below */}
            {showCommands && (
                <div className="bg-[#2d2d2d]/30 border-y border-white/5 py-4 px-2 space-y-3 mt-2">
                    {SLASH_COMMANDS.filter(c => c.cmd.startsWith(input)).map((c, i) => (
                        <div key={i} className="flex justify-between items-center text-[10px] group cursor-pointer hover:bg-white/5 px-2">
                            <span className="text-[#a5b4fc] font-bold">{c.cmd}</span>
                            <span className="text-white/30 uppercase tracking-widest">{c.desc}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Input Area / Footer */}
      <div className="bg-[#1c1c1c] border-t border-white/5 p-3 font-bold text-white/40 flex justify-between items-center shrink-0">
        <div className="flex gap-3">
            <span>Page 1/3</span>
            <span>·</span>
            <div className="flex items-center gap-1">
                <span className="text-white">↑↓</span>
                <span>navigate</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
                <span className="rotate-90 text-white">⏎</span>
                <span>open</span>
            </div>
        </div>
        <div className="flex gap-2">
            <span>q back</span>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.08); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }

        @keyframes terminal-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-terminal-blink {
          animation: terminal-blink 1s step-end infinite;
        }
      `}</style>
        </motion.div>
      )}
    </>
  );
};

export default Terminal;
