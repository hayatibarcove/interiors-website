"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import BookPage from './BookPage';

// Book3D component props interface
interface Book3DProps {
  scrollProgress: number;
  scrollDirection: number;
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

const Book3D: React.FC<Book3DProps> = ({ scrollProgress, scrollDirection }) => {
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

    // Initialize all pages and cover with proper 3D setup
    gsap.set([cover, ...pages], { 
      transformOrigin: "left center",
      transformStyle: "preserve-3d",
      backfaceVisibility: "hidden"
    });

    // Set initial page states
    pages.forEach((page, index) => {
      gsap.set(page, { 
        rotationY: 0,
        opacity: 0,
        zIndex: artTopics.length - index
      });
    });

    // Cover initial state
    gsap.set(cover, { 
      rotationY: 0,
      opacity: 1,
      zIndex: artTopics.length + 1
    });

    // Enhanced book breathing animation
    gsap.to(book, {
      scale: 1.003,
      rotationY: -7,
      duration: 8,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    });

  }, [isClientSide, artTopics.length, bookDimensions.scale]);

  // Handle scroll-based page flipping
  useEffect(() => {
    if (!isClientSide || !coverRef.current || !pagesContainerRef.current) return;

    const cover = coverRef.current;
    const pagesContainer = pagesContainerRef.current;
    const pages = Array.from(pagesContainer.querySelectorAll('.book-page')) as HTMLElement[];

    const handlePageFlips = (progress: number, direction: number) => {
      const totalElements = artTopics.length + 1; // +1 for cover
      
      // Update progress indicators
      const progressBars = document.querySelectorAll('.page-progress');
      progressBars.forEach((bar, index) => {
        const pageProgress = Math.max(0, Math.min(1, (progress * totalElements) - index));
        (bar as HTMLElement).style.height = `${pageProgress * 100}%`;
      });

      // Hide scroll instruction
      if (progress > 0.02) {
        const scrollInstruction = document.querySelector('.fullscreen-scroll-instruction');
        if (scrollInstruction) {
          gsap.to(scrollInstruction, { opacity: 0, duration: 0.3 });
        }
      } else {
        const scrollInstruction = document.querySelector('.fullscreen-scroll-instruction');
        if (scrollInstruction) {
          gsap.to(scrollInstruction, { opacity: 1, duration: 0.3 });
        }
      }
      
      // Handle cover flip
      if (progress > 0.05) {
        if (cover.getAttribute('data-flipped') !== 'true') {
          setActiveFlipTargets(prev => new Set(prev).add(-1));
          flipElementToDirection(cover, true, direction, () => {
            setActiveFlipTargets(prev => {
              const newSet = new Set(prev);
              newSet.delete(-1);
              return newSet;
            });
          });
          cover.setAttribute('data-flipped', 'true');
          gsap.to(pages, { opacity: 1, duration: 0.3, stagger: 0.02 });
        }
      } else {
        if (cover.getAttribute('data-flipped') === 'true') {
          setActiveFlipTargets(prev => new Set(prev).add(-1));
          flipElementToDirection(cover, false, direction, () => {
            setActiveFlipTargets(prev => {
              const newSet = new Set(prev);
              newSet.delete(-1);
              return newSet;
            });
          });
          cover.setAttribute('data-flipped', 'false');
          gsap.to(pages, { opacity: 0, duration: 0.3 });
        }
      }

      // Handle individual page flips
      pages.forEach((page, index) => {
        const pageThreshold = (index + 1) / totalElements;
        const shouldBeFlipped = progress > pageThreshold;
        const isCurrentlyFlipped = page.getAttribute('data-flipped') === 'true';
        
        if (shouldBeFlipped !== isCurrentlyFlipped) {
          setPageLoading(index, true);
          setActiveFlipTargets(prev => new Set(prev).add(index));
          
          flipElementToDirection(page, shouldBeFlipped, direction, () => {
            setActiveFlipTargets(prev => {
              const newSet = new Set(prev);
              newSet.delete(index);
              return newSet;
            });
            
            if (shouldBeFlipped) {
              animatePageContent(page);
            }
          });
          
          page.setAttribute('data-flipped', shouldBeFlipped.toString());
        }
      });
    };

    // Direction-aware flip function
    const flipElementToDirection = (element: HTMLElement, 
      shouldFlip: boolean, 
      scrollDirection: number,
      onComplete?: () => void
    ) => {
      gsap.set(element, { 
        transformOrigin: "left center",
        transformStyle: "preserve-3d"
      });

      const targetRotation = shouldFlip ? -180 : 0;

      const flipTimeline = gsap.timeline({
        onComplete: () => {
          gsap.set(element, { 
            rotationY: targetRotation,
            rotationX: 0
          });
          onComplete?.();
        }
      });

      flipTimeline.to(element, {
        rotationY: targetRotation,
        duration: 0.8,
        ease: "power2.inOut",
        onStart: () => {
          gsap.to(element, {
            rotationX: shouldFlip ? 3 : 0,
            duration: 0.4,
            ease: "power1.inOut",
            yoyo: true,
            repeat: 1
          });
        }
      });
    };

    // Animate page content reveal
    const animatePageContent = (page: HTMLElement) => {
      const artScene = page.querySelector('.art-scene, .minimal-scene');
      if (artScene) {
        gsap.fromTo(artScene.children, 
          { y: 15, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.6,
            stagger: 0.05,
            ease: "back.out(1.2)",
            delay: 0.2
          }
        );
      }
    };

    // Apply page flips based on scroll progress
    handlePageFlips(scrollProgress, scrollDirection);

  }, [scrollProgress, scrollDirection, isClientSide, artTopics.length]);

  // Render nothing on server side
  if (!isClientSide) {
    return <div className="w-full h-full bg-gradient-to-b from-zinc-50 to-stone-100"></div>;
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
    >
      <div 
        ref={bookRef}
        className="book-container relative"
        style={{ 
          perspective: `${1600 * bookDimensions.scale}px`,
          perspectiveOrigin: 'center center'
        }}
      >
        {/* Book Base with enhanced shadows */}
        <div 
          className="book-base relative bg-stone-50 rounded-r-lg shadow-2xl transition-all duration-300 ease-out"
          style={{ 
            width: `${bookDimensions.width}px`,
            height: `${bookDimensions.height}px`,
            transformStyle: 'preserve-3d',
            boxShadow: `0 ${25 * bookDimensions.scale}px ${50 * bookDimensions.scale}px rgba(0,0,0,0.2), 0 ${10 * bookDimensions.scale}px ${20 * bookDimensions.scale}px rgba(0,0,0,0.1)`
          }}
        >
          {/* Premium Art Book Cover */}
          <div 
            ref={coverRef}
            className="book-cover absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-200 rounded-lg shadow-lg border border-stone-300 z-10"
            style={{ 
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="absolute inset-8 border border-zinc-200 rounded-sm">
              <div className="flex flex-col items-center justify-center h-full text-zinc-800">
                {/* Minimalist Title */}
                <div className="text-center mb-8">
                  <h1 className="font-display text-4xl md:text-5xl font-light mb-3 tracking-wider">
                    ARTISTRY
                  </h1>
                  <div className="w-24 h-px bg-zinc-400 mx-auto mb-4"></div>
                  <p className="font-body text-sm md:text-base text-zinc-600 tracking-wide uppercase">
                    Art • Design • Photography
                  </p>
                </div>
                
                {/* Geometric Logo Mark */}
                <div className="relative w-20 h-20 md:w-24 md:h-24">
                  <div className="absolute inset-0 border-2 border-zinc-400 transform rotate-45"></div>
                  <div className="absolute inset-3 border border-zinc-500 transform -rotate-45"></div>
                  <div className="absolute inset-6 bg-zinc-600 rounded-full"></div>
                </div>
                
                {/* Subtitle */}
                <div className="mt-8 text-center">
                  <p className="font-body text-xs text-zinc-500 tracking-widest uppercase">
                    A Curated Journey
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pages Container */}
          <div 
            ref={pagesContainerRef}
            className="pages-container absolute inset-0"
            style={{ transformStyle: 'preserve-3d' }}
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