"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

interface ObserverInstance {
  deltaX: number;
  deltaY: number;
  velocityX: number;
}

// Register GSAP plugins with SSR safety
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

interface GestureHandlerProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const GestureHandler: React.FC<GestureHandlerProps> = ({
  onSwipeLeft,
  onSwipeRight,
  onTap,
  disabled = false,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<Observer | null>(null);

  useEffect(() => {
    if (!containerRef.current || disabled || typeof window === 'undefined') return;

    const container = containerRef.current;

    // Create GSAP Observer for advanced gesture handling
    observerRef.current = Observer.create({
      target: container,
      type: "touch,pointer",
      preventDefault: true,
      dragMinimum: 10, // Minimum distance for swipe detection
      
      // Touch/swipe handling
      onPress: () => {
        // Add visual feedback on press
        gsap.to(container, {
          opacity: 0.9,
          duration: 0.1,
          ease: "power2.out"
        });
      },
      
      onRelease: (self: ObserverInstance) => {
        // Reset visual feedback
        gsap.to(container, {
          opacity: 1,
          duration: 0.3,
          ease: "back.out(1.2)"
        });

        // Handle tap if no significant movement
        const deltaX = Math.abs(self.deltaX);
        const deltaY = Math.abs(self.deltaY);
        
        if (deltaX < 10 && deltaY < 10 && onTap) {
          onTap();
          return;
        }

        // Handle swipes with momentum
        const velocity = self.velocityX;
        const distance = self.deltaX;
        
        // Swipe left (next page)
        if (distance < -50 || (distance < -20 && velocity < -300)) {
          if (onSwipeLeft) {
            // Add swipe animation feedback
            gsap.fromTo(container, 
              { x: 0 },
              { 
                x: -30,
                duration: 0.2,
                ease: "power2.out",
                yoyo: true,
                repeat: 1
              }
            );
            onSwipeLeft();
          }
        }
        // Swipe right (previous page)
        else if (distance > 50 || (distance > 20 && velocity > 300)) {
          if (onSwipeRight) {
            // Add swipe animation feedback
            gsap.fromTo(container, 
              { x: 0 },
              { 
                x: 30,
                duration: 0.2,
                ease: "power2.out",
                yoyo: true,
                repeat: 1
              }
            );
            onSwipeRight();
          }
        }
      },

      // Drag feedback during gesture
      onDrag: (self: ObserverInstance) => {
        const progress = Math.max(-1, Math.min(1, self.deltaX / 100));
        
        // Visual feedback during drag
        gsap.set(container, {
          x: progress * 20,
          rotationY: progress * 5,
          transformOrigin: "center center"
        });
      },

      onDragEnd: () => {
        // Reset drag transforms
        gsap.to(container, {
          x: 0,
          rotationY: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.kill();
      }
    };
  }, [disabled, onSwipeLeft, onSwipeRight, onTap]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full touch-none"
      style={{ 
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      {children}
    </div>
  );
};

export default GestureHandler; 