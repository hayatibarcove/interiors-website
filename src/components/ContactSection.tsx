"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

interface ContactSectionProps {
  isVisible: boolean;
  onContactReady?: () => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({ onContactReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    // Initial state - hidden
    gsap.set(containerRef.current, {
      opacity: 0,
      scale: 0.8,
      y: 20,
      visibility: 'hidden'
    });

    gsap.set(contentRef.current, {
      opacity: 0,
      y: 30
    });

    const tl = gsap.timeline({
      onComplete: () => {
        onContactReady?.();
      }
    });

    // Show container with smooth fade and scale
    tl.set(containerRef.current, { visibility: 'hidden' })
      .to(containerRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      })
      .to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.3");

    // Stagger animate contact elements
    const contactElements = contentRef.current.querySelectorAll('.contact-element');
    tl.to(contactElements, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.2");

    return () => {
      tl.kill();
    };
  }, [onContactReady]);

  // Handle smooth fade transitions from ScrollTrigger
  useEffect(() => {
    if (!containerRef.current) return;

    // Set initial state for ScrollTrigger control
    gsap.set(containerRef.current, {
      opacity: 0,
      visibility: 'hidden',
      scale: 0.8,
      y: 20
    });

    // Set content elements to be ready for animation
    if (contentRef.current) {
      const contactElements = contentRef.current.querySelectorAll('.contact-element');
      gsap.set(contactElements, {
        opacity: 0,
        y: 20
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted');
  };

  return (
    <div
      ref={containerRef}
      className="contact-section absolute inset-0 flex items-center justify-center z-20"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(245,245,245,0.95) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        pointerEvents: 'none'
      }}
    >
      <div
        ref={contentRef}
        className="contact-content max-w-md mx-auto p-4 md:p-8 text-center space-y-4 md:space-y-6"
      >
        {/* Header */}
        <div className="contact-element opacity-0 transform translate-y-4">
          <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-stone-800 mb-1 md:mb-2">
            Let&apos;s Create Together
          </h2>
          <p className="text-stone-600 text-xs md:text-sm lg:text-base">
            Ready to transform your space? Get in touch to start your design journey.
          </p>
        </div>

        {/* Contact Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="contact-element opacity-0 transform translate-y-4 space-y-3 md:space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <textarea
            placeholder="Tell us about your project..."
            rows={3}
            className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-transparent text-stone-700 font-medium tracking-wide border-2 border-stone-400 rounded-full py-2 md:py-3 px-4 md:px-6 text-sm md:text-base hover:scale-105 hover:border-stone-600 hover:text-stone-800 hover:bg-stone-50/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-stone-400/50 focus:ring-offset-2"
          >
            Send Message
          </button>
        </form>

        {/* Contact Info */}
        <div className="contact-element opacity-0 transform translate-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
            <div className="flex items-center justify-center space-x-1 md:space-x-2 text-stone-600">
              <Mail className="w-3 h-3 md:w-4 md:h-4" />
              <span>info@luminarestudio.com</span>
            </div>
            <div className="flex items-center justify-center space-x-1 md:space-x-2 text-stone-600">
              <Phone className="w-3 h-3 md:w-4 md:h-4" />
              <span>+60 333333333</span>
            </div>
            <div className="flex items-center justify-center space-x-1 md:space-x-2 text-stone-600">
              <MapPin className="w-3 h-3 md:w-4 md:h-4" />
              <span>Kuala Lumpur, Malaysia</span>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="contact-element opacity-0 transform translate-y-4">
          <div className="flex justify-center space-x-3 md:space-x-4">
            <a
              href="#"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-all duration-200 transform hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="w-3 h-3 md:w-4 md:h-4 text-stone-600" />
            </a>
            <a
              href="#"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-all duration-200 transform hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter className="w-3 h-3 md:w-4 md:h-4 text-stone-600" />
            </a>
            <a
              href="#"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-all duration-200 transform hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook className="w-3 h-3 md:w-4 md:h-4 text-stone-600" />
            </a>
          </div>
        </div>

        {/* Scroll Instruction */}
        <div className="contact-element opacity-0 transform translate-y-4 mt-6 md:mt-12">
          <div className="flex flex-col items-center space-y-2 md:space-y-3">
            {/* Enhanced scroll indicator */}
            <div className="relative w-6 h-9 md:w-8 md:h-12 border-2 rounded-full flex justify-center items-start pt-2 md:pt-3 transition-all duration-500 ease-out"
                 style={{ borderColor: 'var(--accent-1, #a8a29e)' }}>
              {/* Animated scroll dot */}
              <div className="w-1 h-1.5 md:w-1.5 md:h-2 rounded-full animate-bounce transition-all duration-300 ease-out" 
                   style={{ 
                     background: 'var(--typography-secondary, #78716c)',
                     animationDuration: '2s', 
                     animationDelay: '0.5s' 
                   }} />
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 w-6 h-9 md:w-8 md:h-12 border rounded-full opacity-0 transition-opacity duration-500 ease-out"
                   style={{ borderColor: 'var(--accent-2, #d6d3d1)' }} />
            </div>
            
            {/* Enhanced text */}
            <p className="text-xs font-light tracking-wider uppercase transition-all duration-300 ease-out"
               style={{ color: 'var(--typography-secondary, #78716c)' }}>
              Scroll up to close
            </p>
            
            {/* Subtle arrow indicator */}
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform group-hover:-translate-y-1">
              <svg className="w-3 h-3 md:w-4 md:h-4 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   style={{ color: 'var(--typography-secondary, #78716c)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection; 