"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BookPage from './BookPage';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Custom hook for dynamic book sizing for constrained fullscreen
const useResponsiveBookSize = () => {
  const [bookDimensions, setBookDimensions] = useState({
    width: 640,
    height: 420,
    scale: 1
  });

  const calculateBookSize = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Get CSS custom property values for layout constraints
    const headerHeight = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--header-height') || '88');
    const footerHeight = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--footer-height') || '52');
    const bookPadding = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--book-padding') || '24');

    // Calculate available space between header and footer
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Available space calculation
    const availableHeight = viewportHeight - headerHeight - footerHeight - (bookPadding * 2);
    const availableWidth = viewportWidth - (bookPadding * 2);

    // Ensure minimum available space
    const minAvailableHeight = 200;
    const minAvailableWidth = 320;
    
    if (availableHeight < minAvailableHeight || availableWidth < minAvailableWidth) {
      console.warn('Insufficient space for book layout');
      return;
    }

    // Book aspect ratio (width:height = 1.52:1 for standard book)
    const bookAspectRatio = 1.52;
    
    // Calculate maximum possible dimensions while maintaining aspect ratio
    const widthFromHeight = availableHeight * bookAspectRatio;
    const heightFromWidth = availableWidth / bookAspectRatio;
    
    let finalWidth, finalHeight;
    
    if (widthFromHeight <= availableWidth) {
      // Height is the limiting factor
      finalWidth = widthFromHeight;
      finalHeight = availableHeight;
    } else {
      // Width is the limiting factor
      finalWidth = availableWidth;
      finalHeight = heightFromWidth;
    }

    // Apply reasonable size constraints while respecting available space
    const minWidth = Math.min(320, availableWidth * 0.8);
    const maxWidth = Math.min(1000, availableWidth * 0.95);
    const minHeight = Math.min(210, availableHeight * 0.8);
    const maxHeight = Math.min(650, availableHeight * 0.95);

    finalWidth = Math.max(minWidth, Math.min(maxWidth, finalWidth));
    finalHeight = Math.max(minHeight, Math.min(maxHeight, finalHeight));

    // Ensure aspect ratio is maintained after constraints
    if (finalWidth / finalHeight > bookAspectRatio) {
      finalWidth = finalHeight * bookAspectRatio;
    } else {
      finalHeight = finalWidth / bookAspectRatio;
    }

    // Final safety check to ensure we don't exceed available space
    if (finalHeight > availableHeight) {
      finalHeight = availableHeight;
      finalWidth = finalHeight * bookAspectRatio;
    }
    if (finalWidth > availableWidth) {
      finalWidth = availableWidth;
      finalHeight = finalWidth / bookAspectRatio;
    }

    // Calculate scale for perspective and other effects
    const baseWidth = 640;
    const scale = finalWidth / baseWidth;

    setBookDimensions({
      width: Math.round(finalWidth),
      height: Math.round(finalHeight),
      scale: Math.max(0.3, Math.min(2, scale))
    });

    // Update CSS custom properties
    document.documentElement.style.setProperty('--book-width', `${finalWidth}px`);
    document.documentElement.style.setProperty('--book-height', `${finalHeight}px`);
    document.documentElement.style.setProperty('--book-scale', scale.toString());

  }, []);

  useEffect(() => {
    calculateBookSize();

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateBookSize, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [calculateBookSize]);

  return bookDimensions;
};

const Book3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const pagesContainerRef = useRef<HTMLDivElement>(null);
  const [isClientSide, setIsClientSide] = useState(false);

  // Loading state management for pages
  const [pageLoadingStates, setPageLoadingStates] = useState<Record<number, boolean>>({});
  const [activeFlipTargets, setActiveFlipTargets] = useState<Set<number>>(new Set());
  
  // Use responsive book sizing
  const bookDimensions = useResponsiveBookSize();

  // Art, Design & Photography content for each page
  const artTopics = [
    {
      title: "Bauhaus Typography",
      subtitle: "Evolution of Geometric Design",
      content: "Explore the revolutionary typography movement that transformed visual communication through geometric precision, functional clarity, and modernist principles.",
      scene: "bauhaus",
      image: "/photos/bauhaus.png",
      year: "1919-1933",
      artist: "Herbert Bayer, László Moholy-Nagy"
    },
    {
      title: "Golden Ratio in Design",
      subtitle: "Mathematics of Beauty",
      content: "Unveil the mathematical principle that creates visual harmony in everything from classical architecture to modern interface design.",
      scene: "golden-ratio",
      image: "/photos/golden-ratio.png",
      year: "Ancient-Present",
      artist: "Le Corbusier, Phidias"
    },
    {
      title: "Decisive Moment",
      subtitle: "Street Photography Mastery",
      content: "Experience the philosophy behind capturing life's fleeting moments through the lens of Henri Cartier-Bresson and contemporary masters.",
      scene: "photography",
      image: "/photos/decisive-moment.png",
      year: "1930s-Present",
      artist: "Henri Cartier-Bresson, Vivian Maier"
    },
    {
      title: "Color Theory Masters",
      subtitle: "Psychology of Visual Impact",
      content: "Journey through the emotional and psychological power of color as wielded by artists from Rothko to contemporary digital designers.",
      scene: "color-theory",
      image: "/photos/color-theory.png",
      year: "1860s-Present",
      artist: "Mark Rothko, Josef Albers"
    },
    {
      title: "Abstract Expressionism",
      subtitle: "Freedom in Form",
      content: "Immerse yourself in the spontaneous energy and emotional depth that defined America's first major art movement.",
      scene: "abstract",
      image: "/photos/abstract.png",
      year: "1940s-1960s",
      artist: "Jackson Pollock, Willem de Kooning"
    },
    {
      title: "Swiss Grid System",
      subtitle: "Order Through Structure",
      content: "Master the fundamental organizing principle that brought clarity and hierarchy to editorial design and digital interfaces.",
      scene: "grid-system",
      image: "/photos/grid-system.png",
      year: "1950s-Present",
      artist: "Karl Gerstner, Massimo Vignelli"
    },
    {
      title: "Surrealist Vision",
      subtitle: "Dreams Made Visual",
      content: "Enter the realm where photography and reality blend, creating impossible worlds that challenge perception and imagination.",
      scene: "surrealism",
      image: "/photos/surrealist-vision.png",
      year: "1920s-Present",
      artist: "Man Ray, Jerry Uelsmann"
    },
    {
      title: "Studio Lighting",
      subtitle: "Sculpting with Light",
      content: "Understand how master photographers shape mood, dimension, and emotion through the strategic control of light and shadow.",
      scene: "lighting",
      image: "/photos/studio-light.png",
      year: "1940s-Present",
      artist: "Richard Avedon, Annie Leibovitz"
    },
    {
      title: "Digital Art Evolution",
      subtitle: "Future of Creativity",
      content: "Witness the convergence of technology and artistry in contemporary digital installations, generative art, and interactive experiences.",
      scene: "digital",
      image: "/photos/digital-art.png",
      year: "1960s-Present",
      artist: "Casey Reas, Refik Anadol"
    }
  ];

  // Handle page content ready state
  const handlePageContentReady = useCallback((pageIndex: number) => {
    setPageLoadingStates(prev => ({
      ...prev,
      [pageIndex]: false
    }));
  }, []);

  // Enhanced flip management with loader coordination
  const setPageLoading = useCallback((pageIndex: number, loading: boolean) => {
    setPageLoadingStates(prev => ({
      ...prev,
      [pageIndex]: loading
    }));
  }, []);

  // SSR compatibility check
  useEffect(() => {
    setIsClientSide(true);
  }, []);

  // Initialize book 3D setup
  useEffect(() => {
    if (!isClientSide || !containerRef.current || !bookRef.current || !coverRef.current || !pagesContainerRef.current) return;

    const book = bookRef.current;
    const cover = coverRef.current;
    const pagesContainer = pagesContainerRef.current;
    const pages = Array.from(pagesContainer.querySelectorAll('.book-page')) as HTMLElement[];

    // Enhanced 3D perspective setup with dynamic scaling
    gsap.set(book, { 
      rotationY: -8,
      rotationX: 2,
      transformOrigin: "center center",
      transformStyle: "preserve-3d",
      perspective: `${1400 * bookDimensions.scale}px`
    });

    // Initialize all pages and cover with proper 3D setup for realistic book behavior
    gsap.set([cover, ...pages], { 
      transformOrigin: "left center",
      transformStyle: "preserve-3d",
      backfaceVisibility: "hidden"
    });

    // Set initial page states for ScrollTrigger - keep pages visible
    pages.forEach((page, index) => {
      gsap.set(page, { 
        rotationY: 0,
        opacity: 1, // Keep pages visible for ScrollTrigger
        zIndex: artTopics.length - index,
        visibility: 'visible' // Ensure pages are always visible
      });
    });

    // Cover initial state - ensure it's visible
    gsap.set(cover, { 
      rotationY: 0,
      opacity: 1,
      zIndex: artTopics.length + 1,
      visibility: 'visible'
    });

    console.log('Book 3D setup initialized for ScrollTrigger animations');

  }, [isClientSide, artTopics.length, bookDimensions.scale]);

  // Render nothing on server side
  if (!isClientSide) {
    return <div className="w-full h-full bg-gradient-to-b from-zinc-50 to-stone-100"></div>;
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
      style={{ overflow: 'visible', clipPath: 'none' }}
    >
      <div 
        ref={bookRef}
        className="book-container relative"
        style={{ 
          perspective: `${1600 * bookDimensions.scale}px`,
          perspectiveOrigin: 'center center',
          overflow: 'visible',
          clipPath: 'none'
        }}
      >
        {/* Book Base with enhanced shadows - always visible */}
        <div 
          className="book-base relative bg-stone-50 rounded-r-lg shadow-2xl transition-all duration-300 ease-out"
          style={{ 
            width: `${bookDimensions.width}px`,
            height: `${bookDimensions.height}px`,
            transformStyle: 'preserve-3d',
            boxShadow: `0 ${25 * bookDimensions.scale}px ${50 * bookDimensions.scale}px rgba(0,0,0,0.2), 0 ${10 * bookDimensions.scale}px ${20 * bookDimensions.scale}px rgba(0,0,0,0.1)`,
            opacity: 1,
            visibility: 'visible',
            zIndex: 1,
            overflow: 'visible',
            clipPath: 'none'
          }}
        >
          {/* Premium Art Book Cover */}
          <div 
            ref={coverRef}
            className="book-cover absolute inset-0 z-10"
            style={{ 
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              opacity: 1,
              visibility: 'visible',
              overflow: 'visible',
              clipPath: 'none'
            }}
          >
            {/* Front Face */}
            <div className="cover-front absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-200 rounded-lg shadow-lg border border-stone-300" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)', width: '100%', height: '100%' }}>
              <div className="absolute inset-8 border border-zinc-200 rounded-sm" style={{ overflow: 'visible', clipPath: 'none' }}>
                <div className="flex flex-col items-center justify-center h-full text-zinc-800" style={{ overflow: 'visible', clipPath: 'none' }}>
                  {/* Minimalist Title */}
                  <div className="text-center mb-8" style={{ overflow: 'visible', clipPath: 'none' }}>
                    <h1 className="font-display text-4xl md:text-5xl font-light mb-3 tracking-wider">
                      ARTISTRY
                    </h1>
                    <div className="w-24 h-px bg-zinc-400 mx-auto mb-4"></div>
                    <p className="font-body text-sm md:text-base text-zinc-600 tracking-wide uppercase">
                      Art • Design • Photography
                    </p>
                  </div>
                  {/* Geometric Logo Mark */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24" style={{ overflow: 'visible', clipPath: 'none' }}>
                    <div className="absolute inset-0 border-2 border-zinc-400 transform rotate-45"></div>
                    <div className="absolute inset-3 border border-zinc-500 transform -rotate-45"></div>
                    <div className="absolute inset-6 bg-zinc-600 rounded-full"></div>
                  </div>
                  {/* Subtitle */}
                  <div className="mt-8 text-center" style={{ overflow: 'visible', clipPath: 'none' }}>
                    <p className="font-body text-xs text-zinc-500 tracking-widest uppercase">
                      A Curated Journey
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Inside Face */}
            <div className="cover-inside absolute inset-0 bg-stone-100 rounded-lg border border-stone-200 flex flex-col items-center justify-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', width: '100%', height: '100%' }}>
              <div className="text-center px-8">
                <h2 className="font-display text-2xl text-stone-400 font-light mb-2 tracking-wider">Inside Cover</h2>
                <p className="font-body text-sm text-stone-400">Welcome to the curated journey of Art, Design, and Photography.</p>
              </div>
            </div>
          </div>

          {/* Pages Container - ensure it's always visible */}
          <div 
            ref={pagesContainerRef}
            className="pages-container absolute inset-0"
            style={{ 
              transformStyle: 'preserve-3d',
              opacity: 1,
              visibility: 'visible',
              zIndex: 2,
              overflow: 'visible',
              clipPath: 'none'
            }}
          >
            {artTopics.map((topic, index) => (
              <BookPage 
                key={index}
                story={topic}
                pageIndex={index}
                totalPages={artTopics.length}
                isLoading={pageLoadingStates[index] || activeFlipTargets.has(index)}
                onContentReady={() => handlePageContentReady(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book3D; 