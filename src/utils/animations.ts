import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

interface ScrollTriggerInstance {
  progress: number;
}

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // Performance optimizations
  gsap.config({
    nullTargetWarn: false,
  });

  // Add console log for debugging
  console.log("GSAP Animation System Initialized");
}

// Animation configuration constants
export const ANIMATION_CONFIG = {
  // Timing constants
  DURATION: {
    FAST: 0.3,
    NORMAL: 0.6,
    SLOW: 1.2,
    VERY_SLOW: 2.0,
  },

  // Easing functions for smooth animations (tsveti.dev inspired)
  EASING: {
    SMOOTH: "power2.out",
    BOUNCE: "back.out(1.7)",
    ELASTIC: "elastic.out(1, 0.3)",
    EXPO: "expo.out",
    CIRC: "circ.out",
  },

  // Stagger timing for content elements
  STAGGER: {
    FAST: 0.05,
    NORMAL: 0.1,
    SLOW: 0.2,
    VERY_SLOW: 0.3,
  },

  // Animation properties
  TRANSFORMS: {
    FADE_IN: { opacity: 0, y: 30 },
    FADE_OUT: { opacity: 0, y: -30 },
    SLIDE_UP: { opacity: 0, y: 50 },
    SLIDE_DOWN: { opacity: 0, y: -50 },
    SCALE_IN: { opacity: 0, scale: 0.8 },
    SCALE_OUT: { opacity: 0, scale: 1.2 },
  },

  // ScrollTrigger defaults
  SCROLL_TRIGGER: {
    START: "top 80%",
    END: "bottom 20%",
    TOGGLE_ACTIONS: "play none none reverse",
    SCRUB: 1,
  },
};

// Mobile responsive animation adjustments
export const MOBILE_CONFIG = {
  DURATION_MULTIPLIER: 0.8,
  STAGGER_MULTIPLIER: 1.5,
  DISABLE_COMPLEX_ANIMATIONS: true,
};

// Utility functions for common animations
export const AnimationUtils = {
  // Fade in animation
  fadeIn: (
    element: string | Element,
    duration = ANIMATION_CONFIG.DURATION.NORMAL
  ) => {
    return gsap.fromTo(element, ANIMATION_CONFIG.TRANSFORMS.FADE_IN, {
      opacity: 1,
      y: 0,
      duration,
      ease: ANIMATION_CONFIG.EASING.SMOOTH,
    });
  },

  // Slide up animation
  slideUp: (
    element: string | Element,
    duration = ANIMATION_CONFIG.DURATION.NORMAL
  ) => {
    return gsap.fromTo(element, ANIMATION_CONFIG.TRANSFORMS.SLIDE_UP, {
      opacity: 1,
      y: 0,
      duration,
      ease: ANIMATION_CONFIG.EASING.SMOOTH,
    });
  },

  // Scale in animation
  scaleIn: (
    element: string | Element,
    duration = ANIMATION_CONFIG.DURATION.NORMAL
  ) => {
    return gsap.fromTo(element, ANIMATION_CONFIG.TRANSFORMS.SCALE_IN, {
      opacity: 1,
      scale: 1,
      duration,
      ease: ANIMATION_CONFIG.EASING.BOUNCE,
    });
  },

  // Stagger animation for multiple elements
  staggerIn: (
    elements: string | Element | Element[],
    animationType: "fade" | "slide" | "scale" = "fade",
    stagger = ANIMATION_CONFIG.STAGGER.NORMAL
  ) => {
    const config = {
      fade: ANIMATION_CONFIG.TRANSFORMS.FADE_IN,
      slide: ANIMATION_CONFIG.TRANSFORMS.SLIDE_UP,
      scale: ANIMATION_CONFIG.TRANSFORMS.SCALE_IN,
    };

    return gsap.fromTo(elements, config[animationType], {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: ANIMATION_CONFIG.DURATION.NORMAL,
      stagger,
      ease: ANIMATION_CONFIG.EASING.SMOOTH,
    });
  },

  // Parallax effect
  parallax: (element: string | Element, distance = 100) => {
    return gsap.to(element, {
      y: distance,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  },

  // Smooth scroll to element
  scrollTo: (target: string | Element, offset = 80) => {
    return gsap.to(window, {
      duration: ANIMATION_CONFIG.DURATION.SLOW,
      scrollTo: { y: target, offsetY: offset },
      ease: ANIMATION_CONFIG.EASING.EXPO,
    });
  },

  // Create ScrollTrigger with common settings
  createScrollTrigger: (config: {
    trigger: string | Element;
    animation?: gsap.core.Timeline | gsap.core.Tween;
    start?: string;
    end?: string;
    onEnter?: () => void;
    onLeave?: () => void;
    onUpdate?: (self: ScrollTrigger) => void;
    markers?: boolean;
  }) => {
    return ScrollTrigger.create({
      trigger: config.trigger,
      start: config.start || ANIMATION_CONFIG.SCROLL_TRIGGER.START,
      end: config.end || ANIMATION_CONFIG.SCROLL_TRIGGER.END,
      animation: config.animation,
      onEnter: config.onEnter,
      onLeave: config.onLeave,
      onUpdate: config.onUpdate,
      markers: config.markers || false,
      toggleActions: ANIMATION_CONFIG.SCROLL_TRIGGER.TOGGLE_ACTIONS,
    });
  },

  // Mobile responsive animation setup
  matchMedia: () => {
    return gsap
      .matchMedia()
      .add("(min-width: 768px)", () => {
        // Desktop animations - full complexity
        console.log("Desktop animations enabled");
        return () => {
          // Cleanup for desktop
        };
      })
      .add("(max-width: 767px)", () => {
        // Mobile animations - simplified for performance
        console.log("Mobile animations enabled");
        // Disable complex animations on mobile
        if (MOBILE_CONFIG.DISABLE_COMPLEX_ANIMATIONS) {
          // Use simpler animations for mobile
          gsap.set(".bg-element", { clearProps: "all" });
        }

        return () => {
          // Cleanup for mobile
        };
      });
  },

  // Cleanup all ScrollTriggers
  cleanup: () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  },
};

// Banner-specific animations
export const BannerAnimations = {
  // Initial load animation for banner
  loadAnimation: (bannerRef: HTMLElement, contentRef: HTMLElement) => {
    const tl = gsap.timeline();

    console.log("Starting banner load animation");

    // Fade in banner background
    tl.fromTo(
      bannerRef,
      { opacity: 0 },
      {
        opacity: 1,
        duration: ANIMATION_CONFIG.DURATION.SLOW,
        ease: ANIMATION_CONFIG.EASING.SMOOTH,
        onComplete: () => console.log("Banner background animation completed"),
      }
    );

    // Animate content elements with stagger
    const bannerElements = contentRef.querySelectorAll(".banner-element");
    console.log("Found banner elements:", bannerElements.length);

    if (bannerElements.length > 0) {
      tl.fromTo(
        bannerElements,
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: ANIMATION_CONFIG.DURATION.NORMAL,
          stagger: ANIMATION_CONFIG.STAGGER.NORMAL,
          ease: ANIMATION_CONFIG.EASING.SMOOTH,
          onComplete: () => console.log("Banner content animation completed"),
        },
        "-=0.5"
      );
    }

    // Floating animation for scroll indicator
    const scrollIndicator = contentRef.querySelector(".scroll-indicator");
    if (scrollIndicator) {
      gsap.to(scrollIndicator, {
        y: -10,
        duration: 2,
        ease: ANIMATION_CONFIG.EASING.CIRC,
        yoyo: true,
        repeat: -1,
      });
    }

    return tl;
  },

  // Scroll-triggered banner hide animation
  hideAnimation: (bannerRef: HTMLElement) => {
    return ScrollTrigger.create({
      trigger: bannerRef,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        const progress = self.progress;

        if (progress > 0.1) {
          gsap.to(bannerRef, {
            opacity: Math.max(0, 1 - (progress - 0.1) * 2),
            scale: Math.max(0.8, 1 - (progress - 0.1) * 0.3),
            duration: 0.1,
          });
        } else {
          gsap.to(bannerRef, {
            opacity: 1,
            scale: 1,
            duration: 0.1,
          });
        }
      },
    });
  },
};

// Header-specific animations
export const HeaderAnimations = {
  // Header entrance animation
  entranceAnimation: (headerRef: HTMLElement) => {
    return gsap.fromTo(
      headerRef,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: ANIMATION_CONFIG.DURATION.NORMAL,
        ease: ANIMATION_CONFIG.EASING.SMOOTH,
        delay: 0.5,
      }
    );
  },

  // Mobile menu toggle animation
  mobileMenuToggle: (menuRef: HTMLElement, isOpen: boolean) => {
    if (isOpen) {
      return gsap.to(menuRef, {
        maxHeight: "auto",
        opacity: 1,
        duration: ANIMATION_CONFIG.DURATION.FAST,
        ease: ANIMATION_CONFIG.EASING.SMOOTH,
      });
    } else {
      return gsap.to(menuRef, {
        maxHeight: 0,
        opacity: 0,
        duration: ANIMATION_CONFIG.DURATION.FAST,
        ease: ANIMATION_CONFIG.EASING.SMOOTH,
      });
    }
  },

  // Enhanced header scroll behavior with floating button
  createFloatingHeaderBehavior: (
    headerRef: HTMLElement | null,
    floatingButtonRef: HTMLElement | null,
    setIsFloatingVisible: (visible: boolean) => void
  ) => {
    return ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: () => {
        const scrollY = window.scrollY;
        const bannerHeight = window.innerHeight;

        // Show floating button when scrolled past banner
        if (scrollY > bannerHeight * 0.8) {
          setIsFloatingVisible(true);
        } else {
          setIsFloatingVisible(false);
        }

        // Transform header based on scroll position
        if (headerRef && floatingButtonRef) {
          if (scrollY < bannerHeight * 0.5) {
            // In banner area - transparent overlay
            gsap.to(headerRef, {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(4px)",
              borderBottom: "none",
              opacity: 1,
              duration: 0.3,
            });
          } else if (scrollY < bannerHeight * 0.8) {
            // Transitioning out of banner - header becomes more opaque
            const transitionProgress =
              (scrollY - bannerHeight * 0.5) / (bannerHeight * 0.3);
            gsap.to(headerRef, {
              backgroundColor: `rgba(255, 255, 255, ${
                0.1 + transitionProgress * 0.85
              })`,
              backdropFilter: `blur(${4 + transitionProgress * 8}px)`,
              borderBottom:
                transitionProgress > 0.5
                  ? "1px solid rgba(229, 231, 235, 0.5)"
                  : "none",
              opacity: 1,
              duration: 0.1,
            });
          } else {
            // Floating button is visible - hide the header completely
            gsap.to(headerRef, {
              opacity: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        }
      },
    });
  },

  // Floating button entrance animation
  floatingButtonEntrance: (
    buttonRef: HTMLElement | null,
    isVisible: boolean
  ) => {
    if (!buttonRef) return null;

    if (isVisible) {
      return gsap.to(buttonRef, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
      });
    } else {
      return gsap.to(buttonRef, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  },

  // Floating menu overlay animation
  floatingMenuOverlay: (overlayRef: HTMLElement | null, isOpen: boolean) => {
    if (!overlayRef) return null;

    if (isOpen) {
      return gsap.to(overlayRef, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
      });
    } else {
      return gsap.to(overlayRef, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  },

  // Smooth header transition when scrolling back to top
  headerTransitionToBanner: (headerRef: HTMLElement) => {
    return gsap.to(headerRef, {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(4px)",
      borderBottom: "none",
      opacity: 1,
      duration: 0.6,
      ease: ANIMATION_CONFIG.EASING.SMOOTH,
    });
  },

  // Show header when scrolling back to banner area
  showHeaderInBanner: (headerRef: HTMLElement | null) => {
    if (!headerRef) return null;

    return gsap.to(headerRef, {
      opacity: 1,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(4px)",
      borderBottom: "none",
      duration: 0.4,
      ease: "power2.out",
    });
  },
};

// Section-specific animations
export const SectionAnimations = {
  // Standard section entrance animation
  sectionEntrance: (sectionRef: HTMLElement, contentRef: HTMLElement) => {
    console.log("Starting section entrance animation");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef,
        start: ANIMATION_CONFIG.SCROLL_TRIGGER.START,
        end: ANIMATION_CONFIG.SCROLL_TRIGGER.END,
        toggleActions: ANIMATION_CONFIG.SCROLL_TRIGGER.TOGGLE_ACTIONS,
      },
    });

    // Animate content elements with stagger
    const sectionElements = contentRef.querySelectorAll(".section-element");
    console.log("Found section elements:", sectionElements.length);

    if (sectionElements.length > 0) {
      tl.fromTo(
        sectionElements,
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: ANIMATION_CONFIG.DURATION.NORMAL,
          stagger: ANIMATION_CONFIG.STAGGER.NORMAL,
          ease: ANIMATION_CONFIG.EASING.SMOOTH,
        }
      );
    }

    // Parallax effect for background elements
    const bgElements = sectionRef.querySelectorAll(".bg-element");
    if (bgElements.length > 0) {
      gsap.to(bgElements, {
        y: -30,
        scrollTrigger: {
          trigger: sectionRef,
          start: "top bottom",
          end: "bottom top",
          scrub: ANIMATION_CONFIG.SCROLL_TRIGGER.SCRUB,
        },
      });
    }

    return tl;
  },

  // Service card hover animation
  serviceCardHover: (card: HTMLElement) => {
    const tl = gsap.timeline({ paused: true });

    tl.to(card, {
      y: -10,
      scale: 1.02,
      duration: ANIMATION_CONFIG.DURATION.FAST,
      ease: ANIMATION_CONFIG.EASING.SMOOTH,
    });

    card.addEventListener("mouseenter", () => tl.play());
    card.addEventListener("mouseleave", () => tl.reverse());

    return tl;
  },
};

// Horizontal scroll animations for services section
export const HorizontalScrollAnimations = {
  // Initialize horizontal scroll for services section
  initHorizontalScroll: (
    sectionRef: HTMLElement,
    containerRef: HTMLElement,
    itemsRef: HTMLElement,
    isMobile: boolean = false
  ) => {
    console.log("Initializing horizontal scroll for services section");

    // Calculate the total width needed for horizontal scroll
    const items = itemsRef.querySelectorAll(".service-card");
    const itemWidth = (items[0] as HTMLElement)?.offsetWidth || 400;
    const gap = isMobile ? 16 : 32; // Smaller gap on mobile
    const totalWidth = (items.length - 1) * (itemWidth + gap);

    console.log(
      `Total horizontal width needed: ${totalWidth}px (mobile: ${isMobile})`
    );

    // Set the container width to accommodate all items
    gsap.set(itemsRef, {
      width: totalWidth + itemWidth,
      display: "flex",
      gap: `${gap}px`,
    });

    // Create the horizontal scroll timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef,
        start: "top top",
        end: `+=${totalWidth}`,
        pin: true,
        scrub: isMobile ? 0.5 : 1, // Smoother on mobile
        anticipatePin: 1,
        onUpdate: (self) => {
          // Optional: Add progress indicator
          const progress = self.progress;
          console.log(
            `Horizontal scroll progress: ${(progress * 100).toFixed(1)}%`
          );
        },
        onEnter: () => {
          console.log("Entering horizontal scroll section");
        },
        onLeave: () => {
          console.log("Leaving horizontal scroll section");
        },
        onEnterBack: () => {
          console.log("Re-entering horizontal scroll section (scrolling up)");
        },
        onLeaveBack: () => {
          console.log("Leaving horizontal scroll section (scrolling up)");
        },
      },
    });

    // Animate the container to move horizontally
    tl.to(itemsRef, {
      x: -totalWidth,
      ease: "none",
    });

    // Add fade-in effect for each service card as it enters viewport
    items.forEach((item) => {
      const cardTl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "left center",
          end: "right center",
          scrub: false,
          toggleActions: "play none none reverse",
        },
      });

      cardTl.fromTo(
        item,
        {
          opacity: 0,
          scale: 0.9,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: ANIMATION_CONFIG.DURATION.NORMAL,
          ease: ANIMATION_CONFIG.EASING.SMOOTH,
        }
      );
    });

    return tl;
  },

  // Add hover effects to service cards
  addServiceCardHover: (card: HTMLElement) => {
    const tl = gsap.timeline({ paused: true });

    tl.to(card, {
      y: -8,
      scale: 1.03,
      duration: ANIMATION_CONFIG.DURATION.FAST,
      ease: ANIMATION_CONFIG.EASING.SMOOTH,
    });

    card.addEventListener("mouseenter", () => tl.play());
    card.addEventListener("mouseleave", () => tl.reverse());

    return tl;
  },

  // Create progress indicator ScrollTrigger
  createProgressTrigger: (
    sectionRef: HTMLElement,
    setScrollProgress: (progress: number) => void,
    setIsProgressVisible: (visible: boolean) => void
  ) => {
    return ScrollTrigger.create({
      trigger: sectionRef,
      start: "top center",
      end: "bottom center",
      onUpdate: (self: ScrollTriggerInstance) => {
        setScrollProgress(self.progress);
        setIsProgressVisible(self.progress > 0 && self.progress < 1);
      },
      onEnter: () => setIsProgressVisible(true),
      onLeave: () => setIsProgressVisible(false),
      onEnterBack: () => setIsProgressVisible(true),
      onLeaveBack: () => setIsProgressVisible(false),
    });
  },

  // Refresh ScrollTrigger for responsive design
  refreshScrollTrigger: () => {
    ScrollTrigger.refresh();
    console.log("Horizontal scroll triggers refreshed");
  },

  // Cleanup horizontal scroll animations
  cleanup: () => {
    const triggers = ScrollTrigger.getAll();
    triggers.forEach((trigger) => {
      const triggerElement = trigger.vars.trigger as Element;
      if (triggerElement?.classList?.contains("services-section")) {
        trigger.kill();
      }
    });
    console.log("Horizontal scroll animations cleaned up");
  },
};

export default AnimationUtils;
