"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
// import { gsap } from 'gsap';
import { BannerAnimations } from '../utils/animations';

interface IntroductionBannerProps {
  onScrollDown: () => void;
}

const IntroductionBanner: React.FC<IntroductionBannerProps> = ({ onScrollDown }) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentVideoIndex] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Debug video loading
  useEffect(() => {
    console.log('Video path:', videos[currentVideoIndex]);
    console.log('Video loaded state:', isVideoLoaded);
  }, [currentVideoIndex, isVideoLoaded]);

  // Video options - you can add more videos to the public/videos folder
  const videos = useMemo(() => [
    '/videos/banner-1.mp4' // Existing video
  ], []);

  useEffect(() => {
    if (!bannerRef.current || !contentRef.current) return;

    console.log("Initializing banner animations");

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Initial load animation
      const loadTl = BannerAnimations.loadAnimation(bannerRef.current!, contentRef.current!);

      // Scroll-triggered banner hide animation
      const hideTrigger = BannerAnimations.hideAnimation(bannerRef.current!);

      return () => {
        loadTl.kill();
        hideTrigger.kill();
      };
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [currentVideoIndex]);

  // const handleVideoChange = () => {
  //   setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  // };

  const handleScrollDown = () => {
    onScrollDown();
  };

  return (
    <section 
      ref={bannerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ 
        minHeight: '100vh',
        background: 'var(--background)'
      }}
    >
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Video element */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          onError={(e) => {
            console.error('Video loading error:', e);
            setIsVideoLoaded(false);
          }}
        >
          <source src={videos[currentVideoIndex]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        

        
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, transparent, rgba(249, 248, 243, 0.05), rgba(59, 59, 59, 0.05))'
        }} />
      </div>

      {/* Content - positioned in center on mobile, lower third on desktop */}
      <div 
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center md:justify-end h-full px-4 text-center pb-8 md:pb-32"
      >
        {/* Main title */}
        <h1 className="banner-element text-4xl md:text-6xl lg:text-6xl font-light mb-6 md:mb-8"
            style={{ color: 'var(--foreground)' }}>
          <span className="block font-medium">Design That Inspires</span>
          <span className="block font-medium">Light and Tranquility</span>
        </h1>

        {/* Subtitle - limited width for better readability */}
        <p className="banner-element text-base md:text-lg lg:text-xl font-light max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed tracking-wide px-4"
           style={{ color: 'var(--typography-secondary)' }}>
          At Luminare Studio, we believe that interior design is the art of illuminating spaces — 
          bringing light, harmony, and luxury into every environment we touch.
        </p>

        {/* Call to action */}
        <div className="banner-element mb-8 md:mb-16">
          <button
            onClick={handleScrollDown}
            className="px-6 py-3 font-medium tracking-wide rounded-full transition-all duration-300 hover:scale-105"
            style={{
              background: 'transparent',
              color: 'var(--foreground)',
              border: '2px solid var(--accent-1)',
              outline: 'none !important'
            }}
          >
            Explore Our Work
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="banner-element mt-4 md:mt-0">
          <div 
            className="scroll-indicator cursor-pointer group flex flex-col items-center"
            onClick={handleScrollDown}
          >
            {/* Enhanced scroll indicator */}
            <div className="relative w-8 h-12 border-2 rounded-full flex justify-center items-start pt-3 transition-all duration-500 ease-out"
                 style={{ borderColor: 'var(--accent-1)' }}>
              {/* Animated scroll dot */}
              <div className="w-1.5 h-2 rounded-full animate-bounce transition-all duration-300 ease-out" 
                   style={{ 
                     background: 'var(--typography-secondary)',
                     animationDuration: '2s', 
                     animationDelay: '0.5s' 
                   }} />
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 w-8 h-12 border rounded-full opacity-0 transition-opacity duration-500 ease-out"
                   style={{ borderColor: 'var(--accent-2)' }} />
            </div>
            
            {/* Enhanced text */}
            <p className="text-xs mt-4 font-light tracking-wider uppercase transition-all duration-300 ease-out"
               style={{ color: 'var(--typography-secondary)' }}>
              Scroll to Explore
            </p>
            
            {/* Subtle arrow indicator */}
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform group-hover:translate-y-1">
              <svg className="w-4 h-4 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   style={{ color: 'var(--typography-secondary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal decorative elements */}
      <div className="absolute top-32 left-32 w-24 h-24 rounded-full opacity-5 blur-2xl animate-pulse"
           style={{ background: 'var(--accent-1)' }} />
      <div className="absolute bottom-32 right-32 w-32 h-32 rounded-full opacity-5 blur-2xl animate-pulse"
           style={{ 
             background: 'var(--accent-2)',
             animationDelay: '2s' 
           }} />
    </section>
  );
};

export default IntroductionBanner; 