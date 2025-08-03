"use client";

import React, { useEffect, useRef } from 'react';
import { SectionAnimations } from '../utils/animations';
import { BookAnimation } from './Book';

const PortfolioSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current) return;

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Portfolio header entrance animation
      const entranceTl = SectionAnimations.sectionEntrance(sectionRef.current!, headerRef.current!);

      return () => {
        entranceTl.kill();
      };
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="portfolio-section"
      className="relative min-h-screen overflow-hidden"
      style={{
        background: 'var(--background)'
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="portfolio-bg-element bg-element absolute top-20 right-20 w-64 h-64 rounded-full opacity-5 blur-3xl" 
             style={{ background: 'var(--accent-2)' }} />
        <div className="portfolio-bg-element bg-element absolute bottom-20 left-20 w-80 h-80 rounded-full opacity-5 blur-3xl" 
             style={{ background: 'var(--accent-1)' }} />
        <div className="portfolio-bg-element bg-element absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-3 blur-3xl" 
             style={{ background: 'var(--secondary-background)' }} />
      </div>

      {/* Portfolio Header */}
      <div className="relative z-10 pt-20">
        <div className="container mx-auto px-4">
          <div 
            ref={headerRef}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="portfolio-element section-element">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide mb-6"
                  style={{ color: 'var(--foreground)' }}>
                Our Portfolio
              </h2>
            </div>
            
            <div className="portfolio-element section-element">
              <p className="text-lg md:text-xl leading-relaxed mb-8"
                 style={{ color: 'var(--typography-secondary)' }}>
                Discover our collection of interior design projects that showcase our commitment to 
                illuminating spaces with harmony and elegance. Each project reflects our dedication 
                to creating timeless sanctuaries that inspire and elevate.
              </p>
            </div>

            <div className="portfolio-element section-element">
              <div className="w-24 h-px mx-auto mb-8" 
                   style={{ background: 'linear-gradient(to right, transparent, var(--highlight), transparent)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Book Container */}
      <div className="relative z-10">
        <BookAnimation />
      </div>

      {/* Portfolio Footer */}
      {/* <div className="relative z-10 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-light mb-4"
                style={{ color: 'var(--foreground)' }}>
              Ready to Start Your Project?
            </h3>
            <p className="mb-6 leading-relaxed"
               style={{ color: 'var(--typography-secondary)' }}>
              Let&apos;s create something extraordinary together. Contact us to discuss your vision.
            </p>
            <button className="px-6 py-3 font-medium tracking-wide rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105"
                    style={{
                      background: 'transparent',
                      color: 'var(--foreground)',
                      border: '2px solid var(--accent-1)'
                    }}>
              Get in Touch
            </button>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default PortfolioSection; 