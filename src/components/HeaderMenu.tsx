"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeaderAnimations, AnimationUtils } from '../utils/animations';
import Image from 'next/image';

const HeaderMenu: React.FC = () => {
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const floatingButtonRef = useRef<HTMLButtonElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFloatingVisible, setIsFloatingVisible] = useState(false);

  useEffect(() => {
    if (!headerRef.current) return;

    console.log("Initializing enhanced header animations");

    // Header scroll animations with floating button behavior
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollThreshold = 100; // When to start showing floating button
      const bannerHeight = window.innerHeight; // Approximate banner height
      
      setIsScrolled(scrollY > 50);
      
      // Show floating button when scrolled past banner
      if (scrollY > bannerHeight * 0.8) {
        setIsFloatingVisible(true);
      } else {
        setIsFloatingVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Initial header state - transparent overlay
      gsap.set(headerRef.current, {
        backgroundColor: 'rgba(246, 245, 240, 0.1)',
        backdropFilter: 'blur(4px)',
        borderBottom: 'none'
      });

      // Use the new animation utility for floating header behavior
      let headerTransformTrigger: ScrollTrigger | null = null;
      headerTransformTrigger = HeaderAnimations.createFloatingHeaderBehavior(
        headerRef.current,
        floatingButtonRef.current,
        setIsFloatingVisible
      );

      return () => {
        if (headerTransformTrigger) {
          headerTransformTrigger.kill();
        }
      };
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Floating button animations
  useEffect(() => {
    if (!floatingButtonRef.current) return;

    HeaderAnimations.floatingButtonEntrance(floatingButtonRef.current, isFloatingVisible);
  }, [isFloatingVisible]);

  // Floating menu overlay animations
  useEffect(() => {
    if (!menuOverlayRef.current) return;

    HeaderAnimations.floatingMenuOverlay(menuOverlayRef.current, isFloatingMenuOpen);
  }, [isFloatingMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      console.log(`Scrolling to section: ${sectionId}`);
      AnimationUtils.scrollTo(element, 80);
    }
    
    // Close all menus
    setIsMobileMenuOpen(false);
    setIsFloatingMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleFloatingMenu = () => {
    setIsFloatingMenuOpen(!isFloatingMenuOpen);
  };

  return (
    <>
      {/* Main Header - Transparent overlay on banner */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md`}
        style={{
          visibility: isScrolled ? 'hidden' : 'visible'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Image 
                src="/photos/logo.png" 
                alt="Luminare Studio Logo" 
                width={40}
                height={40}
                className="h-8 md:h-16 w-auto mr-3 object-contain"
                quality={100}
                priority
              />
              {/* <h1 className="text-xl md:text-xl font-medium tracking-wide"
                  style={{ color: 'var(--foreground)' }}>
                Luminare Studio
              </h1> */}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('about-section')}
                className="font-medium tracking-wide transition-colors duration-300 relative group"
                style={{ color: 'var(--typography-secondary)' }}
              >
                About Us
                <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                      style={{ background: 'var(--foreground)' }} />
              </button>
              
              <button
                onClick={() => scrollToSection('services-section')}
                className="font-medium tracking-wide transition-colors duration-300 relative group"
                style={{ color: 'var(--typography-secondary)' }}
              >
                Services
                <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                      style={{ background: 'var(--foreground)' }} />
              </button>
              
              <button
                onClick={() => scrollToSection('portfolio-section')}
                className="font-medium tracking-wide transition-colors duration-300 relative group"
                style={{ color: 'var(--typography-secondary)' }}
              >
                Portfolio
                <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                      style={{ background: 'var(--foreground)' }} />
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
              aria-label="Toggle mobile menu"
            >
              <span 
                className={`block w-6 h-0.5 transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
                style={{ background: 'var(--typography-secondary)' }}
              />
              <span 
                className={`block w-6 h-0.5 transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
                style={{ background: 'var(--typography-secondary)' }}
              />
              <span 
                className={`block w-6 h-0.5 transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
                style={{ background: 'var(--typography-secondary)' }}
              />
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            ref={mobileMenuRef}
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <nav className="py-4 space-y-4">
              <button
                onClick={() => scrollToSection('about-section')}
                className="block w-full text-left font-light tracking-wide transition-colors duration-300 py-2"
                style={{ color: 'var(--typography-secondary)' }}
              >
                About Us
              </button>
              
              <button
                onClick={() => scrollToSection('services-section')}
                className="block w-full text-left font-light tracking-wide transition-colors duration-300 py-2"
                style={{ color: 'var(--typography-secondary)' }}
              >
                Services
              </button>
              
              <button
                onClick={() => scrollToSection('portfolio-section')}
                className="block w-full text-left font-light tracking-wide transition-colors duration-300 py-2"
                style={{ color: 'var(--typography-secondary)' }}
              >
                Portfolio
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Floating Button - Appears when scrolled past banner */}
      <button
        ref={floatingButtonRef}
        onClick={toggleFloatingMenu}
        className={`fixed top-6 right-6 z-50 w-14 h-14 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ${
          isFloatingVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
        }`}
        style={{
          background: 'rgba(249, 248, 243, 0.95)',
          border: '1px solid var(--accent-1)',
          boxShadow: '0 4px 12px rgba(59, 59, 59, 0.1)',
          outline: 'none !important'
        }}
        aria-label="Toggle floating menu"
      >
        <div className="flex items-center justify-center w-full h-full">
          <svg 
            className={`w-6 h-6 transition-transform duration-300 ${
              isFloatingMenuOpen ? 'rotate-45' : ''
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{ color: 'var(--typography-secondary)' }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d={isFloatingMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </div>
      </button>

      {/* Floating Menu Overlay */}
      <div
        ref={menuOverlayRef}
        className={`fixed top-0 left-0 right-0 bottom-0 z-40 backdrop-blur-md transition-all duration-500 ${
          isFloatingMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{
          background: 'rgba(249, 248, 243, 0.95)'
        }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <nav className="text-center space-y-8">
            <button
              onClick={() => scrollToSection('about-section')}
              className="block text-2xl md:text-3xl font-light transition-colors duration-300 py-4 relative group"
              style={{ color: 'var(--typography-secondary)' }}
            >
              About Us
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{ background: 'var(--foreground)' }} />
            </button>
            
            <button
              onClick={() => scrollToSection('services-section')}
              className="block text-2xl md:text-3xl font-light transition-colors duration-300 py-4 relative group"
              style={{ color: 'var(--typography-secondary)' }}
            >
              Services
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{ background: 'var(--foreground)' }} />
            </button>
            
            <button
              onClick={() => scrollToSection('portfolio-section')}
              className="block text-2xl md:text-3xl font-light transition-colors duration-300 py-4 relative group"
              style={{ color: 'var(--typography-secondary)' }}
            >
              Portfolio
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{ background: 'var(--foreground)' }} />
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default HeaderMenu; 