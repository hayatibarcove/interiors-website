"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Book3D from './Book3D';
import ContactSection from '../ContactSection';
import { useBookContext } from '../../contexts/BookContext';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Animation configuration constants
const ANIMATION_CONFIG = {
  // Timing constants
  COVER_DURATION: 0.08,
  CONTENT_PHASE_RATIO: 0.6,
  FLIP_PHASE_RATIO: 0.4,
  
  // Easing functions
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
  const { setCurrentPage, isAutoScrolling, isSmartScrolling } = useBookContext();

  useEffect(() => {
    if (!containerRef.current || !bookContainerRef.current) return;

    const container = containerRef.current;

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

      // Set initial states for all content elements
      pages.forEach((page, index) => {
        const contentElements = page.querySelectorAll('.year-badge, .page-title, .page-subtitle, .page-content, .artist-name, .page-number, img');
        console.log(`Setting initial state for page ${index}, found ${contentElements.length} content elements`);
        
        gsap.set(contentElements, { 
          ...ANIMATION_CONFIG.CONTENT.INITIAL,
          clearProps: "transform"
        });
      });

      // Ensure book base remains visible throughout animations
      gsap.set(bookBase, {
        opacity: 1,
        visibility: 'visible',
        zIndex: 1
      });

      // Define contact threshold
      const contactThreshold = 0.92;
      
      // Create unified master timeline
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          id: 'book-animation',
          trigger: container,
          start: "top top",
          end: `+=${window.innerHeight * contactThreshold}`,
          scrub: ANIMATION_CONFIG.SCRUB,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          fastScrollEnd: true,
          preventOverlaps: true,
          onUpdate: (self) => {
            if (isSmartScrolling) {
              return;
            }

            const progress = self.progress;
            
            // Prevent scrolling beyond contact threshold
            if (progress >= contactThreshold) {
              const scrollPosition = window.scrollY;
              const maxScrollPosition = self.start + (self.end - self.start) * contactThreshold;
              
              if (scrollPosition > maxScrollPosition) {
                window.scrollTo(0, maxScrollPosition);
              }
            }
            
            // Update progress indicators
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

            // Calculate current page based on progress
            const pagesProgress = 0.84;
            const progressPerPage = pagesProgress / totalPages;
            const pageProgress = Math.max(0, (progress - 0.08) / progressPerPage);
            const currentPageIndex = Math.min(Math.floor(pageProgress), totalPages - 1);
            setCurrentPage(currentPageIndex);

            // Handle contact section visibility
            const fadeStartThreshold = 0.85;
            
            const contactSection = document.querySelector('.contact-section');
            if (contactSection) {
              if (progress >= fadeStartThreshold && progress < contactThreshold) {
                const fadeProgress = (progress - fadeStartThreshold) / (contactThreshold - fadeStartThreshold);
                gsap.set(contactSection, { 
                  opacity: fadeProgress,
                  visibility: 'visible',
                  pointerEvents: fadeProgress > 0.5 ? 'auto' : 'none'
                });
              } else if (progress >= contactThreshold) {
                gsap.set(contactSection, { 
                  opacity: 1,
                  visibility: 'visible',
                  pointerEvents: 'auto'
                });
                
                const contactElements = contactSection.querySelectorAll('.contact-element');
                if (contactElements.length > 0) {
                  gsap.to(contactElements, {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    stagger: 0.1,
                    ease: "power2.out"
                  });
                }
              } else {
                gsap.set(contactSection, { 
                  opacity: 0,
                  visibility: 'hidden',
                  pointerEvents: 'none'
                });
                
                const contactElements = contactSection.querySelectorAll('.contact-element');
                if (contactElements.length > 0) {
                  gsap.set(contactElements, {
                    opacity: 0,
                    y: 20
                  });
                }
              }
            }
          },
          onEnter: () => {
            console.log('ScrollTrigger entered - animations active');
          },
          onLeave: () => {
            console.log('ScrollTrigger left - animations paused');
          },
          onRefresh: () => {
            if (process.env.NODE_ENV === 'development') {
              console.log('ScrollTrigger refreshed - timeline updated');
            }
          }
        }
      });

      // Store timeline reference for cleanup
      timelineRef.current = masterTimeline;

      // Phase 1: Cover opens (0% to 8%)
      masterTimeline.to('.book-cover', {
        rotationY: -180,
        transformOrigin: 'left center',
        duration: ANIMATION_CONFIG.COVER_DURATION,
        ease: ANIMATION_CONFIG.EASING.COVER
      }, 0);

      masterTimeline.fromTo('.cover-inside', {
        opacity: 0.7
      }, {
        opacity: 1,
        duration: ANIMATION_CONFIG.COVER_DURATION * 0.7,
        ease: 'power1.out'
      }, 0.04);

      masterTimeline.fromTo('.book-page[data-page="0"]', {
        opacity: 0
      }, {
        opacity: 1,
        duration: ANIMATION_CONFIG.COVER_DURATION * 0.7,
        ease: 'power1.out'
      }, ANIMATION_CONFIG.COVER_DURATION - 0.02);

      // Phase 2: Pages with unified content animations (8% to 92%)
      const totalPages = pages.length;
      const pagesProgress = 0.84;
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

        // Add content animations
        contentAnimations.forEach(({ selector, stagger }) => {
          if (isAutoScrolling) {
            masterTimeline.fromTo(
              `.book-page[data-page="${pageIndex}"] ${selector}`,
              ANIMATION_CONFIG.CONTENT.INITIAL,
              {
                ...ANIMATION_CONFIG.CONTENT.FINAL,
                duration: contentDuration * 0.25,
                ease: ANIMATION_CONFIG.EASING.CONTENT
              },
              startProgress + (contentDuration * stagger)
            );
          } else {
            masterTimeline.fromTo(
              `.book-page[data-page="${pageIndex}"] ${selector}`,
              ANIMATION_CONFIG.CONTENT.INITIAL,
              {
                ...ANIMATION_CONFIG.CONTENT.FINAL,
                duration: contentDuration * 0.4,
                ease: ANIMATION_CONFIG.EASING.CONTENT
              },
              startProgress + (contentDuration * stagger)
            );
          }
        });

        const contentCompletionDelay = contentDuration * 0.1;

        // REALISTIC BOOK PAGE FLIP ANIMATION
        masterTimeline.set(`.book-page[data-page="${pageIndex}"]`, {
          opacity: 1,
          visibility: 'visible',
          transformOrigin: 'left center'
        }, flipStartProgress + contentCompletionDelay);

        masterTimeline.to(`.book-page[data-page="${pageIndex}"]`, {
          rotationX: 0,
          rotationY: -15,
          duration: flipDuration * 0.2,
          ease: "power2.out"
        }, flipStartProgress + contentCompletionDelay + flipDuration * 0.05);

        masterTimeline.to(`.book-page[data-page="${pageIndex}"]`, {
          rotationY: -180,
          rotationX: 0,
          duration: flipDuration * 0.5,
          ease: "power2.inOut"
        }, flipStartProgress + contentCompletionDelay + flipDuration * 0.25);

        masterTimeline.set(`.book-page[data-page="${pageIndex}"] > div:last-child`, {
          opacity: 1,
          visibility: 'visible',
          backfaceVisibility: 'visible'
        }, flipStartProgress + contentCompletionDelay + flipDuration * 0.75);

        masterTimeline.to(`.book-page[data-page="${pageIndex}"]`, {
          rotationX: 0,
          rotationY: -180,
          duration: flipDuration * 0.25,
          ease: "power2.out"
        }, flipStartProgress + contentCompletionDelay + flipDuration * 0.75);

        // REVERSE ANIMATION
        masterTimeline.set(`.book-page[data-page="${pageIndex}"] > div:last-child`, {
          opacity: 0,
          visibility: 'hidden',
          backfaceVisibility: 'hidden'
        }, flipStartProgress + contentCompletionDelay + flipDuration * 0.25 - 0.001);

        // Add subtle book movement for realism
        masterTimeline.to('.book-base', {
          rotationY: -1,
          duration: flipDuration * 0.4,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1
        }, flipStartProgress + contentCompletionDelay + flipDuration * 0.3);
      };

      // Apply unified animations to all pages
      for (let i = 0; i < totalPages; i++) {
        const startProgress = 0.08 + (i * progressPerPage);
        createPageAnimations(i, startProgress, progressPerPage);
      }

      // Add subtle book breathing animation
      gsap.to('.book-container', {
        y: -2,
        duration: 6,
        ease: ANIMATION_CONFIG.EASING.BREATHING,
        yoyo: true,
        repeat: -1,
        overwrite: "auto"
      });

      // Add sophisticated book closing animation
      masterTimeline.to('.book-container', {
        scale: 0.95,
        y: -5,
        rotationY: -2,
        duration: 0.3,
        ease: "power2.out"
      }, 0.85);

      masterTimeline.to('.book-container', {
        scale: 0.8,
        y: -20,
        rotationY: -8,
        opacity: 0.6,
        duration: 0.3,
        ease: "power2.inOut"
      }, 0.88);

      masterTimeline.to('.book-container', {
        scale: 0.65,
        y: -40,
        rotationY: -12,
        opacity: 0.4,
        duration: 0.2,
        ease: "power2.in"
      }, 0.91);

      // Reverse animations for scrolling back up
      masterTimeline.to('.book-container', {
        scale: 0.8,
        y: -20,
        rotationY: -8,
        opacity: 0.6,
        duration: 0.2,
        ease: "power2.out"
      }, 0.91);

      masterTimeline.to('.book-container', {
        scale: 0.95,
        y: -5,
        rotationY: -2,
        duration: 0.3,
        ease: "power2.out"
      }, 0.88);

      masterTimeline.to('.book-container', {
        scale: 1,
        y: 0,
        rotationY: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      }, 0.85);

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
  }, [isAutoScrolling, isSmartScrolling, setCurrentPage]);

  return (
    <div 
      ref={containerRef}
      className="scroll-container"
      style={{ 
        height: '600vh',
        position: 'relative',
        willChange: 'transform'
      }}
    >
      <div 
        ref={bookContainerRef}
        className="sticky top-0 h-screen flex items-center justify-center relative z-10"
        style={{ willChange: 'transform' }}
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