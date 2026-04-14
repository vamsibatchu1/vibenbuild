'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';

const Terminal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dragControls = useDragControls();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on history change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  function startDrag(event: React.PointerEvent) {
    dragControls.start(event);
  }

  const handleCommand = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim() && !isLoading) {
      const userMessage = input.trim();
      setHistory((prev) => [...prev, `guest@vibebuild:~$ ${userMessage}`]);
      setInput('');
      setIsLoading(true);

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
            <div className="flex gap-2 mr-auto z-10">
              <button 
                onPointerDown={(e) => e.stopPropagation()} 
                onClick={() => setIsOpen(false)} 
                className="w-3 h-3 bg-[#ff5f56] rounded-full hover:brightness-110 active:brightness-90 transition-all border border-black/10 shadow-sm"
              />
              <div className="w-3 h-3 bg-[#ffbd2e] rounded-full border border-black/10 shadow-sm" />
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
                {[
                    { id: '01', title: 'gridscape', tags: 'ai · mapping', status: 'live' },
                    { id: '02', title: 'worldwide', tags: 'geo · tactical', status: 'live' },
                    { id: '04', title: 'elemental', tags: 'science · interactive', status: 'live' },
                    { id: '05', title: 'canopy', tags: 'viz · cinematic', status: 'wip' },
                    { id: '12', title: 'warpfield', tags: 'p5.js · particles', status: 'active' },
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 group cursor-pointer pr-2 ml-1 hover:bg-white/5 transition-colors">
                        <span className="text-cyan-400 invisible group-hover:visible -ml-4">▶</span>
                        <span className={`shrink-0 ${item.status === 'wip' ? 'text-yellow-500' : 'text-green-400'}`}>♢</span>
                        <span className="text-white font-bold truncate">{item.title}</span>
                        <span className="text-white/20">·</span>
                        <span className="text-white/30 whitespace-nowrap">{item.tags}</span>
                        <span className="text-white/20 ml-auto">·</span>
                        <span className={`text-[9px] uppercase tracking-tighter ${item.status === 'wip' ? 'text-yellow-500/50' : 'text-green-400/50'}`}>{item.status}</span>
                    </div>
                ))}
            </div>
        </div>

        <div>
            <h3 className="text-white/30 font-bold mb-2 text-[11px]">Connectivity</h3>
            <div className="space-y-1 pl-2">
                {[
                    { label: 'Follow on X', icon: '♦', color: 'text-cyan-400', link: 'x.com/vamsibatchuk' },
                    { label: 'GitHub Repository', icon: '♦', color: 'text-cyan-400', link: 'github.com/vamsibatchu' },
                    { label: 'Portfolio v1', icon: '□', color: 'text-white/40', link: 'vamsibatchu.com' },
                    { label: 'System Kernel', icon: '·', color: 'text-white/30', link: 'active' },
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 cursor-pointer group hover:bg-white/5 pr-2">
                        <span className={`${item.color} shrink-0 text-[12px]`}>{item.icon}</span>
                        <span className="text-white/90 truncate group-hover:text-white">{item.label}</span>
                        <span className="text-white/10 group-hover:text-white/30 ml-auto text-[9px]">{item.link}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* History Area */}
        {history.map((line, i) => (
            <div key={i} className="text-white/80 leading-relaxed">{line}</div>
        ))}

        {/* Command Prompt */}
        <div className="flex items-start gap-2 pt-2 relative">
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
