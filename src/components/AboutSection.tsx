"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { SectionAnimations } from '../utils/animations';
import PillarCard from './PillarCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { SwiperRef } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const pillarsContainerRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperRef | null>(null);
  const [yearsCount, setYearsCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Pillar data for carousel
  const pillars = [
    {
      title: "Creativity",
      description: "Bold concepts with timeless elegance",
      imageSrc: "/photos/creativity.jpg",
      imageAlt: "Creative design concepts and artistic process"
    },
    {
      title: "Craftsmanship",
      description: "Meticulous attention to every detail",
      imageSrc: "/photos/craftsmanship.jpg",
      imageAlt: "Craftsmanship and hands-on work with materials"
    },
    {
      title: "Sustainability",
      description: "Responsible design for future generations",
      imageSrc: "/photos/sustainability.jpg",
      imageAlt: "Sustainable and eco-friendly design principles"
    }
  ];

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
      // Create a master timeline for the entire section
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        }
      });

      // Animate the main content first
      const mainElements = contentRef.current?.querySelectorAll('.section-element');
      if (mainElements && mainElements.length > 0) {
        masterTl.fromTo(mainElements, 
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

      // Animate counters with a slight delay
      masterTl.add(() => {
        // Animate years counter
        gsap.to({}, {
          duration: 1.5,
          ease: "power2.out",
          onUpdate: function() {
            const progress = this.progress();
            setYearsCount(Math.floor(progress * 10));
          }
        });

        // Animate projects counter
        gsap.to({}, {
          duration: 1.5,
          ease: "power2.out",
          onUpdate: function() {
            const progress = this.progress();
            setProjectsCount(Math.floor(progress * 150));
          }
        });
      }, "-=0.3");

      // Horizontal scroll animation for pillars (desktop only)
      if (!isMobile && pillarsContainerRef.current) {
        const pillarCards = pillarsContainerRef.current?.querySelectorAll('.pillar-card');
        if (pillarCards && pillarCards.length > 0) {
          // Set initial state - position cards in a horizontal row
          gsap.set(pillarCards, {
            opacity: 0,
            x: "100vw", // Start from right edge of viewport
            display: "inline-block",
            width: "320px", // Fixed width for each card (w-80 = 320px)
            marginRight: "2rem"
          });

          // Create horizontal scroll timeline with parent section pinning
          const horizontalTl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current, // Pin the entire About section
              start: "top top",
              end: "+=200%", // Reduced scroll distance for faster animation
              pin: true,
              pinSpacing: true, // Ensure proper spacing
              scrub: 0.3, // Faster scrub for more responsive feel
              snap: {
                snapTo: [0, 0.5, 1], // Simplified snap points
                duration: { min: 0.2, max: 0.4 }, // Faster snap
                delay: 0.1, // Reduced delay
                ease: "power1.out"
              },
              markers: false, // Set to true for debugging
              onLeave: () => {
                // Smooth transition when leaving the pinned section
                gsap.to(sectionRef.current, {
                  opacity: 1,
                  duration: 0.2, // Faster transition
                  ease: "power2.out"
                });
              },
              onEnterBack: () => {
                // Smooth transition when re-entering
                gsap.to(sectionRef.current, {
                  opacity: 1,
                  duration: 0.2, // Faster transition
                  ease: "power2.out"
                });
              }
            }
          });

          // Animate each card in sequence with faster timing
          pillarCards.forEach((card, index) => {
            const startTime = index * 0.2; // Faster stagger timing
            
            horizontalTl.to(card, {
              opacity: 1,
              x: 0,
              duration: 0.1, // Faster duration
              ease: "power1.out" // Faster easing
            }, startTime);
          });
        }
      } else if (isMobile && pillarsRef.current) {
        // Mobile carousel animation - animate the first slide
        const firstSlide = pillarsRef.current?.querySelector('.swiper-slide-active .pillar-card');
        if (firstSlide) {
          masterTl.fromTo(firstSlide, 
            {
              opacity: 0,
              y: 60,
              scale: 0.9
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: "power2.out"
            },
            "-=0.4"
          );
        }
      }

      // Parallax effect for background elements
      const bgElements = sectionRef.current?.querySelectorAll('.bg-element');
      if (bgElements && bgElements.length > 0) {
        gsap.to(bgElements, {
          y: -30,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      return () => {
        masterTl.kill();
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.vars.trigger === sectionRef.current || 
              trigger.vars.trigger === pillarsContainerRef.current) {
            trigger.kill();
          }
        });
      };
    }, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      id="about-section"
      className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden"
      style={{
        background: 'var(--background)',
        transition: 'opacity 0.3s ease-out',
        willChange: 'opacity'
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="about-bg-element bg-element absolute top-20 left-10 w-64 h-64 rounded-full opacity-5 blur-3xl" 
             style={{ background: 'var(--accent-1)' }} />
        <div className="about-bg-element bg-element absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-5 blur-3xl" 
             style={{ background: 'var(--accent-2)' }} />
        <div className="about-bg-element bg-element absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-3 blur-3xl" 
             style={{ background: 'var(--secondary-background)' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={contentRef}
          className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Text Content - Brief Introduction */}
          <div className="space-y-8">
            <div className="about-element section-element">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide mb-8">
                <span style={{ color: 'var(--foreground)' }}>About</span>
                <span className="block" style={{ color: 'var(--highlight)' }}>Luminare Studio</span>
              </h2>
            </div>

            <div className="about-element section-element">
                              <p className="text-lg md:text-xl leading-relaxed"
                   style={{ color: 'var(--typography-secondary)' }}>
                  Luminare Studio is a boutique interior design firm dedicated to transforming spaces with light, harmony, and timeless elegance. We craft personalized environments that reflect each client&apos;s lifestyle, blending natural textures and refined palettes with purposeful design.
                </p>
            </div>
          </div>

          {/* Animated Counters */}
          <div className="about-element section-element">
            <div className="grid grid-cols-2 gap-8 lg:gap-12">
              {/* Years of Experience Counter */}
              <div className="text-center space-y-4">
                <div 
                  className="text-5xl md:text-6xl lg:text-7xl font-light"
                  style={{ color: 'var(--highlight)' }}
                  aria-label={`${yearsCount} years of experience`}
                >
                  {yearsCount}+
                </div>
                <div className="text-sm md:text-base font-light tracking-wide uppercase"
                     style={{ color: 'var(--typography-secondary)' }}>
                  Years Experience
                </div>
              </div>

              {/* Projects Completed Counter */}
              <div className="text-center space-y-4">
                <div 
                  className="text-5xl md:text-6xl lg:text-7xl font-light"
                  style={{ color: 'var(--highlight)' }}
                  aria-label={`${projectsCount} projects completed`}
                >
                  {projectsCount}+
                </div>
                <div className="text-sm md:text-base font-light tracking-wide uppercase"
                     style={{ color: 'var(--typography-secondary)' }}>
                  Projects Completed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Three Pillars of Design Philosophy */}
        <div 
          ref={pillarsRef}
          className="mt-8 max-w-7xl mx-auto"
        >
          {/* Desktop: Horizontal scroll container */}
          <div 
            ref={pillarsContainerRef}
            className={`${isMobile ? 'hidden' : 'block'} h-[400px] w-full relative overflow-hidden flex items-center`}
            style={{ 
              willChange: 'transform',
              transform: 'translateZ(0)' // Force hardware acceleration
            }}
          >
            {pillars.map((pillar, index) => (
              <PillarCard
                key={index}
                title={pillar.title}
                description={pillar.description}
                imageSrc={pillar.imageSrc}
                imageAlt={pillar.imageAlt}
                className="w-80 h-96"
              />
            ))}
          </div>

          {/* Mobile: Carousel layout */}
          <div className={`${isMobile ? 'block' : 'hidden'} relative`}>
            {/* Swiper Carousel */}
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              slidesPerGroup={1}
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              pagination={false}
              navigation={false} // We're using custom navigation
              className="pillars-swiper"
              onSlideChange={() => {
                // Add GSAP animation for new slides
                const activeSlides = document.querySelectorAll('.swiper-slide-active .pillar-card');
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
              {pillars.map((pillar, index) => (
                <SwiperSlide key={index} className="pb-8">
                  <div className="pillar-card-container h-full">
                    <PillarCard
                      title={pillar.title}
                      description={pillar.description}
                      imageSrc={pillar.imageSrc}
                      imageAlt={pillar.imageAlt}
                      className="w-full h-[400px]"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Mobile Navigation Buttons - Moved to bottom */}
            <div className="flex justify-center items-center gap-4 mt-6">
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
                aria-label="Previous pillar"
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
                aria-label="Next pillar"
              >
                <svg className="w-5 h-5 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     style={{ color: 'var(--foreground)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 