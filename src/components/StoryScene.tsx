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

    const animatedElements = sceneRef.current.querySelectorAll('.scene-element');
    
    // Enhanced, context-aware animations
    gsap.fromTo(animatedElements, 
      {
        y: 8,
        opacity: 0.8,
        scale: 0.95
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "power2.out"
      }
    );

    // Subtle floating animation for interactive elements
    gsap.to(animatedElements, {
      y: -2,
      duration: 3,
      repeat: -1,
      yoyo: true,
      stagger: 0.3,
      ease: "power1.inOut"
    });

  }, [scene]);

  const renderResponsiveScene = () => {
    switch (scene) {
      case 'bauhaus':
        return (
          <div className="scene-container book-typography bg-gray-50">
            <div className="scene-content">
              <h3 className="scene-title">BAUHAUS</h3>
              <p className="scene-caption">Form Follows Function</p>
              
              <div className="scene-grid scene-grid--3col" style={{ maxWidth: '12rem' }}>
                <div className="scene-element scene-shape scene-shape--square scene-color--secondary transform rotate-45" 
                     style={{ height: 'calc(2rem * var(--book-scale, 1))' }}></div>
                <div className="scene-element scene-shape scene-shape--circle scene-color--primary" 
                     style={{ height: 'calc(2rem * var(--book-scale, 1))' }}></div>
                <div className="scene-element scene-shape scene-shape--rectangle scene-color--accent" 
                     style={{ height: 'calc(3rem * var(--book-scale, 1))' }}></div>
              </div>
              
              <div className="scene-grid scene-grid--4col" style={{ maxWidth: '8rem' }}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="scene-element scene-shape scene-shape--square scene-color--neutral" 
                       style={{ height: 'calc(1rem * var(--book-scale, 1))' }}></div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'minimalist':
        return (
          <div className="scene-container book-typography bg-white">
            <div className="scene-content">
              <div className="image-container image-container--portrait" style={{ maxWidth: '12rem', maxHeight: '16rem' }}>
                <div className="w-full h-full bg-gray-900 flex flex-col">
                  <div className="flex-1 flex items-center justify-center">
                    <h3 className="scene-title text-white">BASS</h3>
                  </div>
                  <div className="scene-element scene-color--accent" style={{ height: 'calc(3rem * var(--book-scale, 1))' }}></div>
                </div>
              </div>
              <p className="scene-caption">Saul Bass Poster Design</p>
            </div>
          </div>
        );

      case 'golden-ratio':
        return (
          <div className="scene-container book-typography bg-gray-50">
            <div className="scene-content">
              <h3 className="scene-title">GOLDEN RATIO</h3>
              <p className="scene-caption">φ = 1.618...</p>
              
              <div className="relative" style={{ width: 'calc(8rem * var(--book-scale, 1))', height: 'calc(8rem * var(--book-scale, 1))' }}>
                <div className="absolute top-0 right-0 scene-element border-2 border-gray-400" 
                     style={{ width: 'calc(5rem * var(--book-scale, 1))', height: 'calc(5rem * var(--book-scale, 1))' }}></div>
                <div className="absolute bottom-0 right-0 scene-element border-2 border-gray-500" 
                     style={{ width: 'calc(3rem * var(--book-scale, 1))', height: 'calc(3rem * var(--book-scale, 1))' }}></div>
                <div className="absolute bottom-0 left-8 scene-element border-2 border-gray-600" 
                     style={{ width: 'calc(2rem * var(--book-scale, 1))', height: 'calc(2rem * var(--book-scale, 1))' }}></div>
                
                <svg className="absolute inset-0 w-full h-full scene-element" viewBox="0 0 100 100">
                  <path
                    d="M 75 25 Q 75 75 25 75"
                    fill="none"
                    stroke="#9CA3AF"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        );

      case 'photography':
        return (
          <div className="scene-container book-typography bg-gray-100">
            <div className="scene-content">
              <h3 className="scene-title">DECISIVE MOMENT</h3>
              
              <div className="image-container image-container--landscape scene-element border-4 border-gray-800 bg-white" 
                   style={{ maxWidth: '16rem' }}>
                <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
                  {/* Viewfinder grid */}
                  <div className="absolute inset-4">
                    <div className="w-full h-full border border-dashed border-gray-400 opacity-40"></div>
                    <div className="absolute top-1/3 left-0 right-0 border-t border-dashed border-gray-400 opacity-30"></div>
                    <div className="absolute top-2/3 left-0 right-0 border-t border-dashed border-gray-400 opacity-30"></div>
                    <div className="absolute left-1/3 top-0 bottom-0 border-l border-dashed border-gray-400 opacity-30"></div>
                    <div className="absolute left-2/3 top-0 bottom-0 border-l border-dashed border-gray-400 opacity-30"></div>
                  </div>
                  
                  {/* Camera focus point */}
                  <div className="w-2 h-2 bg-red-500 rounded-full scene-element"></div>
                </div>
              </div>
              
              <p className="scene-caption">Henri Cartier-Bresson</p>
            </div>
          </div>
        );

      case 'color-theory':
        return (
          <div className="scene-container book-typography bg-white">
            <div className="scene-content">
              <h3 className="scene-title">COLOR THEORY</h3>
              <p className="scene-caption">Primary Relationships</p>
              
              <div className="relative" style={{ width: 'calc(8rem * var(--book-scale, 1))', height: 'calc(8rem * var(--book-scale, 1))' }}>
                <div className="absolute inset-0 rounded-full border-4 border-gray-200 scene-element"></div>
                
                {/* Primary colors positioned around circle */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 scene-element scene-shape scene-shape--circle scene-color--secondary" 
                     style={{ width: 'calc(1.5rem * var(--book-scale, 1))', height: 'calc(1.5rem * var(--book-scale, 1))' }}></div>
                <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2 scene-element scene-shape scene-shape--circle scene-color--primary" 
                     style={{ width: 'calc(1.5rem * var(--book-scale, 1))', height: 'calc(1.5rem * var(--book-scale, 1))' }}></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 scene-element scene-shape scene-shape--circle scene-color--accent" 
                     style={{ width: 'calc(1.5rem * var(--book-scale, 1))', height: 'calc(1.5rem * var(--book-scale, 1))' }}></div>
              </div>
            </div>
          </div>
        );

      case 'abstract':
        return (
          <div className="scene-container book-typography bg-gray-50">
            <div className="scene-content">
              <h3 className="scene-title">ABSTRACT EXPRESSIONISM</h3>
              <p className="scene-caption">Color Field Painting</p>
              
              <div className="space-y-3 w-full" style={{ maxWidth: '12rem' }}>
                <div className="scene-element scene-color--secondary opacity-80" style={{ height: 'calc(4rem * var(--book-scale, 1))' }}></div>
                <div className="scene-element scene-color--primary opacity-70" style={{ height: 'calc(5rem * var(--book-scale, 1))' }}></div>
                <div className="scene-element scene-color--accent opacity-60" style={{ height: 'calc(3rem * var(--book-scale, 1))' }}></div>
              </div>
            </div>
          </div>
        );

      case 'grid-system':
        return (
          <div className="scene-container book-typography bg-white">
            <div className="scene-content">
              <h3 className="scene-title">SWISS GRID</h3>
              <p className="scene-caption">Systematic Layout</p>
              
              <div className="scene-grid scene-grid--3col" style={{ maxWidth: '12rem' }}>
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="scene-element aspect-square border border-gray-300 bg-gray-50 flex items-center justify-center">
                    <div className="w-4 h-4 bg-gray-400 scene-element"></div>
                  </div>
                ))}
              </div>
              
              <div className="w-full h-px bg-gray-300 scene-element" style={{ maxWidth: '12rem' }}></div>
              <div className="scene-grid scene-grid--2col" style={{ maxWidth: '12rem' }}>
                <div className="scene-element aspect-[3/2] bg-gray-200"></div>
                <div className="scene-element aspect-[3/2] bg-gray-100"></div>
              </div>
            </div>
          </div>
        );

      case 'surrealism':
        return (
          <div className="scene-container book-typography bg-gradient-to-b from-blue-50 to-yellow-50">
            <div className="scene-content">
              <h3 className="scene-title">SURREALISM</h3>
              <p className="scene-caption">Dreams in Photography</p>
              
              <div className="relative" style={{ width: 'calc(12rem * var(--book-scale, 1))', height: 'calc(8rem * var(--book-scale, 1))' }}>
                {/* Floating elements */}
                <div className="absolute top-2 left-4 scene-element scene-shape scene-shape--circle scene-color--primary" 
                     style={{ width: 'calc(2rem * var(--book-scale, 1))', height: 'calc(2rem * var(--book-scale, 1))' }}></div>
                <div className="absolute top-8 right-6 scene-element scene-shape scene-shape--square scene-color--secondary transform rotate-12" 
                     style={{ width: 'calc(1.5rem * var(--book-scale, 1))', height: 'calc(1.5rem * var(--book-scale, 1))' }}></div>
                <div className="absolute bottom-4 left-8 scene-element scene-shape scene-shape--rectangle scene-color--accent" 
                     style={{ width: 'calc(3rem * var(--book-scale, 1))', height: 'calc(1rem * var(--book-scale, 1))' }}></div>
                
                {/* Impossible architecture */}
                <div className="absolute bottom-0 right-4 scene-element">
                  <div className="w-6 h-12 bg-gray-600 relative">
                    <div className="absolute -top-2 -right-2 w-8 h-2 bg-gray-400 transform -rotate-12"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'lighting':
        return (
          <div className="scene-container book-typography bg-black">
            <div className="scene-content">
              <h3 className="scene-title text-white">STUDIO LIGHTING</h3>
              <p className="scene-caption text-gray-300">Sculpting with Light</p>
              
              <div className="relative" style={{ width: 'calc(10rem * var(--book-scale, 1))', height: 'calc(6rem * var(--book-scale, 1))' }}>
                {/* Portrait silhouette */}
                <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-8 h-12 bg-gray-700 scene-element"
                     style={{ clipPath: 'ellipse(50% 70% at 50% 100%)' }}></div>
                
                {/* Light sources */}
                <div className="absolute top-2 left-2 scene-element">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="absolute inset-0 w-8 h-8 bg-yellow-200 rounded-full opacity-20 -translate-x-3 -translate-y-3"></div>
                </div>
                
                <div className="absolute top-4 right-4 scene-element">
                  <div className="w-1.5 h-1.5 bg-blue-200 rounded-full"></div>
                  <div className="absolute inset-0 w-6 h-6 bg-blue-100 rounded-full opacity-15 -translate-x-2 -translate-y-2"></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'digital':
        return (
          <div className="scene-container book-typography bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="scene-content">
              <h3 className="scene-title">DIGITAL ART</h3>
              <p className="scene-caption">Generative Design</p>
              
              <div className="scene-grid scene-grid--4col" style={{ maxWidth: '8rem' }}>
                {[...Array(16)].map((_, i) => {
                  const colors = ['bg-purple-400', 'bg-blue-400', 'bg-pink-400', 'bg-indigo-400'];
                  const sizes = ['w-full h-2', 'w-full h-3', 'w-full h-1', 'w-full h-4'];
                  return (
                    <div key={i} className={`scene-element ${colors[i % 4]} ${sizes[i % 4]} opacity-70`}></div>
                  );
                })}
              </div>
              
              <div className="flex justify-center space-x-1 mt-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="scene-element w-1 bg-gradient-to-t from-purple-400 to-blue-400 opacity-60"
                       style={{ height: `${Math.random() * 2 + 1}rem` }}></div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="scene-container book-typography bg-gray-50">
            <div className="scene-content">
              <h3 className="scene-title">ART SCENE</h3>
              <p className="scene-caption">Visual Exploration</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div ref={sceneRef} className="w-full">
      {renderResponsiveScene()}
    </div>
  );
};

export default StoryScene; 