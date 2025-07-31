"use client";

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

interface BookContextType {
  currentPage: number;
  totalPages: number;
  isAnimating: boolean;
  isAutoScrolling: boolean;
  scrollToLastPage: () => Promise<void>;
  scrollToContact: () => Promise<void>;
  smartScrollToContact: () => Promise<void>;
  naturalPageFlip: (targetPage: number) => Promise<void>;
  setCurrentPage: (page: number) => void;
  setIsAnimating: (animating: boolean) => void;
  setIsAutoScrolling: (autoScrolling: boolean) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const useBookContext = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBookContext must be used within a BookProvider');
  }
  return context;
};

interface BookProviderProps {
  children: React.ReactNode;
}

export const BookProvider: React.FC<BookProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const totalPages = 4; // Based on the current book structure
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Get the ScrollTrigger instance
  const getScrollTrigger = useCallback(() => {
    if (!scrollTriggerRef.current) {
      const trigger = ScrollTrigger.getById('book-animation');
      scrollTriggerRef.current = trigger || null;
    }
    
    // If still not found, try to find it by waiting a bit
    if (!scrollTriggerRef.current) {
      console.log('ScrollTrigger not found, waiting for initialization...');
      return null;
    }
    
    return scrollTriggerRef.current;
  }, []);

  // Calculate the progress for a specific page
  const getPageProgress = useCallback((pageIndex: number) => {
    const pagesProgress = 0.84; // 84% for pages (8% cover + 84% pages + 8% contact transition)
    const progressPerPage = pagesProgress / totalPages;
    return 0.08 + (pageIndex * progressPerPage); // 8% offset for cover
  }, [totalPages]);

  // Animate to a specific page
  const scrollToPage = useCallback(async (pageIndex: number): Promise<void> => {
    return new Promise((resolve) => {
      const scrollTrigger = getScrollTrigger();
      if (!scrollTrigger) {
        console.warn('ScrollTrigger not found, retrying in 100ms...');
        setTimeout(() => scrollToPage(pageIndex).then(resolve), 100);
        return;
      }

      setIsAnimating(true);
      const targetProgress = getPageProgress(pageIndex);
      
      console.log(`Scrolling to page ${pageIndex}, target progress: ${targetProgress}`);
      
      // Animate to the target progress
      gsap.to(window, {
        duration: 1.5,
        scrollTo: {
          y: scrollTrigger.start + (scrollTrigger.end - scrollTrigger.start) * targetProgress,
          offsetY: 0
        },
        ease: "power2.inOut",
        onComplete: () => {
          setCurrentPage(pageIndex);
          setIsAnimating(false);
          resolve();
        }
      });
    });
  }, [getScrollTrigger, getPageProgress]);

  // Scroll to the last page
  const scrollToLastPage = useCallback(async (): Promise<void> => {
    const lastPageIndex = totalPages - 1;
    await scrollToPage(lastPageIndex);
  }, [scrollToPage, totalPages]);

  // Scroll directly to contact section
  const scrollToContact = useCallback(async (): Promise<void> => {
    return new Promise((resolve) => {
      const scrollTrigger = getScrollTrigger();
      if (!scrollTrigger) {
        console.warn('ScrollTrigger not found, retrying in 100ms...');
        setTimeout(() => scrollToContact().then(resolve), 100);
        return;
      }

      setIsAnimating(true);
      const contactProgress = 0.92; // Contact section threshold
      
      console.log(`Scrolling to contact section, target progress: ${contactProgress}`);
      
      gsap.to(window, {
        duration: 2,
        scrollTo: {
          y: scrollTrigger.start + (scrollTrigger.end - scrollTrigger.start) * contactProgress,
          offsetY: 0
        },
        ease: "power2.inOut",
        onComplete: () => {
          setCurrentPage(totalPages);
          setIsAnimating(false);
          resolve();
        }
      });
    });
  }, [getScrollTrigger, totalPages]);

  // Disable scroll input during animations
  const disableScrollInput = useCallback(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.pointerEvents = 'none';
  }, []);

  // Enable scroll input after animations
  const enableScrollInput = useCallback(() => {
    document.body.style.overflow = '';
    document.body.style.pointerEvents = '';
  }, []);

  // Natural page flip with realistic timing and overlapping delays
  const naturalPageFlip = useCallback(async (targetPage: number): Promise<void> => {
    return new Promise((resolve) => {
      const scrollTrigger = getScrollTrigger();
      if (!scrollTrigger) {
        console.warn('ScrollTrigger not found, retrying in 100ms...');
        setTimeout(() => naturalPageFlip(targetPage).then(resolve), 100);
        return;
      }

      setIsAnimating(true);
      setIsAutoScrolling(true);
      disableScrollInput();

      console.log(`Starting natural page flip to page ${targetPage}`);
      
      // Calculate the target progress
      const targetProgress = getPageProgress(targetPage);
      
      // If flipping multiple pages, use overlapping delays for realistic effect
      if (Math.abs(targetPage - currentPage) > 1) {
        console.log(`Flipping ${Math.abs(targetPage - currentPage)} pages with overlapping delays`);
        
        // Create a timeline for multiple page flips
        const tl = gsap.timeline({
          onComplete: () => {
            setCurrentPage(targetPage);
            setIsAnimating(false);
            setIsAutoScrolling(false);
            enableScrollInput();
            resolve();
          },
          onInterrupt: () => {
            setIsAnimating(false);
            setIsAutoScrolling(false);
            enableScrollInput();
            resolve();
          }
        });
        
        // Add overlapping page flip animations
        const pagesToFlip = Math.abs(targetPage - currentPage);
        const delayPerPage = 0.3; // 300ms delay between page flips
        
        for (let i = 1; i <= pagesToFlip; i++) {
          const pageIndex = currentPage + (targetPage > currentPage ? i : -i);
          const pageProgress = getPageProgress(pageIndex);
          
          tl.to(window, {
            duration: 1.2, // Shorter duration for individual page flips
            scrollTo: {
              y: scrollTrigger.start + (scrollTrigger.end - scrollTrigger.start) * pageProgress,
              offsetY: 0
            },
            ease: "power1.inOut",
          }, i * delayPerPage);
        }
      } else {
        // Single page flip with natural easing
        gsap.to(window, {
          duration: 2.5, // Longer duration for more natural feel
          scrollTo: {
            y: scrollTrigger.start + (scrollTrigger.end - scrollTrigger.start) * targetProgress,
            offsetY: 0
          },
          ease: "power1.inOut", // Natural page turning easing
          onComplete: () => {
            setCurrentPage(targetPage);
            setIsAnimating(false);
            setIsAutoScrolling(false);
            enableScrollInput();
            resolve();
          },
          onInterrupt: () => {
            // Cleanup if animation is interrupted
            setIsAnimating(false);
            setIsAutoScrolling(false);
            enableScrollInput();
            resolve();
          }
        });
      }
    });
  }, [getScrollTrigger, getPageProgress, disableScrollInput, enableScrollInput, currentPage]);

  // Smart scroll: go to last page first, then to contact
  const smartScrollToContact = useCallback(async (): Promise<void> => {
    if (isAnimating) {
      console.log('Animation already in progress, ignoring request');
      return;
    }

    setIsAnimating(true);
    
    try {
      // If not on the last page, use natural page flip to last page first
      if (currentPage < totalPages - 1) {
        console.log('Using natural page flip to last page...');
        await naturalPageFlip(totalPages - 1);
        
        // Wait a bit for the page flip animation to complete
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Then scroll to contact section
      console.log('Scrolling to contact section...');
      await scrollToContact();
      
    } catch (error) {
      console.error('Error during smart scroll:', error);
      // Cleanup on error
      setIsAnimating(false);
      setIsAutoScrolling(false);
      enableScrollInput();
    } finally {
      setIsAnimating(false);
    }
  }, [currentPage, totalPages, isAnimating, naturalPageFlip, scrollToContact, enableScrollInput]);

  const value: BookContextType = {
    currentPage,
    totalPages,
    isAnimating,
    isAutoScrolling,
    scrollToLastPage,
    scrollToContact,
    smartScrollToContact,
    naturalPageFlip,
    setCurrentPage,
    setIsAnimating,
    setIsAutoScrolling,
  };

  // Cleanup effect to ensure proper reset
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      setIsAnimating(false);
      setIsAutoScrolling(false);
      enableScrollInput();
    };
  }, [enableScrollInput]);

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
}; 