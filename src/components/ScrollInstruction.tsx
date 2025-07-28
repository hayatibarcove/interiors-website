"use client";

import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ScrollInstructionProps {
  text?: string;
  className?: string;
}

const ScrollInstruction: React.FC<ScrollInstructionProps> = ({ 
  text = "Scroll to explore", 
  className = "" 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;
      
      const progress = Math.min(scrollY / maxScroll, 1);
      setScrollProgress(progress);

      // Hide instruction after scrolling starts
      if (scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fullscreen-scroll-instruction ${className}`} role="note" aria-label="Scroll instruction">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Enhanced Scroll Indicator */}
        <div className="relative scroll-indicator-float">
          {/* Outer ring with pulse animation */}
          <div className="w-12 h-20 border-2 border-stone-300/60 rounded-full flex justify-center items-start relative">
            {/* Inner scroll indicator */}
            <div className="w-1 h-6 bg-stone-400 rounded-full mt-3 animate-bounce relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-stone-300 rounded-full blur-sm scroll-indicator-glow"></div>
            </div>
            
            {/* Pulse rings */}
            <div className="absolute inset-0 border border-stone-200/40 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border border-stone-200/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          {/* Chevron icon */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <ChevronDown className="w-4 h-4 text-stone-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>

        {/* Text with enhanced typography */}
        <div className="text-center space-y-1">
          <p className="text-stone-500 text-xs font-medium tracking-widest uppercase">
            {text}
          </p>
          <p className="text-stone-400 text-xs font-light tracking-wide">
            Discover the portfolio
          </p>
        </div>

        {/* Progress indicator */}
        <div className="w-16 h-1 bg-stone-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-stone-400 to-stone-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScrollInstruction; 