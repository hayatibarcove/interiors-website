"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ArtSceneProps {
  scene: string;
}

const StoryScene: React.FC<ArtSceneProps> = ({ scene }) => {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const animatedElements = sceneRef.current.querySelectorAll('.minimal-animate');
    
    // Subtle, refined animations
    gsap.to(animatedElements, {
      y: -4,
      duration: 4,
      repeat: -1,
      yoyo: true,
      stagger: 0.5,
      ease: "power1.inOut"
    });

    // Gentle hover interactions
    const interactiveElements = sceneRef.current.querySelectorAll('.minimal-hover');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        gsap.to(element, { scale: 1.02, duration: 0.3, ease: "power2.out" });
      });
      
      element.addEventListener('mouseleave', () => {
        gsap.to(element, { scale: 1, duration: 0.3, ease: "power2.out" });
      });
    });

  }, [scene]);

  const renderMinimalScene = () => {
    switch (scene) {
      case 'bauhaus':
        return (
          <div className="w-full h-80 bg-gray-50 flex items-center justify-center">
            {/* Clean Bauhaus Elements */}
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-light text-gray-800 tracking-widest">BAUHAUS</h3>
              </div>
              
              <div className="flex items-center justify-center space-x-6">
                <div className="minimal-hover w-8 h-8 bg-red-500 transform rotate-45"></div>
                <div className="minimal-hover w-8 h-8 bg-blue-600 rounded-full"></div>
                <div className="minimal-hover w-8 h-16 bg-yellow-400"></div>
              </div>
              
              <div className="grid grid-cols-4 gap-2 w-24 mx-auto">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="minimal-animate w-4 h-4 bg-gray-800"></div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'minimalist':
        return (
          <div className="w-full h-80 bg-white flex items-center justify-center">
            {/* Ultra-clean Poster Design */}
            <div className="w-48 h-64 bg-gray-900 flex flex-col">
              <div className="flex-1 flex items-center justify-center">
                <span className="text-white text-xl font-light tracking-wider minimal-animate">
                  BASS
                </span>
              </div>
              <div className="h-12 bg-orange-500 minimal-hover"></div>
            </div>
          </div>
        );

      case 'golden-ratio':
        return (
          <div className="w-full h-80 bg-gray-50 flex items-center justify-center">
            {/* Simplified Golden Ratio */}
            <div className="relative w-32 h-32">
              <div className="absolute top-0 right-0 w-20 h-20 border-2 border-gray-400 minimal-hover"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-2 border-gray-500 minimal-hover"></div>
              <div className="absolute bottom-0 left-8 w-8 h-8 border-2 border-gray-600 minimal-hover"></div>
              
              {/* Clean spiral line */}
              <svg className="absolute inset-0 w-full h-full minimal-animate" viewBox="0 0 100 100">
                <path
                  d="M 75 25 Q 75 75 25 75"
                  fill="none"
                  stroke="#9CA3AF"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </div>
        );

      case 'photography':
        return (
          <div className="w-full h-80 bg-gray-100 flex items-center justify-center">
            {/* Clean Camera Frame */}
            <div className="w-48 h-32 border-4 border-gray-800 bg-white minimal-hover">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                {/* Simple viewfinder grid */}
                <div className="relative w-24 h-16">
                  <div className="absolute inset-0 border border-dashed border-gray-400 opacity-50"></div>
                  <div className="absolute top-1/3 left-0 right-0 border-t border-dashed border-gray-400 opacity-30"></div>
                  <div className="absolute left-1/3 top-0 bottom-0 border-l border-dashed border-gray-400 opacity-30"></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'color-theory':
        return (
          <div className="w-full h-80 bg-white flex items-center justify-center">
            {/* Minimal Color Wheel */}
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full border-8 border-gray-200 minimal-hover"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-6 h-6 bg-red-500 rounded-full minimal-animate"></div>
              <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full minimal-animate"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-6 h-6 bg-yellow-500 rounded-full minimal-animate"></div>
            </div>
          </div>
        );

      case 'abstract':
        return (
          <div className="w-full h-80 bg-gray-50 flex items-center justify-center">
            {/* Clean Color Fields */}
            <div className="space-y-4 w-48">
              <div className="h-16 bg-red-400 minimal-hover opacity-80"></div>
              <div className="h-20 bg-blue-600 minimal-hover opacity-70"></div>
              <div className="h-12 bg-yellow-400 minimal-hover opacity-60"></div>
            </div>
          </div>
        );

      case 'grid-system':
        return (
          <div className="w-full h-80 bg-white flex items-center justify-center">
            {/* Clean Grid Layout */}
            <div className="grid grid-cols-3 grid-rows-3 gap-4 w-48 h-48">
              <div className="bg-red-500 minimal-hover"></div>
              <div className="bg-gray-200 minimal-hover"></div>
              <div className="bg-gray-800 minimal-hover"></div>
              <div className="bg-gray-300 minimal-hover"></div>
              <div className="bg-yellow-400 minimal-hover"></div>
              <div className="bg-gray-400 minimal-hover"></div>
              <div className="bg-blue-600 minimal-hover"></div>
              <div className="bg-gray-200 minimal-hover"></div>
              <div className="bg-green-500 minimal-hover"></div>
            </div>
          </div>
        );

      case 'surrealism':
        return (
          <div className="w-full h-80 bg-gray-100 flex items-center justify-center">
            {/* Simplified Floating Elements */}
            <div className="relative w-48 h-32">
              <div className="absolute top-4 left-8 w-6 h-6 bg-gray-800 rounded-full minimal-animate"></div>
              <div className="absolute top-12 right-12 w-8 h-4 bg-gray-600 minimal-animate"></div>
              <div className="absolute bottom-8 left-16 w-4 h-8 bg-gray-500 minimal-animate"></div>
              
              {/* Simple ground plane */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gray-300"></div>
            </div>
          </div>
        );

      case 'lighting':
        return (
          <div className="w-full h-80 bg-gray-900 flex items-center justify-center">
            {/* Clean Lighting Setup */}
            <div className="relative w-48 h-32">
              {/* Subject silhouette */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-16 bg-gray-300 minimal-hover"></div>
              
              {/* Key light */}
              <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full minimal-animate"></div>
              <div className="absolute top-6 left-6 w-12 h-12 bg-yellow-200 rounded-full opacity-20"></div>
              
              {/* Fill light */}
              <div className="absolute top-8 right-8 w-1 h-1 bg-blue-200 rounded-full minimal-animate"></div>
              <div className="absolute top-10 right-10 w-8 h-8 bg-blue-100 rounded-full opacity-10"></div>
            </div>
          </div>
        );

      case 'digital':
        return (
          <div className="w-full h-80 bg-gray-900 flex items-center justify-center">
            {/* Simple Digital Pattern */}
            <div className="grid grid-cols-6 grid-rows-4 gap-1 w-48 h-32">
              {[...Array(24)].map((_, i) => (
                <div 
                  key={i} 
                  className="minimal-animate bg-gray-600"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    backgroundColor: i % 3 === 0 ? '#60A5FA' : '#6B7280'
                  }}
                ></div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-80 bg-gray-50 flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎨</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      ref={sceneRef}
      className="minimal-scene w-full"
    >
      {renderMinimalScene()}
    </div>
  );
};

export default StoryScene; 