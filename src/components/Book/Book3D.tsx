"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BookPage from './BookPage';
import { useBookContext } from '../../contexts/BookContext';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Custom hook for responsive book sizing
const useResponsiveBookSize = () => {
  const [bookDimensions, setBookDimensions] = useState({
    width: 640,
    height: 420,
    scale: 1
  });

  const calculateBookSize = useCallback(() => {
    if (typeof window === 'undefined') return;

    const headerHeight = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--header-height') || '88');
    const footerHeight = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--footer-height') || '52');
    const bookPadding = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--book-padding') || '24');

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const isMobile = viewportWidth <= 768;
    const isPortrait = viewportHeight > viewportWidth;
    
    const mobilePadding = isMobile ? bookPadding * 0.5 : bookPadding;
    
    const availableHeight = viewportHeight - headerHeight - footerHeight - (mobilePadding * 2);
    const availableWidth = viewportWidth - (mobilePadding * 2);

    const minAvailableHeight = isMobile ? 120 : 200;
    const minAvailableWidth = isMobile ? 240 : 320;
    
    if (availableHeight < minAvailableHeight || availableWidth < minAvailableWidth) {
      console.warn('Insufficient space for book layout');
      return;
    }

    const bookAspectRatio = 1.52;
    const mobileAspectRatio = isMobile && isPortrait ? 1.2 : (isMobile && !isPortrait ? 1.8 : bookAspectRatio);
    const finalAspectRatio = isMobile ? mobileAspectRatio : bookAspectRatio;
    
    const widthFromHeight = availableHeight * finalAspectRatio;
    const heightFromWidth = availableWidth / finalAspectRatio;
    
    let finalWidth, finalHeight;
    
    if (isMobile) {
      if (isPortrait) {
        finalHeight = availableHeight * 0.95;
        finalWidth = finalHeight * finalAspectRatio;
        if (finalWidth > availableWidth * 0.95) {
          finalWidth = availableWidth * 0.95;
          finalHeight = finalWidth / finalAspectRatio;
        }
      } else {
        finalWidth = availableWidth * 0.95;
        finalHeight = finalWidth / finalAspectRatio;
        if (finalHeight > availableHeight * 0.95) {
          finalHeight = availableHeight * 0.95;
          finalWidth = finalHeight * finalAspectRatio;
        }
      }
    } else {
      if (widthFromHeight <= availableWidth) {
        finalWidth = widthFromHeight;
        finalHeight = availableHeight;
      } else {
        finalWidth = availableWidth;
        finalHeight = heightFromWidth;
      }
    }

    const minWidth = isMobile ? Math.min(320, availableWidth * 0.95) : Math.min(320, availableWidth * 0.8);
    const maxWidth = isMobile ? Math.min(availableWidth * 0.98, availableWidth - 20) : Math.min(1000, availableWidth * 0.95);
    const minHeight = isMobile ? Math.min(220, availableHeight * 0.95) : Math.min(210, availableHeight * 0.8);
    const maxHeight = isMobile ? Math.min(availableHeight * 0.98, availableHeight - 20) : Math.min(650, availableHeight * 0.95);

    finalWidth = Math.max(minWidth, Math.min(maxWidth, finalWidth));
    finalHeight = Math.max(minHeight, Math.min(maxHeight, finalHeight));

    if (finalWidth / finalHeight > finalAspectRatio) {
      finalWidth = finalHeight * finalAspectRatio;
    } else {
      finalHeight = finalWidth / finalAspectRatio;
    }

    if (finalHeight > availableHeight) {
      finalHeight = availableHeight;
      finalWidth = finalHeight * finalAspectRatio;
    }
    if (finalWidth > availableWidth) {
      finalWidth = availableWidth;
      finalHeight = finalWidth / finalAspectRatio;
    }

    const baseWidth = 640;
    const scale = finalWidth / baseWidth;

    setBookDimensions({
      width: Math.round(finalWidth),
      height: Math.round(finalHeight),
      scale: Math.max(0.25, Math.min(isMobile ? 2.0 : 1.5, scale))
    });

    document.documentElement.style.setProperty('--book-width', `${finalWidth}px`);
    document.documentElement.style.setProperty('--book-height', `${finalHeight}px`);
    document.documentElement.style.setProperty('--book-scale', scale.toString());

  }, []);

  useEffect(() => {
    calculateBookSize();

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
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
  const { isAutoScrolling, isSmartScrolling } = useBookContext();
  
  const bookDimensions = useResponsiveBookSize();

  // Interior Design Portfolio content
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
      image: "/photos/eclectic.jpg",
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

    // Optimized 3D perspective setup
    gsap.set(book, { 
      rotationY: 0,
      rotationX: 0,
      transformOrigin: "center center",
      transformStyle: "preserve-3d",
      perspective: `${1000 * bookDimensions.scale}px`,
      force3D: true,
      backfaceVisibility: "hidden"
    });

    // Initialize all pages and cover
    gsap.set([cover, ...pages], { 
      transformOrigin: "left center",
      transformStyle: "preserve-3d",
      backfaceVisibility: "hidden",
      force3D: true,
      clearProps: "transform"
    });

    // Set initial page states
    pages.forEach((page, index) => {
      gsap.set(page, { 
        rotationY: 0,
        opacity: 1,
        zIndex: interiorTopics.length - index,
        visibility: 'visible',
        force3D: true,
        clearProps: "transform"
      });
      
      const contentElements = page.querySelectorAll('.year-badge, .page-title, .page-subtitle, .page-content, .artist-name, .page-number, img');
      gsap.set(contentElements, {
        opacity: 0,
        y: 20,
        force3D: true,
        clearProps: "transform",
        willChange: 'transform, opacity'
      });
    });

    // Cover initial state
    gsap.set(cover, { 
      rotationY: 0,
      opacity: 1,
      zIndex: interiorTopics.length + 1,
      visibility: 'visible',
      force3D: true,
      clearProps: "transform"
    });

    console.log('Book 3D setup initialized');

  }, [isClientSide, interiorTopics.length, bookDimensions.scale]);

  // Mobile-optimized ScrollTrigger setup
  const setupMobileScrollTrigger = useCallback(() => {
    if (!containerRef.current || !bookRef.current) return;

    const isMobile = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window;

    const mobileSettings = {
      scrub: isMobile ? 1.5 : 1,
      snap: 1 / (interiorTopics.length - 1),
      anticipatePin: isMobile ? 1 : 0,
      preventOverlaps: true,
      fastScrollEnd: isMobile,
      ignoreMobileResize: isMobile,
      autoRefreshEvents: isMobile ? "none" : "resize,load,orientationchange",
    };

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
        if (isSmartScrolling) {
          return;
        }

        const progress = self.progress;
        
        if (coverRef.current) {
          gsap.to(coverRef.current, {
            rotationY: progress * 180,
            duration: 0.05,
            ease: "none",
            force3D: true,
            clearProps: "transform"
          });
        }
      },
      onRefresh: () => {
        if (isMobile) {
          clearTimeout((window as Window & { scrollTriggerRefreshTimeout?: NodeJS.Timeout }).scrollTriggerRefreshTimeout);
          (window as Window & { scrollTriggerRefreshTimeout?: NodeJS.Timeout }).scrollTriggerRefreshTimeout = setTimeout(() => {
            const currentWidth = window.innerWidth;
            const currentHeight = window.innerHeight;
            
            if (!(window as Window & { lastScrollTriggerDimensions?: { width: number; height: number } }).lastScrollTriggerDimensions) {
              (window as Window & { lastScrollTriggerDimensions?: { width: number; height: number } }).lastScrollTriggerDimensions = { width: currentWidth, height: currentHeight };
              return;
            }
            
            const last = (window as Window & { lastScrollTriggerDimensions?: { width: number; height: number } }).lastScrollTriggerDimensions;
            if (last) {
              const widthChange = Math.abs(currentWidth - last.width);
              const heightChange = Math.abs(currentHeight - last.height);
              
              if (widthChange > 50 || heightChange > 50) {
                (window as Window & { lastScrollTriggerDimensions?: { width: number; height: number } }).lastScrollTriggerDimensions = { width: currentWidth, height: currentHeight };
                ScrollTrigger.refresh();
              }
            }
          }, 300);
        }
      }
    });

    if (isTouchDevice && containerRef.current) {
      (containerRef.current.style as CSSStyleDeclaration & { webkitOverflowScrolling?: string }).webkitOverflowScrolling = 'touch';
    }

    return () => {
      bookOpenTrigger.kill();
      if ((window as Window & { scrollTriggerRefreshTimeout?: NodeJS.Timeout }).scrollTriggerRefreshTimeout) {
        clearTimeout((window as Window & { scrollTriggerRefreshTimeout?: NodeJS.Timeout }).scrollTriggerRefreshTimeout);
      }
    };
  }, [interiorTopics.length, isSmartScrolling]);

  // Initialize ScrollTrigger when component mounts
  useEffect(() => {
    if (!isClientSide || !containerRef.current || !bookRef.current) return;

    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    const cleanup = setupMobileScrollTrigger();

    return () => {
      if (cleanup) cleanup();
    };
  }, [isClientSide, setupMobileScrollTrigger]);

  // Render nothing on server side
  if (!isClientSide) {
    return <div className="w-full h-full" style={{ background: 'var(--background)' }}></div>;
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
          transform: 'translateZ(0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      >
        {/* Book Base */}
        <div 
          className="book-base relative shadow-2xl transition-all duration-300 ease-out"
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
            transform: 'translateZ(0)',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            background: 'var(--secondary-background)'
          }}
        >
          {/* Book Cover */}
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
              transform: 'translateZ(0)',
              willChange: 'transform',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          >
            {/* Front Face */}
            <div className="cover-front absolute inset-0 shadow-lg" style={{ 
              backfaceVisibility: 'hidden', 
              transform: 'rotateY(0deg) translateZ(0)', 
              width: '100%', 
              height: '100%',
              willChange: 'transform',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
              imageRendering: '-webkit-optimize-contrast',
              background: 'var(--background)'
            }}>
              {/* Left Sidebar */}
              <div className="absolute left-0 top-0 w-1/5 h-full" style={{
                backgroundColor: 'var(--accent-1)'
              }}>
              </div>
              
              {/* Main Content Area */}
              <div className="absolute right-0 top-0 w-4/5 h-full flex items-center" style={{ 
                overflow: 'visible', 
                clipPath: 'none',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}>
                {/* Interior Image */}
                <div className="w-1/2 h-full flex items-center justify-center p-4">
                  <div className="w-full h-4/5 rounded-lg flex items-center justify-center" style={{
                    backgroundImage: 'url(/photos/cover.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    imageRendering: '-webkit-optimize-contrast',
                    backgroundColor: 'var(--secondary-background)'
                }}>
                    <div className="text-sm" style={{ color: 'var(--typography-secondary)' }}>Interior</div>
                  </div>
                </div>
                
                {/* Text Content */}
                <div className="w-1/2 h-full flex flex-col justify-center px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4">
                  <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    <h1 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight" style={{
                      color: 'var(--foreground)',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility',
                      transform: 'translateZ(0)',
                      willChange: 'transform'
                    }}>
                      INTERIORS
                    </h1>
                    <p className="font-body text-xs sm:text-sm md:text-base leading-relaxed" style={{
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility',
                      transform: 'translateZ(0)',
                      willChange: 'transform',
                      color: 'var(--typography-secondary)'
                    }}>
                      Residential • Commercial • Conceptual
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Inside Face */}
            <div className="cover-inside absolute inset-0 border flex flex-col items-center justify-center" style={{ 
              backfaceVisibility: 'hidden', 
              transform: 'rotateY(180deg)', 
              width: '100%', 
              height: '100%',
              background: 'var(--secondary-background)',
              borderColor: 'var(--accent-1)'
            }}>
              {/* <div className="text-center px-4 sm:px-6 md:px-8">
                <h2 className="font-display text-lg sm:text-xl md:text-2xl font-light mb-1 sm:mb-2 tracking-wider" style={{ color: 'var(--typography-secondary)' }}>Inside Cover</h2>
                <p className="font-body text-xs sm:text-sm" style={{ color: 'var(--typography-secondary)' }}>Welcome to the curated journey of Art, Design, and Photography.</p>
              </div> */}
            </div>
          </div>

          {/* Pages Container */}
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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book3D; 