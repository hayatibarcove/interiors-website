"use client";

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Book3D from './Book3D';
import ContactSection from './ContactSection';
import { useBookContext } from '../contexts/BookContext';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Performance-optimized animation configuration
const ANIMATION_CONFIG = {
  // Timing constants - Optimized for smooth content animations
  COVER_DURATION: 0.08,
  CONTENT_PHASE_RATIO: 0.6,
  FLIP_PHASE_RATIO: 0.4,
  
  // Easing functions for smooth animations
  EASING: {
    CONTENT: "power2.out",
    FLIP: "power2.inOut",
    COVER: "power2.inOut",
    BREATHING: "power1.inOut"
  },
  
  // Stagger timing for content elements - Optimized for smooth sequential reveals
  STAGGER: {
    YEAR_BADGE: 0,
    TITLE: 0.1,
    SUBTITLE: 0.2,
    IMAGE: 0.3,
    CONTENT: 0.4,
    ARTIST: 0.5,
    PAGE_NUMBER: 0.6
  },
  
  // Animation properties
  CONTENT: {
    INITIAL: { opacity: 0, y: 20 },
    FINAL: { opacity: 1, y: 0 }
  },
  
  // Performance settings
  SCRUB: 1,
  PIN_SPACING: true,
  
  // Performance optimization settings
  PERFORMANCE: {
    DEBOUNCE_DELAY: 16, // ~60fps
    THROTTLE_DELAY: 100,
    MAX_FPS: 60,
    GPU_ACCELERATION: true
  }
};

// Performance monitoring utility
const PerformanceMonitor = {
  frameCount: 0,
  lastTime: performance.now(),
  
  start() {
    this.frameCount = 0;
    this.lastTime = performance.now();
  },
  
  update() {
    this.frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - this.lastTime >= 1000) {
      const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      if (fps < 30) {
        console.warn(`Low FPS detected: ${fps}. Consider reducing animation complexity.`);
      }
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }
};

// Debounced function utility - only used in optimizedOnUpdate
// const debounce = (func: (...args: unknown[]) => void, delay: number) => {
//   let timeoutId: NodeJS.Timeout;
//   return (...args: unknown[]) => {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => func(...args), delay);
//   };
// };

const BookAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const { setCurrentPage, isAutoScrolling, isSmartScrolling } = useBookContext();
  
  // State to track container height to prevent hydration mismatch
  const [containerHeight, setContainerHeight] = useState(1200);
  
  // Update container height after component mounts to prevent hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setContainerHeight(window.innerHeight * 2);
    }
  }, []);
  
  // Cache DOM elements for performance
  const cachedElements = useRef<{
    cover: HTMLElement | null;
    pages: HTMLElement[];
    bookBase: HTMLElement | null;
    progressBars: HTMLElement[];
    scrollInstruction: HTMLElement | null;
    contactSection: HTMLElement | null;
    contactElements: HTMLElement[];
  }>({
    cover: null,
    pages: [],
    bookBase: null,
    progressBars: [],
    scrollInstruction: null,
    contactSection: null,
    contactElements: []
  });

  // Cache DOM elements for better performance
  const cacheElements = useCallback(() => {
    if (!containerRef.current) return;
    
    cachedElements.current = {
      cover: document.querySelector('.book-cover') as HTMLElement,
      pages: Array.from(document.querySelectorAll('.book-page[data-page]')) as HTMLElement[],
      bookBase: document.querySelector('.book-base') as HTMLElement,
      progressBars: Array.from(document.querySelectorAll('.page-progress')) as HTMLElement[],
      scrollInstruction: document.querySelector('.fullscreen-scroll-instruction') as HTMLElement,
      contactSection: document.querySelector('.contact-section') as HTMLElement,
      contactElements: Array.from(document.querySelectorAll('.contact-element')) as HTMLElement[]
    };
  }, []);

    // Optimized onUpdate callback with debouncing and caching
  const optimizedOnUpdate = useCallback((self: ScrollTrigger) => {
    // Skip ScrollTrigger updates during smart scroll to prevent interference
    if (isSmartScrolling) {
      return;
    }

    const progress = self.progress;
    
    // Prevent scrolling beyond contact threshold by checking scroll position
    const contactThreshold = 0.92;
    if (progress >= contactThreshold) {
      const scrollPosition = window.scrollY;
      const maxScrollPosition = self.start + (self.end - self.start) * contactThreshold;
      
      // If scrolled beyond the contact threshold, prevent further scrolling
      if (scrollPosition > maxScrollPosition) {
        window.scrollTo(0, maxScrollPosition);
      }
    }
    
    // Update progress indicators smoothly with cached elements
    cachedElements.current.progressBars.forEach((bar, index) => {
      const pageProgress = Math.max(0, Math.min(1, progress * 10 - index));
      gsap.set(bar, { height: `${pageProgress * 100}%` });
    });

    // Smooth scroll instruction visibility
    if (cachedElements.current.scrollInstruction) {
      gsap.set(cachedElements.current.scrollInstruction, { 
        opacity: progress > 0.02 ? 0 : 1 
      });
    }

    // Calculate current page based on progress
    const pagesProgress = 0.84;
    const progressPerPage = pagesProgress / cachedElements.current.pages.length;
    const pageProgress = Math.max(0, (progress - 0.08) / progressPerPage);
    const currentPageIndex = Math.min(Math.floor(pageProgress), cachedElements.current.pages.length - 1);
    setCurrentPage(currentPageIndex);

    // Handle contact section visibility with fixed thresholds
    const fadeStartThreshold = 0.85;
    
    // Smooth fade control for contact section
    if (cachedElements.current.contactSection) {
      if (progress >= fadeStartThreshold && progress < contactThreshold) {
        // Fade in contact section gradually
        const fadeProgress = (progress - fadeStartThreshold) / (contactThreshold - fadeStartThreshold);
        gsap.set(cachedElements.current.contactSection, { 
          opacity: fadeProgress,
          visibility: 'visible',
          pointerEvents: fadeProgress > 0.5 ? 'auto' : 'none'
        });
      } else if (progress >= contactThreshold) {
        // Fully visible contact section - ensure it stays visible
        gsap.set(cachedElements.current.contactSection, { 
          opacity: 1,
          visibility: 'visible',
          pointerEvents: 'auto'
        });
        
        // Animate contact content elements when fully visible
        if (cachedElements.current.contactElements.length > 0) {
          gsap.to(cachedElements.current.contactElements, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.1,
            ease: "power2.out"
          });
        }
      } else {
        // Fade out contact section
        gsap.set(cachedElements.current.contactSection, { 
          opacity: 0,
          visibility: 'hidden',
          pointerEvents: 'none'
        });
        
        // Reset contact elements
        if (cachedElements.current.contactElements.length > 0) {
          gsap.set(cachedElements.current.contactElements, {
            opacity: 0,
            y: 20
          });
        }
      }
    }
  }, [isSmartScrolling, setCurrentPage]);

  useEffect(() => {
    if (!containerRef.current || !bookContainerRef.current) return;

    const container = containerRef.current;

    console.log('Setting up optimized ScrollTrigger animation system...');

    // Wait for book elements to be rendered
    const setupScrollTrigger = () => {
      const cover = document.querySelector('.book-cover');
      const pages = document.querySelectorAll('.book-page[data-page]');
      const bookBase = document.querySelector('.book-base');
      
      if (!cover || pages.length === 0 || !bookBase) {
        console.log('Book elements not ready, retrying...');
        setTimeout(setupScrollTrigger, 100);
        return;
      }

      console.log(`Found ${pages.length} pages and cover, creating optimized timeline...`);

      // Clean up any existing timelines and ScrollTriggers
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      
      // Kill only book-related ScrollTriggers to prevent conflicts
      ScrollTrigger.getAll().forEach(trigger => {
        // Only kill ScrollTriggers that are related to the book animation
        if (trigger.vars.id === 'book-animation' || 
            trigger.vars.trigger === container ||
            trigger.vars.trigger === bookContainerRef.current) {
          trigger.kill();
        }
      });

      // Cache DOM elements for performance
      cacheElements();

      // Set initial states for all content elements with performance optimizations
      pages.forEach((page, index) => {
        const contentElements = page.querySelectorAll('.year-badge, .page-title, .page-subtitle, .page-content, .artist-name, .page-number, img');
        console.log(`Setting initial state for page ${index}, found ${contentElements.length} content elements`);
        
        // Use gsap.set for better performance with GPU acceleration
        gsap.set(contentElements, { 
          ...ANIMATION_CONFIG.CONTENT.INITIAL,
          clearProps: "transform",
          force3D: ANIMATION_CONFIG.PERFORMANCE.GPU_ACCELERATION,
          willChange: 'transform, opacity'
        });
      });

      // Ensure book base remains visible throughout animations with GPU acceleration
      gsap.set(bookBase, {
        opacity: 1,
        visibility: 'visible',
        zIndex: 1,
        force3D: ANIMATION_CONFIG.PERFORMANCE.GPU_ACCELERATION,
        willChange: 'transform'
      });

      // Define contact threshold - this is where scrolling should stop
      // const contactThreshold = 0.92; // Used in optimizedOnUpdate
      
      // Create unified master timeline with optimized ScrollTrigger
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          id: 'book-animation',
          trigger: container,
          start: "top top",
          end: `+=${window.innerHeight * 2}`, // Match container height
          scrub: ANIMATION_CONFIG.SCRUB,
          pin: true,
          pinSpacing: true, // Enable pin spacing to push subsequent content down
          anticipatePin: 1,
          fastScrollEnd: true,
          preventOverlaps: true,
          onUpdate: optimizedOnUpdate,
          onEnter: () => {
            console.log('ScrollTrigger entered - animations active');
          },
          onLeave: () => {
            console.log('ScrollTrigger left - animations paused');
          },
          onRefresh: () => {
            // Re-cache elements after refresh
            cacheElements();
            if (process.env.NODE_ENV === 'development') {
              console.log('ScrollTrigger refreshed - timeline updated');
            }
          }
        }
      });

      // Store timeline reference for cleanup
      timelineRef.current = masterTimeline;

      // Phase 1: Cover opens (0% to 8%) with GPU acceleration
      masterTimeline.to('.book-cover', {
        rotationY: -180,
        transformOrigin: 'left center',
        duration: ANIMATION_CONFIG.COVER_DURATION,
        ease: ANIMATION_CONFIG.EASING.COVER,
        force3D: ANIMATION_CONFIG.PERFORMANCE.GPU_ACCELERATION
      }, 0);
      
      // Fade in the inside cover as the cover flips
      masterTimeline.fromTo('.cover-inside', {
        opacity: 0.7
      }, {
        opacity: 1,
        duration: ANIMATION_CONFIG.COVER_DURATION * 0.7,
        ease: 'power1.out',
        force3D: ANIMATION_CONFIG.PERFORMANCE.GPU_ACCELERATION
      }, 0.04);
      
      // Fade in the first page as the cover finishes flipping
      masterTimeline.fromTo('.book-page[data-page="0"]', {
        opacity: 0
      }, {
        opacity: 1,
        duration: ANIMATION_CONFIG.COVER_DURATION * 0.7,
        ease: 'power1.out',
        force3D: ANIMATION_CONFIG.PERFORMANCE.GPU_ACCELERATION
      }, ANIMATION_CONFIG.COVER_DURATION - 0.02);

      // Phase 2: Pages with unified content animations (8% to 92%)
      const totalPages = pages.length;
      const pagesProgress = 0.84;
      const progressPerPage = pagesProgress / totalPages;

      // Create unified page animation function with GPU optimization
      const createPageAnimations = (pageIndex: number, startProgress: number, progressPerPage: number) => {
        const contentDuration = progressPerPage * ANIMATION_CONFIG.CONTENT_PHASE_RATIO;
        const flipDuration = progressPerPage * ANIMATION_CONFIG.FLIP_PHASE_RATIO;
        const flipStartProgress = startProgress + contentDuration;
        
        console.log(`Page ${pageIndex + 1}: ${(startProgress * 100).toFixed(1)}% to ${((startProgress + progressPerPage) * 100).toFixed(1)}%`);

        // Content reveal animations with unified timing and GPU acceleration
        const contentAnimations = [
          { selector: '.year-badge', stagger: ANIMATION_CONFIG.STAGGER.YEAR_BADGE },
          { selector: '.page-title', stagger: ANIMATION_CONFIG.STAGGER.TITLE },
          { selector: '.page-subtitle', stagger: ANIMATION_CONFIG.STAGGER.SUBTITLE },
          { selector: 'img', stagger: ANIMATION_CONFIG.STAGGER.IMAGE },
          { selector: '.page-content', stagger: ANIMATION_CONFIG.STAGGER.CONTENT },
          { selector: '.artist-name', stagger: ANIMATION_CONFIG.STAGGER.ARTIST },
          { selector: '.page-number', stagger: ANIMATION_CONFIG.STAGGER.PAGE_NUMBER }
        ];

        // Add content animations with consistent timing and GPU acceleration
        contentAnimations.forEach(({ selector, stagger }) => {
          const duration = isAutoScrolling ? contentDuration * 0.25 : contentDuration * 0.4;
          
          masterTimeline.fromTo(
            `.book-page[data-page="${pageIndex}"] ${selector}`,
            ANIMATION_CONFIG.CONTENT.INITIAL,
            {
              ...ANIMATION_CONFIG.CONTENT.FINAL,
              duration,
              ease: ANIMATION_CONFIG.EASING.CONTENT,
              force3D: ANIMATION_CONFIG.PERFORMANCE.GPU_ACCELERATION,
              willChange: 'transform, opacity'
            },
            startProgress + (contentDuration * stagger)
          );
        });

        // Add a small delay before page flip to ensure content animations complete
        const contentCompletionDelay = contentDuration * 0.1;

        // REALISTIC BOOK PAGE FLIP ANIMATION - Improved timing with GPU acceleration
        // Phase 1: Prepare page for flip
        masterTimeline.set(`.book-page[data-page="${pageIndex}"]`, {
          opacity: 1,
          visibility: 'visible',
          transformOrigin: 'left center',
          force3D: ANIMATION_CONFIG.PERFORMANCE.GPU_ACCELERATION,
          willChange: 'transform'
        }, flipStartProgress + contentCompletionDelay);

        // Phase 2: Initial curl effect with GPU acceleration
        masterTimeline.to(`.book-page[data-page="${pageIndex}"]`, {
          rotationX: 0,
          rotationY: -15,
          duration: flipDuration * 0.2,
          ease: "power2.out",
          force3D: ANIMATION_CONFIG.PERFORMANCE.GPU_ACCELERATION
        }, flipStartProgress + contentCompletionDelay + flipDuration * 0.05);

        // Phase 3: Main flip animation with GPU acceleration
        masterTimeline.to(`.book-page[data-page="${pageIndex}"]`, {
          rotationY: -180,
          rotationX: 0,
          duration: flipDuration * 0.5,
          ease: "power2.inOut",
          force3D: ANIMATION_CONFIG.PERFORMANCE.GPU_ACCELERATION
        }, flipStartProgress + contentCompletionDelay + flipDuration * 0.25);

        // Phase 4: Show page back ONLY when page is fully flipped
        masterTimeline.set(`.book-page[data-page="${pageIndex}"] > div:last-child`, {
          opacity: 1,
          visibility: 'visible',
          backfaceVisibility: 'visible',
          force3D: ANIMATION_CONFIG.PERFORMANCE.GPU_ACCELERATION
        }, flipStartProgress + contentCompletionDelay + flipDuration * 0.75);

        // Phase 5: Final settling with GPU acceleration
        masterTimeline.to(`.book-page[data-page="${pageIndex}"]`, {
          rotationX: 0,
          rotationY: -180,
          duration: flipDuration * 0.25,
          ease: "power2.out",
          force3D: ANIMATION_CONFIG.PERFORMANCE.GPU_ACCELERATION
        }, flipStartProgress + contentCompletionDelay + flipDuration * 0.75);

        // REVERSE ANIMATION: When scrolling back up
        masterTimeline.set(`.book-page[data-page="${pageIndex}"] > div:last-child`, {
          opacity: 0,
          visibility: 'hidden',
          backfaceVisibility: 'hidden',
          force3D: ANIMATION_CONFIG.PERFORMANCE.GPU_ACCELERATION
        }, flipStartProgress + contentCompletionDelay + flipDuration * 0.25 - 0.001);

        // Add subtle book movement for realism with GPU acceleration
        masterTimeline.to('.book-base', {
          rotationY: -1,
          duration: flipDuration * 0.4,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
          force3D: ANIMATION_CONFIG.PERFORMANCE.GPU_ACCELERATION
        }, flipStartProgress + contentCompletionDelay + flipDuration * 0.3);
      };

      // Apply unified animations to all pages
      for (let i = 0; i < totalPages; i++) {
        const startProgress = 0.08 + (i * progressPerPage);
        createPageAnimations(i, startProgress, progressPerPage);
      }

      // Add subtle book breathing animation with performance optimization
      gsap.to('.book-container', {
        y: -2,
        duration: 6,
        ease: ANIMATION_CONFIG.EASING.BREATHING,
        yoyo: true,
        repeat: -1,
        overwrite: "auto",
        force3D: ANIMATION_CONFIG.PERFORMANCE.GPU_ACCELERATION
      });

      // Add sophisticated book closing animation for end-state transition with GPU acceleration
      // Phase 1: Start closing animation (85% to 88%)
      masterTimeline.to('.book-container', {
        scale: 0.95,
        y: -5,
        rotationY: -2,
        duration: 0.3,
        ease: "power2.out",
        force3D: ANIMATION_CONFIG.PERFORMANCE.GPU_ACCELERATION
      }, 0.85);

      // Phase 2: Continue closing (88% to 91%)
      masterTimeline.to('.book-container', {
        scale: 0.8,
        y: -20,
        rotationY: -8,
        opacity: 0.6,
        duration: 0.3,
        ease: "power2.inOut",
        force3D: ANIMATION_CONFIG.PERFORMANCE.GPU_ACCELERATION
      }, 0.88);

      // Phase 3: Final closing state (91% to 92%)
      masterTimeline.to('.book-container', {
        scale: 0.65,
        y: -40,
        rotationY: -12,
        opacity: 0.4,
        duration: 0.2,
        ease: "power2.in",
        force3D: ANIMATION_CONFIG.PERFORMANCE.GPU_ACCELERATION
      }, 0.91);

      // Reverse animations for scrolling back up with GPU acceleration
      masterTimeline.to('.book-container', {
        scale: 0.8,
        y: -20,
        rotationY: -8,
        opacity: 0.6,
        duration: 0.2,
        ease: "power2.out",
        force3D: ANIMATION_CONFIG.PERFORMANCE.GPU_ACCELERATION
      }, 0.91);

      masterTimeline.to('.book-container', {
        scale: 0.95,
        y: -5,
        rotationY: -2,
        duration: 0.3,
        ease: "power2.out",
        force3D: ANIMATION_CONFIG.PERFORMANCE.GPU_ACCELERATION
      }, 0.88);

      masterTimeline.to('.book-container', {
        scale: 1,
        y: 0,
        rotationY: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        force3D: ANIMATION_CONFIG.PERFORMANCE.GPU_ACCELERATION
      }, 0.85);

      console.log('Optimized ScrollTrigger timeline created with GPU acceleration');
      
      // Start performance monitoring
      PerformanceMonitor.start();
      
      const monitorPerformance = () => {
        PerformanceMonitor.update();
        requestAnimationFrame(monitorPerformance);
      };
      
      requestAnimationFrame(monitorPerformance);
    };

    // Start the setup process with proper timing
    setTimeout(setupScrollTrigger, 200);

    return () => {
      // Clean up timelines and book-related ScrollTriggers only
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      
      // Store refs in variables to avoid stale closure issues
      const container = containerRef.current;
      const bookContainer = bookContainerRef.current;
      
      if (typeof window !== 'undefined' && container && bookContainer) {
        ScrollTrigger.getAll().forEach(trigger => {
          // Only kill ScrollTriggers that are related to the book animation
          if (trigger.vars.id === 'book-animation' || 
              trigger.vars.trigger === container ||
              trigger.vars.trigger === bookContainer) {
            trigger.kill();
          }
        });
      }
    };
  }, [isAutoScrolling, isSmartScrolling, setCurrentPage, optimizedOnUpdate, cacheElements]);

  return (
    <div 
      ref={containerRef}
      className="scroll-container"
      style={{ 
        height: `${containerHeight}px`, // Match ScrollTrigger end position
        position: 'relative',
        willChange: 'transform' // Optimize for animations
      }}
    >
      <div 
        ref={bookContainerRef}
        className="sticky top-0 h-screen flex items-center justify-center relative z-10"
        style={{ 
          willChange: 'transform',
          transform: 'translateZ(0)' // Force GPU acceleration
        }}
      >
        <Book3D />
        <ContactSection 
          isVisible={true} 
        />
      </div>
    </div>
  );
};

export default BookAnimation; 