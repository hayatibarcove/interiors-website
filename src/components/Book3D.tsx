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
    
    // Mobile-specific adjustments
    const isMobile = viewportWidth <= 768;
    const isPortrait = viewportHeight > viewportWidth;
    
    // Adjust padding for mobile - use less padding to make book larger
    const mobilePadding = isMobile ? bookPadding * 0.5 : bookPadding;
    
    // Available space calculation with mobile considerations
    const availableHeight = viewportHeight - headerHeight - footerHeight - (mobilePadding * 2);
    const availableWidth = viewportWidth - (mobilePadding * 2);

    // Ensure minimum available space - more permissive on mobile
    const minAvailableHeight = isMobile ? 120 : 200;
    const minAvailableWidth = isMobile ? 240 : 320;
    
    if (availableHeight < minAvailableHeight || availableWidth < minAvailableWidth) {
      console.warn('Insufficient space for book layout');
      return;
    }

    // Book aspect ratio (width:height = 1.52:1 for standard book)
    const bookAspectRatio = 1.52;
    
    // Mobile-specific aspect ratio adjustments - optimize for orientation
    const mobileAspectRatio = isMobile && isPortrait ? 1.2 : (isMobile && !isPortrait ? 1.8 : bookAspectRatio);
    const finalAspectRatio = isMobile ? mobileAspectRatio : bookAspectRatio;
    
    // Calculate maximum possible dimensions while maintaining aspect ratio
    const widthFromHeight = availableHeight * finalAspectRatio;
    const heightFromWidth = availableWidth / finalAspectRatio;
    
    let finalWidth, finalHeight;
    
    // On mobile, prioritize using more space
    if (isMobile) {
      // Use more aggressive sizing on mobile
      if (isPortrait) {
        // In portrait, prioritize height usage
        finalHeight = availableHeight * 0.95;
        finalWidth = finalHeight * finalAspectRatio;
        if (finalWidth > availableWidth * 0.95) {
          finalWidth = availableWidth * 0.95;
          finalHeight = finalWidth / finalAspectRatio;
        }
      } else {
        // In landscape, prioritize width usage
        finalWidth = availableWidth * 0.95;
        finalHeight = finalWidth / finalAspectRatio;
        if (finalHeight > availableHeight * 0.95) {
          finalHeight = availableHeight * 0.95;
          finalWidth = finalHeight * finalAspectRatio;
        }
      }
    } else {
      // Desktop logic remains the same
      if (widthFromHeight <= availableWidth) {
        // Height is the limiting factor
        finalWidth = widthFromHeight;
        finalHeight = availableHeight;
      } else {
        // Width is the limiting factor
        finalWidth = availableWidth;
        finalHeight = heightFromWidth;
      }
    }

    // Mobile-specific size constraints - make book larger on mobile
    const minWidth = isMobile ? Math.min(320, availableWidth * 0.95) : Math.min(320, availableWidth * 0.8);
    const maxWidth = isMobile ? Math.min(availableWidth * 0.98, availableWidth - 20) : Math.min(1000, availableWidth * 0.95);
    const minHeight = isMobile ? Math.min(220, availableHeight * 0.95) : Math.min(210, availableHeight * 0.8);
    const maxHeight = isMobile ? Math.min(availableHeight * 0.98, availableHeight - 20) : Math.min(650, availableHeight * 0.95);

    finalWidth = Math.max(minWidth, Math.min(maxWidth, finalWidth));
    finalHeight = Math.max(minHeight, Math.min(maxHeight, finalHeight));

    // Ensure aspect ratio is maintained after constraints
    if (finalWidth / finalHeight > finalAspectRatio) {
      finalWidth = finalHeight * finalAspectRatio;
    } else {
      finalHeight = finalWidth / finalAspectRatio;
    }

    // Final safety check to ensure we don't exceed available space
    if (finalHeight > availableHeight) {
      finalHeight = availableHeight;
      finalWidth = finalHeight * finalAspectRatio;
    }
    if (finalWidth > availableWidth) {
      finalWidth = availableWidth;
      finalHeight = finalWidth / finalAspectRatio;
    }

    // Calculate scale for perspective and other effects
    const baseWidth = 640;
    const scale = finalWidth / baseWidth;

    setBookDimensions({
      width: Math.round(finalWidth),
      height: Math.round(finalHeight),
      scale: Math.max(0.25, Math.min(isMobile ? 2.0 : 1.5, scale))
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
      // Use longer debounce on mobile to reduce frequency
      const debounceTime = window.innerWidth <= 768 ? 300 : 150;
      resizeTimeout = setTimeout(calculateBookSize, debounceTime);
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

    // Optimized 3D perspective setup with reduced blur
    gsap.set(book, { 
      rotationY: -5, // Reduced rotation to minimize blur
      rotationX: 1,  // Reduced rotation to minimize blur
      transformOrigin: "center center",
      transformStyle: "preserve-3d",
      perspective: `${1200 * bookDimensions.scale}px`, // Reduced perspective
      // Force hardware acceleration
      force3D: true,
      backfaceVisibility: "hidden"
    });

    // Initialize all pages and cover with optimized 3D setup
    gsap.set([cover, ...pages], { 
      transformOrigin: "left center",
      transformStyle: "preserve-3d",
      backfaceVisibility: "hidden",
      // Force hardware acceleration
      force3D: true,
      // Optimize for crisp rendering
      clearProps: "transform"
    });

    // Set initial page states for ScrollTrigger - keep pages visible
    pages.forEach((page, index) => {
      gsap.set(page, { 
        rotationY: 0,
        opacity: 1, // Keep pages visible for ScrollTrigger
        zIndex: artTopics.length - index,
        visibility: 'visible', // Ensure pages are always visible
        // Force hardware acceleration
        force3D: true,
        // Optimize for crisp rendering
        clearProps: "transform"
      });
    });

    // Cover initial state - ensure it's visible
    gsap.set(cover, { 
      rotationY: 0,
      opacity: 1,
      zIndex: artTopics.length + 1,
      visibility: 'visible',
      // Force hardware acceleration
      force3D: true,
      // Optimize for crisp rendering
      clearProps: "transform"
    });

    console.log('Book 3D setup initialized for ScrollTrigger animations');

  }, [isClientSide, artTopics.length, bookDimensions.scale]);

  // Mobile-optimized ScrollTrigger setup
  const setupMobileScrollTrigger = useCallback(() => {
    if (!containerRef.current || !bookRef.current) return;

    // Detect mobile device
    const isMobile = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window;

    // Mobile-specific ScrollTrigger settings
    const mobileSettings = {
      // Reduce sensitivity on mobile to prevent jitter
      scrub: isMobile ? 1.5 : 1,
      // Increase snap distance for better mobile experience
      snap: 1 / (artTopics.length - 1),
      // Optimize for touch scrolling
      anticipatePin: isMobile ? 1 : 0,
      // Prevent conflicts with mobile browser UI
      preventOverlaps: true,
      // Optimize performance on mobile
      fastScrollEnd: isMobile,
      // Reduce refresh frequency on mobile
      ignoreMobileResize: isMobile,
      // Disable automatic refresh on mobile to prevent excessive calls
      autoRefreshEvents: isMobile ? "none" : "resize,load,orientationchange",
    };

    // Create ScrollTrigger for book opening animation
    const bookOpenTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: mobileSettings.scrub,
      snap: mobileSettings.snap,
      anticipatePin: mobileSettings.anticipatePin,
      preventOverlaps: mobileSettings.preventOverlaps,
      fastScrollEnd: mobileSettings.fastScrollEnd,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Book opening animation
        if (coverRef.current) {
          gsap.to(coverRef.current, {
            rotationY: progress * 180,
            duration: 0.05, // Reduced duration for smoother animation
            ease: "none",
            // Force hardware acceleration
            force3D: true,
            // Optimize for crisp rendering
            clearProps: "transform"
          });
        }

        // Calculate which page should be active
        const totalPages = artTopics.length;
        const activePageIndex = Math.floor(progress * totalPages);
        
        // Update active page state
        setActiveFlipTargets(new Set([activePageIndex]));
      },
      onRefresh: () => {
        // Only refresh on significant layout changes, not on every mobile event
        if (isMobile) {
          // Debounce refresh to prevent excessive calls
          clearTimeout((window as any).scrollTriggerRefreshTimeout);
          (window as any).scrollTriggerRefreshTimeout = setTimeout(() => {
            // Only refresh if there's a significant change
            const currentWidth = window.innerWidth;
            const currentHeight = window.innerHeight;
            
            if (!(window as any).lastScrollTriggerDimensions) {
              (window as any).lastScrollTriggerDimensions = { width: currentWidth, height: currentHeight };
              return;
            }
            
            const last = (window as any).lastScrollTriggerDimensions;
            const widthChange = Math.abs(currentWidth - last.width);
            const heightChange = Math.abs(currentHeight - last.height);
            
            // Only refresh if change is significant (more than 50px)
            if (widthChange > 50 || heightChange > 50) {
              (window as any).lastScrollTriggerDimensions = { width: currentWidth, height: currentHeight };
              ScrollTrigger.refresh();
            }
          }, 300);
        }
      }
    });

    // Mobile-specific optimizations
    if (isTouchDevice && containerRef.current) {
      // Enable smooth scrolling for touch devices
      (containerRef.current.style as any).webkitOverflowScrolling = 'touch';
    }

    return () => {
      bookOpenTrigger.kill();
      // Clean up timeout to prevent memory leaks
      if ((window as any).scrollTriggerRefreshTimeout) {
        clearTimeout((window as any).scrollTriggerRefreshTimeout);
      }
    };
  }, [artTopics.length]);

  // Initialize ScrollTrigger when component mounts
  useEffect(() => {
    if (!isClientSide || !containerRef.current || !bookRef.current) return;

    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Use mobile-optimized ScrollTrigger setup
    const cleanup = setupMobileScrollTrigger();

    return () => {
      if (cleanup) cleanup();
    };
  }, [isClientSide, setupMobileScrollTrigger]);

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
          perspective: `${1200 * bookDimensions.scale}px`,
          perspectiveOrigin: 'center center',
          overflow: 'visible',
          clipPath: 'none',
          // Force hardware acceleration
          transform: 'translateZ(0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
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
            clipPath: 'none',
            // Force hardware acceleration
            transform: 'translateZ(0)',
            willChange: 'transform',
            backfaceVisibility: 'hidden'
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
            {/* Front Face */}
            <div className="cover-front absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg shadow-lg" style={{ 
              backfaceVisibility: 'hidden', 
              transform: 'rotateY(0deg) translateZ(0)', 
              width: '100%', 
              height: '100%',
              // Force hardware acceleration
              willChange: 'transform',
              // Optimize text rendering
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
              // Background image
              backgroundImage: 'url(/photos/cover.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}>
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
              
              <div className="absolute inset-0 flex flex-col justify-between" style={{ 
                overflow: 'visible', 
                clipPath: 'none',
                // Optimize text rendering
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}>
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col items-center justify-center text-white px-8 pt-8 relative z-10" style={{ 
                  overflow: 'visible', 
                  clipPath: 'none',
                  // Optimize text rendering
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}>
                  {/* Main Title */}
                  <div className="text-center mb-6" style={{ 
                    overflow: 'visible', 
                    clipPath: 'none',
                    // Optimize text rendering
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}>
                    <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 tracking-tight text-white drop-shadow-lg" style={{
                      // Optimize text rendering
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility',
                      // Force hardware acceleration
                      transform: 'translateZ(0)',
                      willChange: 'transform'
                    }}>
                      ARTISTRY
                    </h1>
                    <div className="w-32 h-1 bg-orange-500 mx-auto mb-6 drop-shadow-lg"></div>
                    <p className="font-body text-lg md:text-xl text-zinc-100 tracking-wide uppercase font-medium drop-shadow-lg" style={{
                      // Optimize text rendering
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility',
                      // Force hardware acceleration
                      transform: 'translateZ(0)',
                      willChange: 'transform'
                    }}>
                      Art • Design • Photography
                    </p>
                  </div>
                  
                  {/* Decorative Element */}
                  <div className="relative w-16 h-16 md:w-20 md:h-20 mb-8" style={{ 
                    overflow: 'visible', 
                    clipPath: 'none',
                    // Force hardware acceleration
                    transform: 'translateZ(0)',
                    willChange: 'transform'
                  }}>
                    <div className="absolute inset-0 border-2 border-orange-500 transform rotate-45 drop-shadow-lg"></div>
                    <div className="absolute inset-2 border border-orange-400 transform -rotate-45 drop-shadow-lg"></div>
                    <div className="absolute inset-4 bg-orange-500 rounded-full drop-shadow-lg"></div>
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
              clipPath: 'none',
              // Force hardware acceleration
              transform: 'translateZ(0)',
              willChange: 'transform',
              backfaceVisibility: 'hidden'
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