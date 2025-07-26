import { useEffect, useState, useCallback } from "react";

interface MobileOptimizationConfig {
  enableReducedMotion: boolean;
  enableTouchOptimizations: boolean;
  enablePerformanceMode: boolean;
  isMobile: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  isSmallScreen: boolean;
  isExtraSmallScreen: boolean;
}

export const useMobileOptimization = (): MobileOptimizationConfig => {
  const [config, setConfig] = useState<MobileOptimizationConfig>({
    enableReducedMotion: false,
    enableTouchOptimizations: false,
    enablePerformanceMode: false,
    isMobile: false,
    isPortrait: false,
    isLandscape: false,
    isSmallScreen: false,
    isExtraSmallScreen: false,
  });

  const updateConfig = useCallback(() => {
    if (typeof window === "undefined") return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Detect device characteristics
    const isMobile = viewportWidth <= 768;
    const isPortrait = viewportHeight > viewportWidth;
    const isLandscape = !isPortrait;
    const isSmallScreen = viewportWidth <= 480;
    const isExtraSmallScreen = viewportWidth <= 360;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Check for touch device
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // Performance mode for mobile devices
    const enablePerformanceMode = isMobile || isSmallScreen;

    setConfig({
      enableReducedMotion: prefersReducedMotion,
      enableTouchOptimizations: isTouchDevice,
      enablePerformanceMode,
      isMobile,
      isPortrait,
      isLandscape,
      isSmallScreen,
      isExtraSmallScreen,
    });
  }, []);

  useEffect(() => {
    updateConfig();

    // Listen for orientation changes
    const handleOrientationChange = () => {
      setTimeout(updateConfig, 100); // Delay to ensure new dimensions are set
    };

    // Listen for reduced motion preference changes
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionPreferenceChange = () => {
      updateConfig();
    };

    window.addEventListener("resize", updateConfig);
    window.addEventListener("orientationchange", handleOrientationChange);
    mediaQuery.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      window.removeEventListener("resize", updateConfig);
      window.removeEventListener("orientationchange", handleOrientationChange);
      mediaQuery.removeEventListener("change", handleMotionPreferenceChange);
    };
  }, [updateConfig]);

  return config;
};

// Hook for ScrollTrigger mobile optimizations
export const useScrollTriggerMobileOptimization = (isMobile: boolean) => {
  const getMobileScrollTriggerConfig = useCallback(() => {
    return {
      // Reduce sensitivity on mobile to prevent jitter
      scrub: isMobile ? 1.5 : 1,
      // Optimize for touch scrolling
      anticipatePin: isMobile ? 1 : 0,
      // Prevent conflicts with mobile browser UI
      preventOverlaps: true,
      // Optimize performance on mobile
      fastScrollEnd: isMobile,
      // Reduce update frequency on mobile
      ignoreMobileResize: isMobile,
    };
  }, [isMobile]);

  return { getMobileScrollTriggerConfig };
};

// Hook for responsive typography
export const useResponsiveTypography = (
  isMobile: boolean,
  isSmallScreen: boolean
) => {
  const getTypographyClasses = useCallback(() => {
    if (isSmallScreen) {
      return {
        title: "text-lg leading-tight",
        subtitle: "text-sm leading-relaxed",
        body: "text-xs leading-relaxed",
        caption: "text-xs",
      };
    }

    if (isMobile) {
      return {
        title: "text-xl leading-tight",
        subtitle: "text-base leading-relaxed",
        body: "text-sm leading-relaxed",
        caption: "text-xs",
      };
    }

    return {
      title: "text-2xl leading-tight",
      subtitle: "text-lg leading-relaxed",
      body: "text-base leading-relaxed",
      caption: "text-sm",
    };
  }, [isMobile, isSmallScreen]);

  return { getTypographyClasses };
};
