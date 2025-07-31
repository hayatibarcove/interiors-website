"use client";

import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import HeaderMenu from '../components/HeaderMenu';
import IntroductionBanner from '../components/IntroductionBanner';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import PortfolioSection from '../components/PortfolioSection';
import { AnimationUtils } from '../utils/animations';
import { BookProvider } from '../contexts/BookContext';

export default function Home() {
  useEffect(() => {
    // Initialize mobile responsive animations
    AnimationUtils.matchMedia();

    // Test GSAP functionality
    console.log("Testing GSAP functionality...");
    const testElement = document.createElement('div');
    testElement.style.position = 'absolute';
    testElement.style.left = '-9999px';
    document.body.appendChild(testElement);
    
    gsap.to(testElement, {
      opacity: 0.5,
      duration: 0.1,
      onComplete: () => {
        console.log("GSAP is working correctly!");
        document.body.removeChild(testElement);
      }
    });

    return () => {
      // Cleanup animations on unmount
      AnimationUtils.cleanup();
    };
  }, []);

  const handleScrollDown = () => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      AnimationUtils.scrollTo(aboutSection, 80);
    }
  };

  return (
    <BookProvider>
      <div className="relative w-full">
        {/* Sticky Header Menu */}
        <HeaderMenu />

        {/* Introduction Banner */}
        <IntroductionBanner onScrollDown={handleScrollDown} />

        {/* About Section */}
        <AboutSection />

        {/* Services Section */}
        <ServicesSection />

        {/* Portfolio Section with Interactive Book */}
        <PortfolioSection />
      </div>
    </BookProvider>
  );
}
