"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Book3D from './Book3D';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Animation configuration constants for consistency
const ANIMATION_CONFIG = {
  // Timing constants
  COVER_DURATION: 0.08,
  CONTENT_PHASE_RATIO: 0.7, // 70% of page time for content (longer content phase)
  FLIP_PHASE_RATIO: 0.3,    // 30% of page time for flip (shorter flip phase)
  
  // Easing functions for smooth animations
  EASING: {
    CONTENT: "power2.out",
    FLIP: "power2.inOut",
    COVER: "power2.inOut",
    BREATHING: "power1.inOut"
  },
  
  // Stagger timing for content elements
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
  PIN_SPACING: true
};

const BookAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current || !bookContainerRef.current) return;

    const container = containerRef.current;
    const bookContainer = bookContainerRef.current;

    console.log('Setting up unified ScrollTrigger animation system...');

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

      console.log(`Found ${pages.length} pages and cover, creating unified timeline...`);

      // Clean up any existing timelines
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // Set initial states for all content elements with performance optimizations
      pages.forEach((page, index) => {
        const contentElements = page.querySelectorAll('.year-badge, .page-title, .page-subtitle, .page-content, .artist-name, .page-number, img');
        console.log(`Setting initial state for page ${index}, found ${contentElements.length} content elements`);
        
        // Use gsap.set for better performance
        gsap.set(contentElements, { 
          ...ANIMATION_CONFIG.CONTENT.INITIAL,
          clearProps: "transform" // Clear any existing transforms
        });
      });

      // Ensure book base remains visible throughout animations
      gsap.set(bookBase, {
        opacity: 1,
        visibility: 'visible',
        zIndex: 1
      });

      // Create unified master timeline with optimized ScrollTrigger
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: ANIMATION_CONFIG.SCRUB,
          pin: true,
          pinSpacing: ANIMATION_CONFIG.PIN_SPACING,
          anticipatePin: 1, // Prevent pinning glitches
          fastScrollEnd: true, // Optimize for fast scrolling
          preventOverlaps: true, // Prevent overlapping animations
          onUpdate: (self) => {
            const progress = self.progress;
            
            // Update progress indicators smoothly
            const progressBars = document.querySelectorAll('.page-progress');
            progressBars.forEach((bar, index) => {
              const pageProgress = Math.max(0, Math.min(1, progress * 10 - index));
              gsap.set(bar as HTMLElement, { height: `${pageProgress * 100}%` });
            });

            // Smooth scroll instruction visibility
            const scrollInstruction = document.querySelector('.fullscreen-scroll-instruction');
            if (scrollInstruction) {
              gsap.set(scrollInstruction, { 
                opacity: progress > 0.02 ? 0 : 1 
              });
            }
          },
          onEnter: () => {
            console.log('ScrollTrigger entered - animations active');
          },
          onLeave: () => {
            console.log('ScrollTrigger left - animations paused');
          },
          onRefresh: () => {
            console.log('ScrollTrigger refreshed - timeline updated');
          }
        }
      });

      // Store timeline reference for cleanup
      timelineRef.current = masterTimeline;

      // Phase 1: Cover opens (0% to 8%)
      masterTimeline.to('.book-cover', {
        rotationY: -180,
        transformOrigin: 'left center', // Ensure pivot from left
        duration: ANIMATION_CONFIG.COVER_DURATION,
        ease: ANIMATION_CONFIG.EASING.COVER
      }, 0);
      // Fade in the inside cover as the cover flips (optional, for realism)
      masterTimeline.fromTo('.cover-inside', {
        opacity: 0.7
      }, {
        opacity: 1,
        duration: ANIMATION_CONFIG.COVER_DURATION * 0.7,
        ease: 'power1.out'
      }, 0.04);
      // Fade in the first page as the cover finishes flipping
      masterTimeline.fromTo('.book-page[data-page="0"]', {
        opacity: 0
      }, {
        opacity: 1,
        duration: ANIMATION_CONFIG.COVER_DURATION * 0.7,
        ease: 'power1.out'
      }, ANIMATION_CONFIG.COVER_DURATION - 0.02);

      // Phase 2: Pages with unified content animations (8% to 100%)
      const totalPages = pages.length;
      const pagesProgress = 0.92; // Remaining 92% for pages
      const progressPerPage = pagesProgress / totalPages;

      // Create unified page animation function
      const createPageAnimations = (pageIndex: number, startProgress: number, progressPerPage: number) => {
        const contentDuration = progressPerPage * ANIMATION_CONFIG.CONTENT_PHASE_RATIO;
        const flipDuration = progressPerPage * ANIMATION_CONFIG.FLIP_PHASE_RATIO;
        const flipStartProgress = startProgress + contentDuration;
        
        console.log(`Page ${pageIndex + 1}: ${(startProgress * 100).toFixed(1)}% to ${((startProgress + progressPerPage) * 100).toFixed(1)}%`);

        // Content reveal animations with unified timing
        const contentAnimations = [
          { selector: '.year-badge', stagger: ANIMATION_CONFIG.STAGGER.YEAR_BADGE },
          { selector: '.page-title', stagger: ANIMATION_CONFIG.STAGGER.TITLE },
          { selector: '.page-subtitle', stagger: ANIMATION_CONFIG.STAGGER.SUBTITLE },
          { selector: 'img', stagger: ANIMATION_CONFIG.STAGGER.IMAGE },
          { selector: '.page-content', stagger: ANIMATION_CONFIG.STAGGER.CONTENT },
          { selector: '.artist-name', stagger: ANIMATION_CONFIG.STAGGER.ARTIST },
          { selector: '.page-number', stagger: ANIMATION_CONFIG.STAGGER.PAGE_NUMBER }
        ];

        // Add content animations with consistent timing
        contentAnimations.forEach(({ selector, stagger }) => {
          masterTimeline.fromTo(
            `.book-page[data-page="${pageIndex}"] ${selector}`,
            ANIMATION_CONFIG.CONTENT.INITIAL,
            {
              ...ANIMATION_CONFIG.CONTENT.FINAL,
              duration: contentDuration * 0.3,
              ease: ANIMATION_CONFIG.EASING.CONTENT
            },
            startProgress + (contentDuration * stagger)
          );
        });

        // REALISTIC BOOK PAGE FLIP ANIMATION
        // Phase 1: Prepare page for flip (0-10% of flip duration)
        masterTimeline.set(`.book-page[data-page="${pageIndex}"]`, {
          opacity: 1,
          visibility: 'visible',
          transformOrigin: 'left center'
        }, flipStartProgress);

        // Phase 2: Initial curl effect (10-30% of flip duration)
        masterTimeline.to(`.book-page[data-page="${pageIndex}"]`, {
          rotationX: 0, // Subtle upward curl
          rotationY: -25, // Start turning the page
          duration: flipDuration * 0.2,
          ease: "power2.out"
        }, flipStartProgress + flipDuration * 0.1);

        // Phase 3: Main flip animation (30-80% of flip duration)
        masterTimeline.to(`.book-page[data-page="${pageIndex}"]`, {
          rotationY: -180, // Complete flip
          rotationX: 0, // Flatten the curl
          duration: flipDuration * 0.5,
          ease: "power2.inOut"
        }, flipStartProgress + flipDuration * 0.3);

        // Phase 4: Show page back ONLY when page is fully flipped (80% of flip duration)
        masterTimeline.set(`.book-page[data-page="${pageIndex}"] > div:last-child`, {
          opacity: 1,
          visibility: 'visible',
          backfaceVisibility: 'visible'
        }, flipStartProgress + flipDuration * 0.8);

        // Phase 5: Final settling (80-100% of flip duration)
        masterTimeline.to(`.book-page[data-page="${pageIndex}"]`, {
          rotationX: 0,
          rotationY: -180, // Ensure it stays flipped
          duration: flipDuration * 0.2,
          ease: "power2.out"
        }, flipStartProgress + flipDuration * 0.8);

        // REVERSE ANIMATION: When scrolling back up
        // Hide page back immediately when starting reverse
        masterTimeline.set(`.book-page[data-page="${pageIndex}"] > div:last-child`, {
          opacity: 0,
          visibility: 'hidden',
          backfaceVisibility: 'hidden'
        }, flipStartProgress + flipDuration * 0.3 - 0.001); // Just before main flip starts

        // Add subtle book movement for realism
        masterTimeline.to('.book-base', {
          rotationY: -1, // Slight book tilt during flip
          duration: flipDuration * 0.4,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1
        }, flipStartProgress + flipDuration * 0.3);
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
        overwrite: "auto" // Prevent overlapping breathing animations
      });

      console.log('Unified ScrollTrigger timeline created with glitch-free animations');
      
      // Performance monitoring
      let frameCount = 0;
      let lastTime = performance.now();
      
      const monitorPerformance = () => {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
          const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          if (fps < 30) {
            console.warn(`Low FPS detected: ${fps}. Consider reducing animation complexity.`);
          }
          frameCount = 0;
          lastTime = currentTime;
        }
        
        requestAnimationFrame(monitorPerformance);
      };
      
      requestAnimationFrame(monitorPerformance);
    };

    // Start the setup process with proper timing
    setTimeout(setupScrollTrigger, 200);

    return () => {
      // Clean up timelines and ScrollTrigger
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="scroll-container"
      style={{ 
        height: '600vh',
        background: 'linear-gradient(135deg, #f8f4e6 0%, #f0e6d2 100%)',
        position: 'relative',
        willChange: 'transform' // Optimize for animations
      }}
    >
      {/* Atmospheric background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-transparent to-amber-200 opacity-30"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-100 rounded-full blur-3xl opacity-5 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div 
        ref={bookContainerRef}
        className="sticky top-0 h-screen flex items-center justify-center pt-20 relative z-10"
        style={{ willChange: 'transform' }}
      >
        <Book3D />
      </div>
    </div>
  );
};

export default BookAnimation; 