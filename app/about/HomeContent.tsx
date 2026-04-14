'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronLeft, ChevronRight, Home, PenTool, FlaskConical, Briefcase, Plus, Minus } from 'lucide-react';
import { Inter, EB_Garamond, Plus_Jakarta_Sans } from 'next/font/google';

// FONTS
const interFont = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

const ebGaramondFont = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-eb-garamond',
  display: 'swap',
});

const jakartaFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-jakarta',
  display: 'swap',
});

// TYPES FOR EXPANDING TEXT
export type TextSegment = string | ExpandableSegment;

export interface ExpandableSegment {
  id: string;
  triggerText: string;
  hiddenContent: TextSegment[];
}

// COMPONENTS FOR EXPANDING TEXT
const AnimatedText: React.FC<{
  content: TextSegment[];
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  parentId: string;
}> = ({ content, expandedIds, onToggle, parentId }) => {
  const [visibleChars, setVisibleChars] = useState(0);
  
  const getTextLength = (segments: TextSegment[]): number => {
    return segments.reduce((sum, seg) => {
      if (typeof seg === 'string') return sum + seg.length;
      return sum + seg.triggerText.length;
    }, 0);
  };

  const totalChars = getTextLength(content);

  useEffect(() => {
    if (visibleChars < totalChars) {
      const timer = setTimeout(() => {
        setVisibleChars((prev) => Math.min(prev + 3, totalChars));
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [visibleChars, totalChars]);

  let charCount = 0;
  const visibleContent: (TextSegment | string)[] = [];
  
  for (const seg of content) {
    const segLength = typeof seg === 'string' ? seg.length : seg.triggerText.length;
    
    if (charCount + segLength <= visibleChars) {
      visibleContent.push(seg);
      charCount += segLength;
    } else if (charCount < visibleChars) {
      if (typeof seg === 'string') {
        const remaining = visibleChars - charCount;
        visibleContent.push(seg.substring(0, remaining));
      } else {
        visibleContent.push(seg);
      }
      break;
    } else {
      break;
    }
  }

  return (
    <span className="inline ml-1">
      {' '}
      <span className="inline">
        {visibleContent.map((subSegment, index) => {
          if (typeof subSegment === 'string') {
            return <span key={`${parentId}-text-${index}`}>{subSegment}</span>;
          }
          return (
            <SegmentRenderer
              key={`${parentId}-${index}`}
              segment={subSegment}
              expandedIds={expandedIds}
              onToggle={onToggle}
              parentId={parentId}
            />
          );
        })}
      </span>
    </span>
  );
};

const SegmentRenderer: React.FC<{
  segment: TextSegment;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  parentId?: string;
}> = ({ segment, expandedIds, onToggle, parentId }) => {
  if (typeof segment === 'string') {
    return <span>{segment}</span>;
  }

  const isExpanded = expandedIds.has(segment.id);
  const uniqueId = parentId ? `${parentId}-${segment.id}` : segment.id;

  return (
    <span className="inline">
      <motion.button
        onClick={() => onToggle(segment.id)}
        className="cursor-pointer hover:opacity-70 transition-opacity inline-flex items-center gap-1.5 text-black"
        whileHover={{ scale: 1.02 }}
        style={{ 
          textDecoration: 'underline', 
          textDecorationStyle: 'dotted',
          textDecorationColor: '#9CA3AF',
          textDecorationThickness: '3px',
          textUnderlineOffset: '4px'
        }}
      >
        <span>{segment.triggerText}</span>
        <span 
          className="inline-flex items-center justify-center rounded-full border border-black flex-shrink-0"
          style={{
            width: '1em',
            height: '1em',
            minWidth: '1em',
            minHeight: '1em',
          }}
        >
          {isExpanded ? (
            <Minus size="0.6em" strokeWidth={2.5} style={{ width: '0.6em', height: '0.6em' }} />
          ) : (
            <Plus size="0.6em" strokeWidth={2.5} style={{ width: '0.6em', height: '0.6em' }} />
          )}
        </span>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <AnimatedText
            content={segment.hiddenContent}
            expandedIds={expandedIds}
            onToggle={onToggle}
            parentId={uniqueId}
          />
        )}
      </AnimatePresence>
    </span>
  );
};

export function ExpandingText({ segments, className = '' }: { segments: TextSegment[] | TextSegment[][], className?: string }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getCharacterCount = (segment: TextSegment): number => {
    if (typeof segment === 'string') {
      return segment.length;
    }
    return segment.triggerText.length;
  };

  const paragraphs: TextSegment[][] = Array.isArray(segments[0]) 
    ? (segments as TextSegment[][])
    : [segments as TextSegment[]];

  const allSegments: TextSegment[] = paragraphs.flat();

  const totalChars = allSegments.reduce((sum, segment) => sum + getCharacterCount(segment), 0);
  const targetChars = Math.floor(totalChars / 2);

  let currentChars = 0;
  let splitIndex = 0;
  for (let i = 0; i < allSegments.length; i++) {
    currentChars += getCharacterCount(allSegments[i]);
    if (currentChars >= targetChars) {
      splitIndex = i + 1;
      break;
    }
  }

  const leftColumn = allSegments.slice(0, splitIndex);
  const rightColumn = allSegments.slice(splitIndex);

  return (
    <div
      className={`${ebGaramondFont.className} text-black text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] leading-[130%] ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="inline">
          {leftColumn.map((segment, index) => (
            <SegmentRenderer
              key={`left-${index}`}
              segment={segment}
              expandedIds={expandedIds}
              onToggle={handleToggle}
            />
          ))}
        </div>

        <div className="inline">
          {rightColumn.map((segment, index) => (
            <SegmentRenderer
              key={`right-${index}`}
              segment={segment}
              expandedIds={expandedIds}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// DATA
export const aboutTextData: TextSegment[][] = [
  [
    'Originally from India, I am a designer currently living in Atlanta with my wife and dog. I like to call myself a ',
    {
      id: 'product-builder',
      triggerText: 'product builder',
      hiddenContent: [
        'Someone who designs, builds, and ships products end-to-end. Beyond just designing interfaces, I work across design, product strategy, and engineering to bring ideas to life.',
      ],
    },
    ' and a ',
    {
      id: 'software-tinkerer',
      triggerText: 'software tinkerer',
      hiddenContent: [
        'I enjoy experimenting with code, building prototypes, and exploring new technologies. This technical curiosity helps me communicate effectively with engineering teams and create more feasible designs.',
      ],
    },
    '. With a background in computer science, I found my calling in it\'s intersection with art and curiosity.',
  ],
  [
    'With a proven track record leading cross-functional initiatives to shape product strategy, I specialize in defining the vision for ',
    {
      id: 'zero-to-one',
      triggerText: 'zero-to-one',
      hiddenContent: [
        'Building products from scratch. This means identifying market opportunities, defining the initial vision, and creating something that didn\'t exist before—moving from zero users to the first user and beyond.',
      ],
    },
    ', ',
    {
      id: 'ai-native',
      triggerText: 'AI-native',
      hiddenContent: [
        'Products built with AI as a core capability from the ground up, not as an add-on feature. These products leverage AI to create new value propositions and user experiences that weren\'t possible before.',
      ],
    },
    ' products and evolving ',
    {
      id: 'data-informed-design-systems',
      triggerText: 'data-informed design systems',
      hiddenContent: [
        'Design systems that evolve based on user behavior data, usage patterns, and performance metrics. Rather than static style guides, these systems continuously improve through quantitative insights.',
      ],
    },
    '. I thrive on collaborating with product and business partners to drive innovation and deliver measurable impact.',
  ],
  [
    'Beyond designing products, I\'m actively advancing AI fluency at Rocket through multiple initiatives and serving on the ',
    {
      id: 'ai-leadership-council',
      triggerText: 'AI Leadership Council',
      hiddenContent: [
        'A strategic group that shapes AI tool strategy, training programs, and adoption across Rocket Mortgage. We help teams understand how to effectively leverage AI in their work and make informed decisions about AI investments.',
      ],
    },
    ' to shape tool strategy, training programs, and adoption.',
  ],
];

// MAIN COMPONENT
export default function HomeContent() {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // NOTE: Update these paths to match your project's public directory if needed
  const carouselImages = [
    { src: '/images/port/high1.svg', alt: 'Portfolio highlight 1' },
    { src: '/images/port/high2.svg', alt: 'Portfolio highlight 2' },
    { src: '/images/port/high3.svg', alt: 'Portfolio highlight 3' },
    { src: '/images/port/high4.svg', alt: 'Portfolio highlight 4' },
  ];

  const handlePrevious = () => {
    setCarouselIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 2000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/writing', label: 'Writing', icon: PenTool },
    { href: '/experiments', label: 'Experiments', icon: FlaskConical },
    { href: '/work', label: 'Work', icon: Briefcase },
  ];

  const currentNavItem = navItems.find(item => item.href === pathname) || navItems[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMobileNavOpen(false);
      }
    };

    if (isMobileNavOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileNavOpen]);

  return (
    <div className={`w-full bg-white ${interFont.variable} ${ebGaramondFont.variable} ${jakartaFont.variable}`}>
      <div className="w-full flex flex-col gap-[40px] md:gap-[80px] max-w-[1200px] mx-auto px-6 md:px-4 pb-6 md:pb-12">
      
      {/* Section 1: About paragraph */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
        className="text-left w-full flex flex-col [&>div]:text-[18px] md:[&>div]:text-[28px] lg:[&>div]:text-[32px]"
      >
        <ExpandingText segments={aboutTextData} />
      </motion.div>

      {/* Section 2: Portrait of Vamsi */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="flex flex-col md:flex-row justify-left w-full gap-6 md:gap-[48px]"
      >
        <div className="flex flex-col w-full md:w-[40%]">
          <Image src="/images/wip/about/vamsi.jpg" alt="Vamsi" width={640} height={600} className="w-full h-auto object-cover"/>
        </div>
        
        <div className="flex flex-col w-full md:w-[70%] gap-4">
          <img
            src="/images/port/hero2.webp"
            alt="Hero"
            className="h-auto"
          />
        </div>
      </motion.div>


      {/* Section 3: Work Highlights */}
      <motion.div 
        className="w-full flex flex-col gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
      >
        {/* Mobile Carousel */}
        <div className="md:hidden w-full">
          <div className="w-full overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={carouselIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                <img
                  src={carouselImages[carouselIndex].src}
                  alt={carouselImages[carouselIndex].alt}
                  className="w-full h-auto"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-between w-full mt-6">
            <button
              onClick={handlePrevious}
              className="w-8 h-8 border-2 border-dotted border-black flex items-center justify-center hover:opacity-70 transition-opacity bg-transparent"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 text-black" />
            </button>
            <button
              onClick={handleNext}
              className="w-8 h-8 border-2 border-dotted border-black flex items-center justify-center hover:opacity-70 transition-opacity bg-transparent"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:flex md:flex-row gap-6 w-full">
          {carouselImages.map((image, index) => (
            <div key={index} className="w-1/4">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </motion.div>


      {/* Section 4: Worktypes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.6, ease: "easeOut" }}
        className="w-full flex flex-col md:flex-row gap-6 md:gap-[40px]"
      >
        <div className="w-full md:w-[580px]">
          <p className={`${ebGaramondFont.className} text-black text-[18px] md:text-[40px] leading-[100%] tracking-[-0.02em] text-left`}>
            Throughout the past decade, I had the opportunity to lead and work on a variety of projects including ...
          </p>
        </div>
        <div className="w-full md:w-[580px]">
          <img
            src="/images/port/worktypes2.webp"
            alt="Work Types"
            className="w-full h-auto"
          />
        </div>
      </motion.div>

      </div>
    </div>
  );
}
