"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

interface ContactSectionProps {
  isVisible: boolean;
  onContactReady?: () => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({ isVisible, onContactReady }) => {
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

    // Animate in when visible
    if (isVisible) {
      const tl = gsap.timeline({
        onComplete: () => {
          onContactReady?.();
        }
      });

      // Show container with smooth fade and scale
      tl.set(containerRef.current, { visibility: 'visible' })
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
    } else {
      // Animate out
      const tl = gsap.timeline();
      
      tl.to(contentRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in"
      })
        .to(containerRef.current, {
          opacity: 0,
          scale: 0.9,
          y: -10,
          duration: 0.4,
          ease: "power2.in"
        }, "-=0.2")
        .set(containerRef.current, { visibility: 'hidden' });

      return () => {
        tl.kill();
      };
    }
  }, [isVisible, onContactReady]);

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
        opacity: 0,
        visibility: 'hidden',
        pointerEvents: 'none'
      }}
    >
      <div
        ref={contentRef}
        className="contact-content max-w-md mx-auto p-8 text-center space-y-6"
      >
        {/* Header */}
        <div className="contact-element opacity-0 transform translate-y-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-stone-800 mb-2">
            Let's Create Together
          </h2>
          <p className="text-stone-600 text-sm md:text-base">
            Ready to transform your space? Get in touch to start your design journey.
          </p>
        </div>

        {/* Contact Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="contact-element opacity-0 transform translate-y-4 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <textarea
            placeholder="Tell us about your project..."
            rows={4}
            className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-stone-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-stone-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            Send Message
          </button>
        </form>

        {/* Contact Info */}
        <div className="contact-element opacity-0 transform translate-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center space-x-2 text-stone-600">
              <Mail className="w-4 h-4" />
              <span>hello@studio.com</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-stone-600">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-stone-600">
              <MapPin className="w-4 h-4" />
              <span>New York, NY</span>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="contact-element opacity-0 transform translate-y-4">
          <div className="flex justify-center space-x-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-all duration-200 transform hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4 text-stone-600" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-all duration-200 transform hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4 text-stone-600" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-all duration-200 transform hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4 text-stone-600" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection; 