"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface InteriorTopic {
  title: string;
  subtitle: string;
  content: string;
  scene: string;
  year: string;
  artist: string;
  image: string;
}

interface BookPageProps {
  story: InteriorTopic;
  pageIndex: number;
  totalPages: number;
  onContentReady?: () => void;
}

const BookPage: React.FC<BookPageProps> = ({ 
  story, 
  pageIndex, 
  totalPages, 
  onContentReady 
}) => {
  const isLeftPage = pageIndex % 2 === 0;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  // Simulate content preparation time (in real app, this might be API calls, etc.)
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentReady(true);
      onContentReady?.();
    }, 300); // Minimum loading time for smooth UX

    return () => clearTimeout(timer);
  }, [onContentReady]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const isPageReady = imageLoaded && contentReady;
  
  return (
    <div 
      className={`book-page absolute inset-0 ${
        isLeftPage ? 'origin-right' : 'origin-left'
      }`}
      data-page={pageIndex}
      data-page-index={pageIndex}
      style={{ 
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        zIndex: totalPages - pageIndex,
        opacity: 1,
        visibility: 'visible',
        overflow: 'visible',
        clipPath: 'none',
        // Force hardware acceleration
        transform: 'translateZ(0)',
        willChange: 'transform',
        // Optimize text rendering
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
        background: 'var(--secondary-background)'
      }}
    >
      
      {/* Main Page Content - Front Side */}
      <div 
        className={`h-full flex flex-col transition-opacity duration-300 ${
          isPageReady ? 'opacity-100' : 'opacity-30'
        }`} 
        style={{ 
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          overflow: 'visible',
          clipPath: 'none',
          // Force hardware acceleration
          transform: 'translateZ(0)',
          willChange: 'transform',
          // Optimize text rendering
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility'
        }}
      >
        
        {/* Top Section: Header with Responsive Spacing */}
        <header className="px-4 sm:px-6 md:px-8 lg:px-16 pt-4 sm:pt-6 md:pt-8" style={{ overflow: 'visible', clipPath: 'none' }}>
          <div className="max-w-full" style={{ overflow: 'visible', clipPath: 'none' }}>
            {/* Year Badge with Responsive Sizing */}
            <div className="year-badge inline-block px-2 py-1 sm:px-3 sm:py-1 rounded-full mb-2 sm:mb-3 md:mb-4" style={{ 
              overflow: 'visible', 
              clipPath: 'none',
              backgroundColor: 'var(--accent-1)',
              // Ensure proper animation setup - let GSAP control these properties
              willChange: 'transform, opacity'
            }}>
              <span className="text-xs sm:text-sm font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
                {story.year}
              </span>
            </div>
            
            {/* Responsive Typography Hierarchy */}
            <h1 className="page-title font-display text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-1 sm:mb-2 leading-tight" style={{ 
              overflow: 'visible', 
              clipPath: 'none',
              color: 'var(--foreground)',
              // Ensure proper animation setup - let GSAP control these properties
              willChange: 'transform, opacity'
            }}>
              {story.title}
            </h1>
            <p className="page-subtitle text-sm sm:text-base md:text-lg font-light leading-relaxed" style={{ 
              overflow: 'visible', 
              clipPath: 'none',
              color: 'var(--typography-secondary)',
              // Ensure proper animation setup - let GSAP control these properties
              willChange: 'transform, opacity'
            }}>
              {story.subtitle}
            </p>
          </div>
        </header>

        {/* Main Section: Two-Column Grid Layout with Responsive Padding */}
        <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-16 pb-4 sm:pb-6 md:pb-8 lg:pb-16" style={{ overflow: 'visible', clipPath: 'none' }}>
          <div 
            className="h-full grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-8 items-center"
            style={{ 
              overflow: 'visible',
              clipPath: 'none'
            }}
          >
            {/* Left Column: Art Scene */}
            <div className="flex items-center justify-center" style={{ overflow: 'visible', clipPath: 'none' }}>
              <div className="w-full max-w-full aspect-square relative" style={{ overflow: 'hidden', borderRadius: '50%' }}>
                {/* Image loading state */}
                {!imageLoaded && (
                  <div className="absolute inset-0 rounded-lg animate-pulse flex items-center justify-center" style={{ 
                    overflow: 'visible', 
                    clipPath: 'none',
                    background: 'var(--accent-1)'
                  }}>
                    <div className="text-xs sm:text-sm" style={{ color: 'var(--typography-secondary)' }}>Loading image...</div>
                  </div>
                )}
                
                <Image
                  src={story.image}
                  alt={`Artistic representation of ${story.title} by ${story.artist}`}
                  className={`shadow-sm transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  objectFit='cover'
                  layout='fill'
                  onLoad={handleImageLoad}
                  priority={pageIndex < 3} // Prioritize first few pages
                  style={{
                    // Ensure proper animation setup - let GSAP control these properties
                    willChange: 'transform, opacity'
                  }}
                />
              </div>
            </div>

            {/* Right Column: Content with Responsive Typography */}
            <div className="flex flex-col justify-center space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6" style={{ overflow: 'visible', clipPath: 'none' }}>
              {/* Content Text with Responsive Sizing */}
              <div className="page-content space-y-2 sm:space-y-3 md:space-y-4" style={{ overflow: 'visible', clipPath: 'none' }}>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed font-light" style={{ 
                  overflow: 'visible', 
                  clipPath: 'none',
                  color: 'var(--typography-secondary)',
                  // Ensure proper animation setup - let GSAP control these properties
                  willChange: 'transform, opacity'
                }}>
                  {story.content}
                </p>
              </div>
              
              {/* Attribution Section with Responsive Sizing */}
              <div className="pt-2 sm:pt-3 md:pt-4 lg:pt-6 border-t" style={{ 
                overflow: 'visible', 
                clipPath: 'none',
                borderColor: 'var(--accent-1)'
              }}>
                <div className="flex items-center justify-between" style={{ overflow: 'visible', clipPath: 'none' }}>
                  <div style={{ overflow: 'visible', clipPath: 'none' }}>
                    <p className="artist-name text-xs sm:text-sm md:text-base font-light" style={{ 
                      overflow: 'visible', 
                      clipPath: 'none',
                      color: 'var(--typography-secondary)',
                      // Ensure proper animation setup - let GSAP control these properties
                      willChange: 'transform, opacity'
                    }}>
                      {story.artist}
                    </p>
                  </div>
                  
                  {/* Responsive Page Number */}
                  <div className={`page-number w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-colors duration-300`} style={{ 
                    overflow: 'visible', 
                    clipPath: 'none',
                    backgroundColor: 'var(--accent-1)',
                    // Ensure proper animation setup - let GSAP control these properties
                    willChange: 'transform, opacity'
                  }}>
                    <span className={`text-xs sm:text-sm md:text-sm font-medium transition-colors duration-300`} style={{ 
                      overflow: 'visible', 
                      clipPath: 'none',
                      color: 'var(--foreground)'
                    }}>
                      {pageIndex + 1}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Subtle Page Shadow (Minimal) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `linear-gradient(${isLeftPage ? '270deg' : '90deg'}, 
            rgba(0,0,0,0.02) 0%, 
            transparent 5%)`,
          overflow: 'visible',
          clipPath: 'none'
        }}
      ></div>

      {/* Enhanced Page Back for 3D Realism - Only Visible When Flipped */}
      <div 
        className="absolute inset-0 rounded-lg"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden', // Keep hidden until flipped
          zIndex: -1,
          opacity: 0, // Start hidden
          visibility: 'hidden', // Start hidden
          overflow: 'visible',
          clipPath: 'none',
          pointerEvents: 'none', // Prevent interaction when hidden
          background: 'var(--accent-2)'
        }}
      >
        <div className="h-full flex items-center justify-center opacity-20" style={{ overflow: 'visible', clipPath: 'none' }}>
          <div className="text-2xl sm:text-4xl md:text-6xl font-light" style={{ 
            overflow: 'visible', 
            clipPath: 'none',
            color: 'var(--foreground)'
          }}>
            {pageIndex + 1}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPage; 