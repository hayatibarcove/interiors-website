"use client";

import React, { useEffect, useRef, useState } from 'react';
import { SectionAnimations } from '../utils/animations';
import { gsap } from 'gsap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { SwiperRef } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useBookContext } from '../contexts/BookContext';
import Image from 'next/image';

const ServicesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperRef | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { smartScrollToContact, isAnimating, isAutoScrolling, isSmartScrolling } = useBookContext();

  useEffect(() => {
    // Check if mobile/tablet
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (!sectionRef.current || !contentRef.current) return;

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Section entrance animation with smooth transition
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          onEnter: () => {
            // Smooth entrance to prevent jarring transition from pinned section
            gsap.fromTo(sectionRef.current, 
              { opacity: 0.8, y: 20 },
              { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
          }
        }
      });

      // Animate content elements with stagger
      const sectionElements = contentRef.current?.querySelectorAll('.section-element');
      if (sectionElements && sectionElements.length > 0) {
        entranceTl.fromTo(sectionElements, 
          {
            opacity: 0,
            y: 40,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.15
          }
        );
      }

      // Add hover animations to service cards
      const serviceCards = contentRef.current!.querySelectorAll('.service-card');
      serviceCards.forEach((card) => {
        SectionAnimations.serviceCardHover(card as HTMLElement);
      });

      return () => {
        entranceTl.kill();
      };
    }, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  const services = [
    {
      title: "Residential Design",
      description: "Sophisticated living environments that marry comfort with style — from cozy apartments to expansive estates, emphasizing natural light, texture, and smart spatial flow.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      image: "/photos/residential-design.jpg"
    },
    {
      title: "Commercial Interiors",
      description: "Inspiring workplaces, retail spaces, and hospitality venues designed to enhance brand identity and create memorable customer experiences through layout and lighting.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      ),
      image: "/photos/commercial-interiors.jpg"
    },
    {
      title: "Custom Renovations",
      description: "Reimagining existing spaces with expert renovations that respect architectural heritage while adding modern elegance and functionality.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      image: "/photos/custom-renovations.jpg"
    },
    {
      title: "Concept Development & Styling",
      description: "Collaborative concept planning with curated finishes — from furnishings and art selection to refined accessorizing.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      ),
      image: "/photos/concept-development.jpg"
    },
    {
      title: "Sustainable Design Consulting",
      description: "Eco-conscious interiors using natural, energy-efficient materials that preserve luxury and reduce environmental impact.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      image: "/photos/sustainable-design-consulting.jpg"
    },
    {
      title: "Lighting Design",
      description: "Strategic lighting solutions that enhance ambiance and highlight architectural features, creating the perfect mood for every space.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      image: "/photos/lighting-concept.jpg"
    }
  ];

  return (
    <section
      ref={sectionRef}
      id="services-section"
      className="relative min-h-screen py-20 overflow-hidden"
      style={{
        background: 'var(--background)'
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="service-bg-element bg-element absolute top-10 right-20 w-72 h-72 rounded-full opacity-10 blur-3xl" 
             style={{ background: 'var(--accent-2)' }} />
        <div className="service-bg-element bg-element absolute bottom-10 left-20 w-64 h-64 rounded-full opacity-10 blur-3xl" 
             style={{ background: 'var(--accent-1)' }} />
        <div className="service-bg-element bg-element absolute top-1/3 left-1/3 w-80 h-80 rounded-full opacity-5 blur-3xl" 
             style={{ background: 'var(--secondary-background)' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={contentRef}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="service-element section-element">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide mb-6"
                  style={{ color: 'var(--foreground)' }}>
                Our Services
              </h2>
            </div>
            
            <div className="service-element section-element">
              <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
                 style={{ color: 'var(--typography-secondary)' }}>
                Luminare Studio offers a comprehensive range of interior design services 
                tailored to meet your needs at every stage of your project.
              </p>
            </div>
          </div>

          {/* Services Carousel Container */}
          <div className="service-element section-element relative">
            {/* Desktop Navigation Buttons - Positioned outside carousel */}
            <button
              onClick={() => {
                if (swiperRef.current && swiperRef.current.swiper) {
                  swiperRef.current.swiper.slidePrev();
                }
              }}
              className="absolute -left-16 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-transparent rounded-full transition-all duration-300 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed hidden lg:block focus:outline-none focus:ring-0"
              style={{ outline: 'none !important' }}
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   style={{ color: 'var(--typography-secondary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => {
                if (swiperRef.current && swiperRef.current.swiper) {
                  swiperRef.current.swiper.slideNext();
                }
              }}
              className="absolute -right-16 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-transparent rounded-full transition-all duration-300 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed hidden lg:block focus:outline-none focus:ring-0"
              style={{ outline: 'none !important' }}
              aria-label="Next slide"
            >
              <svg className="w-6 h-6 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   style={{ color: 'var(--typography-secondary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Swiper Carousel */}
            <div className="lg:px-20">
              <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                slidesPerGroup={1}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    spaceBetween: 24
                  },
                  1024: {
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                    spaceBetween: 32
                  }
                }}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true
                }}
                pagination={false}
                navigation={false} // We're using custom navigation
                className="services-swiper"
                onSlideChange={() => {
                  // Add GSAP animation for new slides
                  const activeSlides = document.querySelectorAll('.swiper-slide-active .service-card');
                  activeSlides.forEach((slide, index) => {
                    gsap.fromTo(slide, 
                      { opacity: 0, y: 30, scale: 0.95 },
                      { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1, 
                        duration: 0.6, 
                        ease: "power2.out",
                        delay: index * 0.1 
                      }
                    );
                  });
                }}
              >
                {services.map((service, index) => (
                  <SwiperSlide key={index} className="pb-12">
                    <div className="service-card group h-full">
                      <div className="rounded-xl shadow-lg overflow-hidden w-full h-[500px] flex flex-col"
                           style={{ background: 'var(--secondary-background)' }}>
                        {/* Service Image */}
                        <div className="aspect-[4/3] overflow-hidden flex-shrink-0">
                          <Image
                            src={service.image}
                            alt={service.title}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        
                        {/* Service Content */}
                        <div className="p-4 flex-1 flex flex-col min-h-0">
                          {/* Service Icon */}
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 group-hover:transition-colors duration-300 flex-shrink-0"
                               style={{ background: 'var(--accent-1)' }}>
                            {React.cloneElement(service.icon, { 
                              className: 'w-5 h-5',
                              style: { color: 'var(--foreground)' }
                            })}
                          </div>

                          {/* Service Title */}
                          <h3 className="text-lg font-serif mb-2 flex-shrink-0"
                              style={{ color: 'var(--foreground)' }}>
                            {service.title}
                          </h3>

                          {/* Service Description */}
                          <p className="text-sm font-sans leading-relaxed overflow-hidden text-ellipsis display-webkit-box -webkit-line-clamp-3 -webkit-box-orient-vertical"
                             style={{ color: 'var(--typography-secondary)' }}>
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Mobile Navigation Buttons - Positioned at bottom */}
            <div className="flex justify-center items-center gap-4 mt-4 lg:hidden">
              <button
                onClick={() => {
                  if (swiperRef.current && swiperRef.current.swiper) {
                    swiperRef.current.swiper.slidePrev();
                  }
                }}
                className="w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ 
                  background: 'var(--secondary-background)',
                  border: '1px solid var(--accent-1)',
                  outline: 'none !important'
                }}
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     style={{ color: 'var(--foreground)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => {
                  if (swiperRef.current && swiperRef.current.swiper) {
                    swiperRef.current.swiper.slideNext();
                  }
                }}
                className="w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ 
                  background: 'var(--secondary-background)',
                  border: '1px solid var(--accent-1)',
                  outline: 'none !important'
                }}
                aria-label="Next slide"
              >
                <svg className="w-5 h-5 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     style={{ color: 'var(--foreground)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Call to Action */}
          <div className="service-element section-element text-center mt-16">
            <div className="rounded-2xl p-8 shadow-lg max-w-2xl mx-auto"
                 style={{ 
                   background: 'var(--secondary-background)',
                   backdropFilter: 'blur(12px)'
                 }}>
              <h3 className="text-2xl md:text-3xl font-light mb-4"
                  style={{ color: 'var(--foreground)' }}>
                Ready to Transform Your Space?
              </h3>
              <p className="mb-6 leading-relaxed"
                 style={{ color: 'var(--typography-secondary)' }}>
                Let&apos;s discuss your project and create something extraordinary together.
              </p>
              <button 
                onClick={async () => {
                  if (isAnimating) {
                    console.log('Animation in progress, ignoring click');
                    return;
                  }
                  
                  try {
                    console.log('Starting refined smart scroll to contact...');
                    await smartScrollToContact();
                  } catch (error) {
                    console.error('Error during smart scroll:', error);
                    // Fallback: try to scroll to contact section directly
                    try {
                      console.log('Attempting fallback scroll to contact...');
                      const contactSection = document.querySelector('.contact-section');
                      if (contactSection) {
                        contactSection.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start'
                        });
                      }
                    } catch (fallbackError) {
                      console.error('Fallback scroll also failed:', fallbackError);
                    }
                  }
                }}
                disabled={isAnimating || isAutoScrolling || isSmartScrolling}
                className={`px-6 py-3 font-medium tracking-wide rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isAnimating || isAutoScrolling || isSmartScrolling ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
                style={{
                  background: 'transparent',
                  color: 'var(--foreground)',
                  border: '2px solid var(--accent-1)'
                }}
                              >
                  {isAnimating || isAutoScrolling || isSmartScrolling ? 'Navigating...' : 'Start Your Project'}
                </button>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
};

export default ServicesSection; 