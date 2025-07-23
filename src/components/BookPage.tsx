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
      data-page-index={pageIndex}
      style={{ 
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        zIndex: totalPages - pageIndex,
      }}
    >
      {/* Page Loader - shows during flip or content loading */}
      <PageLoader 
        isVisible={isLoading || !isPageReady}
        type="spinner"
        size="medium"
      />
      
      {/* Main Page Content */}
      <div 
        className={`h-full flex flex-col transition-opacity duration-300 ${
          isPageReady ? 'opacity-100' : 'opacity-30'
        }`} 
        style={{ transformStyle: 'preserve-3d' }}
      >
        
        {/* Top Section: Header with Proper Spacing */}
        <header className="px-16 pt-8">
          <div className="max-w-full">
            {/* Year Badge */}
            <div className="inline-block px-3 py-1 bg-gray-100 rounded-full mb-4">
              <span className="text-xs font-medium text-gray-600 tracking-wide">
                {story.year}
              </span>
            </div>
            
            {/* Clean Typography Hierarchy */}
            <h1 className="font-display text-3xl font-light text-gray-900 mb-2 leading-tight">
              {story.title}
            </h1>
            <p className="text-base text-gray-500 font-light leading-relaxed">
              {story.subtitle}
            </p>
            
            {/* Minimal Divider */}
            {/* <div className="w-12 h-px bg-gray-300 mt-4"></div> */}
          </div>
        </header>

        {/* Main Section: Two-Column Grid Layout */}
        <main className="flex-1 px-16 pb-16">
          <div 
            className="h-full grid gap-8 items-center"
            style={{ 
              gridTemplateColumns: '1fr 1fr', // Equal columns
            }}
          >
            {/* Left Column: Art Scene */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md aspect-square relative">
                {/* Image loading state */}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
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
                  onLoad={handleImageLoad}
                  priority={pageIndex < 3} // Prioritize first few pages
                />
              </div>
            </div>

            {/* Right Column: Content */}
            <div className="flex flex-col justify-center space-y-6">
              {/* Content Text */}
              <div className="space-y-4">
                <p className="text-base text-gray-700 leading-relaxed font-light">
                  {story.content}
                </p>
              </div>
              
              {/* Attribution Section */}
              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-light">
                      {story.artist}
                    </p>
                  </div>
                  
                  {/* Minimal Page Number with ready indicator */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isPageReady ? 'bg-gray-50' : 'bg-yellow-50'
                  }`}>
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      isPageReady ? 'text-gray-600' : 'text-yellow-600'
                    }`}>
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
        }}
      ></div>

      {/* Enhanced Page Back for 3D Realism */}
      <div 
        className="absolute inset-0 bg-stone-100 rounded-lg"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden',
          zIndex: -1
        }}
      >
        <div className="h-full flex items-center justify-center opacity-20">
          <div className="text-stone-400 text-6xl font-light">
            {pageIndex + 1}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPage; 