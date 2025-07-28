"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Facebook, Twitter, Instagram } from 'lucide-react';
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

  // Interior Design Portfolio content for each page
  const interiorTopics = [
    {
      title: "Modern Living Spaces",
      subtitle: "Contemporary Comfort & Style",
      content: "Explore sophisticated residential interiors that blend clean lines, natural materials, and thoughtful functionality to create spaces that inspire daily living.",
      scene: "modern-living",
      image: "/photos/modern.jpeg",
      year: "2024",
      artist: "Studio Luxe Interiors"
    },
    {
      title: "Minimalist Interiors",
      subtitle: "Less is More Philosophy",
      content: "Discover the art of intentional design where every element serves a purpose, creating serene spaces that promote clarity and mindfulness.",
      scene: "minimalist",
      image: "/photos/minimalist.jpeg",
      year: "2024",
      artist: "Pure Design Studio"
    },
    {
      title: "Luxury Kitchens",
      subtitle: "Culinary Excellence & Design",
      content: "Experience the perfect fusion of functionality and aesthetics in kitchen spaces that serve as both culinary workshops and social gathering places.",
      scene: "luxury-kitchens",
      image: "/photos/luxury.jpeg",
      year: "2024",
      artist: "Culinary Design Group"
    },
    {
      title: "Workspace Design",
      subtitle: "Productivity Meets Comfort",
      content: "Transform work environments into inspiring spaces that enhance creativity, collaboration, and well-being through thoughtful design solutions.",
      scene: "workspace",
      image: "/photos/workspace.jpeg",
      year: "2024",
      artist: "Office Design Collective"
    },
    {
      title: "Sustainable Interiors",
      subtitle: "Eco-Conscious Design",
      content: "Embrace environmentally responsible design practices that prioritize natural materials, energy efficiency, and sustainable living principles.",
      scene: "sustainable",
      image: "/photos/sustainable.jpeg",
      year: "2024",
      artist: "Green Space Studio"
    },
    {
      title: "Lighting Concepts",
      subtitle: "Illuminating Atmosphere",
      content: "Master the art of lighting design to create mood, highlight architectural features, and transform spaces through strategic illumination.",
      scene: "lighting",
      image: "/photos/lighting.jpeg",
      year: "2024",
      artist: "Luminary Design"
    },
    {
      title: "Textile & Materiality",
      subtitle: "Tactile Design Elements",
      content: "Explore the sensory world of fabrics, textures, and materials that add depth, warmth, and character to interior environments.",
      scene: "textiles",
      image: "/photos/eclectic.png",
      year: "2024",
      artist: "Texture & Form Studio"
    },
    {
      title: "Small Space Solutions",
      subtitle: "Maximizing Minimal Footprints",
      content: "Innovative design strategies for compact living that maximize functionality while maintaining aesthetic appeal and comfort.",
      scene: "small-spaces",
      image: "/photos/scandinavian.jpeg",
      year: "2024",
      artist: "Compact Living Design"
    },
    {
      title: "Historical Inspirations",
      subtitle: "Timeless Design Elements",
      content: "Draw inspiration from classical design principles and historical periods to create spaces that honor tradition while embracing modernity.",
      scene: "historical",
      image: "/photos/historical.jpeg",
      year: "2024",
      artist: "Heritage Design Studio"
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

    // Optimized 3D perspective setup with minimal blur
    gsap.set(book, { 
      rotationY: 0, // Remove rotation to eliminate blur
      rotationX: 0, // Remove rotation to eliminate blur
      transformOrigin: "center center",
      transformStyle: "preserve-3d",
      perspective: `${1000 * bookDimensions.scale}px`, // Reduced perspective further
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
        zIndex: interiorTopics.length - index,
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
              zIndex: interiorTopics.length + 1,
      visibility: 'visible',
      // Force hardware acceleration
      force3D: true,
      // Optimize for crisp rendering
      clearProps: "transform"
    });

    console.log('Book 3D setup initialized for ScrollTrigger animations');

      }, [isClientSide, interiorTopics.length, bookDimensions.scale]);

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
      snap: 1 / (interiorTopics.length - 1),
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
        const totalPages = interiorTopics.length;
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
      }, [interiorTopics.length]);

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
            <div className="cover-front absolute inset-0 bg-white rounded-lg shadow-lg" style={{ 
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
              // Ensure crisp rendering
              imageRendering: '-webkit-optimize-contrast'
            }}>
              {/* Left Sidebar - Light green/beige */}
              <div className="absolute left-0 top-0 w-1/5 h-full" style={{
                backgroundColor: '#E3E8D7'
              }}>
                {/* Social Media Icons */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 space-y-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity duration-200" style={{ backgroundColor: '#DDE3D0' }}>
                    <Facebook className="w-4 h-4" style={{ color: '#40472D' }} />
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity duration-200" style={{ backgroundColor: '#DDE3D0' }}>
                    <Twitter className="w-4 h-4" style={{ color: '#40472D' }} />
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity duration-200" style={{ backgroundColor: '#DDE3D0' }}>
                    <Instagram className="w-4 h-4" style={{ color: '#40472D' }} />
                  </div>
                </div>
              </div>
              
              {/* Main Content Area */}
              <div className="absolute right-0 top-0 w-4/5 h-full flex items-center" style={{ 
                overflow: 'visible', 
                clipPath: 'none',
                // Optimize text rendering
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}>
                {/* Interior Image */}
                <div className="w-1/2 h-full flex items-center justify-center p-4">
                  <div className="w-full h-4/5 bg-stone-100 rounded-lg flex items-center justify-center" style={{
                    backgroundImage: 'url(/photos/cover.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    imageRendering: '-webkit-optimize-contrast'
                }}>
                    {/* Image placeholder */}
                    <div className="text-stone-400 text-sm">Interior</div>
                  </div>
                </div>
                
                {/* Text Content */}
                <div className="w-1/2 h-full flex flex-col justify-center px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4">
                  <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    <h1 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight" style={{
                      color: '#40472D',
                      // Optimize text rendering
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility',
                      // Force hardware acceleration
                      transform: 'translateZ(0)',
                      willChange: 'transform'
                    }}>
                      INTERIORS
                    </h1>
                    <p className="font-body text-xs sm:text-sm md:text-base text-stone-600 leading-relaxed" style={{
                      // Optimize text rendering
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility',
                      // Force hardware acceleration
                      transform: 'translateZ(0)',
                      willChange: 'transform',
                      color: '#757B6E'
                    }}>
                      Residential • Commercial • Conceptual
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Inside Face */}
            <div className="cover-inside absolute inset-0 bg-stone-100 rounded-lg border border-stone-200 flex flex-col items-center justify-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', width: '100%', height: '100%' }}>
              <div className="text-center px-4 sm:px-6 md:px-8">
                <h2 className="font-display text-lg sm:text-xl md:text-2xl text-stone-400 font-light mb-1 sm:mb-2 tracking-wider">Inside Cover</h2>
                <p className="font-body text-xs sm:text-sm text-stone-400">Welcome to the curated journey of Art, Design, and Photography.</p>
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
                    {interiorTopics.map((topic, index) => (
              <BookPage 
                key={index}
                story={topic}
                pageIndex={index}
            totalPages={interiorTopics.length}
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