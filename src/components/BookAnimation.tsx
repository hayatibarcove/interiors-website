"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Book3D from './Book3D';

const BookAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState(0);
  const accumulatedScrollRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const isScrollingRef = useRef(false);

  // Smooth scroll progress calculation
  const handleScroll = useCallback((deltaY: number) => {
    const now = Date.now();
    const timeDelta = now - lastScrollTimeRef.current;
    lastScrollTimeRef.current = now;

    // Determine scroll direction
    const direction = deltaY > 0 ? 1 : -1;
    setScrollDirection(direction);

    // Accumulate scroll with velocity-based sensitivity
    const scrollSensitivity = 0.001; // Adjust for desired sensitivity
    const maxScrollPerFrame = 0.02; // Prevent too fast scrolling
    
    const scrollAmount = Math.min(
      Math.abs(deltaY) * scrollSensitivity,
      maxScrollPerFrame
    ) * direction;

    accumulatedScrollRef.current += scrollAmount;
    
    // Clamp between 0 and 1
    accumulatedScrollRef.current = Math.max(0, Math.min(1, accumulatedScrollRef.current));
    
    setScrollProgress(accumulatedScrollRef.current);

    // Reset scrolling flag after a delay
    clearTimeout(isScrollingRef.current as any);
    isScrollingRef.current = setTimeout(() => {
      setScrollDirection(0);
    }, 150) as any;
  }, []);

  // Set up scroll event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Wheel events (mouse scroll)
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleScroll(e.deltaY);
    };

    // Touch events (mobile scroll)
    let touchStartY = 0;
    let lastTouchY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      lastTouchY = touchStartY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const currentTouchY = e.touches[0].clientY;
      const deltaY = lastTouchY - currentTouchY;
      lastTouchY = currentTouchY;
      
      if (Math.abs(deltaY) > 1) { // Minimum threshold
        handleScroll(deltaY * 2); // Amplify touch sensitivity
      }
    };

    const handleTouchEnd = () => {
      // Optionally handle touch end
    };

    // Keyboard events for accessibility
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          e.preventDefault();
          handleScroll(100);
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          handleScroll(-100);
          break;
        case 'Home':
          e.preventDefault();
          accumulatedScrollRef.current = 0;
          setScrollProgress(0);
          break;
        case 'End':
          e.preventDefault();
          accumulatedScrollRef.current = 1;
          setScrollProgress(1);
          break;
      }
    };

    // Add event listeners
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);

    // Focus container to receive keyboard events
    container.focus();

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleScroll]);

  return (
    <div 
      ref={containerRef}
      className="fullscreen-book-container scroll-capture"
      tabIndex={0} // Make focusable for keyboard events
      style={{ outline: 'none' }} // Hide focus outline
    >
      <Book3D 
        scrollProgress={scrollProgress}
        scrollDirection={scrollDirection}
      />
    </div>
  );
};

export default BookAnimation; 