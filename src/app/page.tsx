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

    // Debug: Check if sections are rendering
    // console.log("Checking section visibility...");
    // setTimeout(() => {
    //   const aboutSection = document.getElementById('about-section');
    //   const servicesSection = document.getElementById('services-section');
    //   const portfolioSection = document.getElementById('portfolio-section');
      
    //   console.log('About section:', aboutSection);
    //   console.log('Services section:', servicesSection);
    //   console.log('Portfolio section:', portfolioSection);
      
    //   if (aboutSection) {
    //     console.log('About section styles:', window.getComputedStyle(aboutSection));
    //   }
    //   if (servicesSection) {
    //     console.log('Services section styles:', window.getComputedStyle(servicesSection));
    //   }
    //   if (portfolioSection) {
    //     console.log('Portfolio section styles:', window.getComputedStyle(portfolioSection));
    //   }
    // }, 2000);

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

        {/* Test Section - Should be visible after Portfolio */}
        {/* <section 
          id="test-section"
          className="min-h-screen bg-red-100 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' }}
        >
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Test Section</h2>
            <p className="text-xl">This section should be visible after the book animation</p>
            <p className="text-sm mt-4">If you can see this, the sections are rendering correctly</p>
          </div>
        </section> */}
      </div>
    </BookProvider>
  );
}
