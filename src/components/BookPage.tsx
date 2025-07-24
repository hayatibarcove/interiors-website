"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import PageLoader from './PageLoader';

interface ArtTopic {
  title: string;
  subtitle: string;
  content: string;
  scene: string;
  year: string;
  artist: string;
  image: string;
}

interface BookPageProps {
  story: ArtTopic;
  pageIndex: number;
  totalPages: number;
  isLoading?: boolean;
  onContentReady?: () => void;
}

const BookPage: React.FC<BookPageProps> = ({ 
  story, 
  pageIndex, 
  totalPages, 
  isLoading = false,
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
      className={`book-page absolute inset-0 bg-white ${
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
        clipPath: 'none'
      }}
    >
      {/* Page Loader - shows during flip or content loading */}
      <PageLoader 
        isVisible={isLoading || !isPageReady}
        type="spinner"
        size="medium"
      />
      
      {/* Main Page Content - Front Side */}
      <div 
        className={`h-full flex flex-col transition-opacity duration-300 ${
          isPageReady ? 'opacity-100' : 'opacity-30'
        }`} 
        style={{ 
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          overflow: 'visible',
          clipPath: 'none'
        }}
      >
        
        {/* Top Section: Header with Proper Spacing */}
        <header className="px-16 pt-8" style={{ overflow: 'visible', clipPath: 'none' }}>
          <div className="max-w-full" style={{ overflow: 'visible', clipPath: 'none' }}>
            {/* Year Badge */}
            <div className="year-badge inline-block px-3 py-1 bg-gray-100 rounded-full mb-4" style={{ overflow: 'visible', clipPath: 'none' }}>
              <span className="text-xs font-medium text-gray-600 tracking-wide">
                {story.year}
              </span>
            </div>
            
            {/* Clean Typography Hierarchy */}
            <h1 className="page-title font-display text-3xl font-light text-gray-900 mb-2 leading-tight" style={{ overflow: 'visible', clipPath: 'none' }}>
              {story.title}
            </h1>
            <p className="page-subtitle text-base text-gray-500 font-light leading-relaxed" style={{ overflow: 'visible', clipPath: 'none' }}>
              {story.subtitle}
            </p>
            
            {/* Minimal Divider */}
            {/* <div className="w-12 h-px bg-gray-300 mt-4"></div> */}
          </div>
        </header>

        {/* Main Section: Two-Column Grid Layout */}
        <main className="flex-1 px-16 pb-16" style={{ overflow: 'visible', clipPath: 'none' }}>
          <div 
            className="h-full grid gap-8 items-center"
            style={{ 
              gridTemplateColumns: '1fr 1fr', // Equal columns
              overflow: 'visible',
              clipPath: 'none'
            }}
          >
            {/* Left Column: Art Scene */}
            <div className="flex items-center justify-center" style={{ overflow: 'visible', clipPath: 'none' }}>
              <div className="w-full max-w-md aspect-square relative" style={{ overflow: 'visible', clipPath: 'none' }}>
                {/* Image loading state */}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center" style={{ overflow: 'visible', clipPath: 'none' }}>
                    <div className="text-gray-400 text-sm">Loading image...</div>
                  </div>
                )}
                
                <Image
                  src={story.image}
                  alt={`Artistic representation of ${story.title} by ${story.artist}`}
                  width={1080}
                  height={1080}
                  className={`w-full h-full object-cover rounded-lg shadow-sm transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ overflow: 'visible', clipPath: 'none' }}
                  onLoad={handleImageLoad}
                  priority={pageIndex < 3} // Prioritize first few pages
                />
              </div>
            </div>

            {/* Right Column: Content */}
            <div className="flex flex-col justify-center space-y-6" style={{ overflow: 'visible', clipPath: 'none' }}>
              {/* Content Text */}
              <div className="page-content space-y-4" style={{ overflow: 'visible', clipPath: 'none' }}>
                <p className="text-base text-gray-700 leading-relaxed font-light" style={{ overflow: 'visible', clipPath: 'none' }}>
                  {story.content}
                </p>
              </div>
              
              {/* Attribution Section */}
              <div className="pt-6 border-t border-gray-100" style={{ overflow: 'visible', clipPath: 'none' }}>
                <div className="flex items-center justify-between" style={{ overflow: 'visible', clipPath: 'none' }}>
                  <div style={{ overflow: 'visible', clipPath: 'none' }}>
                    <p className="artist-name text-sm text-gray-500 font-light" style={{ overflow: 'visible', clipPath: 'none' }}>
                      {story.artist}
                    </p>
                  </div>
                  
                  {/* Minimal Page Number with ready indicator */}
                  <div className={`page-number w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isPageReady ? 'bg-gray-50' : 'bg-yellow-50'
                  }`} style={{ overflow: 'visible', clipPath: 'none' }}>
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      isPageReady ? 'text-gray-600' : 'text-yellow-600'
                    }`} style={{ overflow: 'visible', clipPath: 'none' }}>
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
        className="absolute inset-0 bg-stone-100 rounded-lg"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden', // Keep hidden until flipped
          zIndex: -1,
          opacity: 0, // Start hidden
          visibility: 'hidden', // Start hidden
          overflow: 'visible',
          clipPath: 'none',
          pointerEvents: 'none' // Prevent interaction when hidden
        }}
      >
        <div className="h-full flex items-center justify-center opacity-20" style={{ overflow: 'visible', clipPath: 'none' }}>
          <div className="text-stone-400 text-6xl font-light" style={{ overflow: 'visible', clipPath: 'none' }}>
            {pageIndex + 1}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPage; 