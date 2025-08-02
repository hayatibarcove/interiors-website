// Performance monitoring utility for ScrollTrigger optimizations
export class PerformanceMonitor {
  private frameCount: number = 0;
  private lastTime: number = performance.now();
  private fpsHistory: number[] = [];
  private scrollTriggerCount: number = 0;
  private isMonitoring: boolean = false;

  constructor() {
    this.start();
  }

  start() {
    this.isMonitoring = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.monitor();
  }

  stop() {
    this.isMonitoring = false;
  }

  private monitor() {
    if (!this.isMonitoring) return;

    this.frameCount++;
    const currentTime = performance.now();

    if (currentTime - this.lastTime >= 1000) {
      const fps = Math.round(
        (this.frameCount * 1000) / (currentTime - this.lastTime)
      );
      this.fpsHistory.push(fps);

      // Keep only last 10 FPS readings
      if (this.fpsHistory.length > 10) {
        this.fpsHistory.shift();
      }

      // Calculate average FPS
      const avgFps =
        this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

      // Performance warnings
      if (fps < 30) {
        console.warn(
          `Low FPS detected: ${fps}. Consider reducing animation complexity.`
        );
      }

      if (avgFps < 45) {
        console.warn(
          `Average FPS is low: ${avgFps.toFixed(
            1
          )}. Performance optimization needed.`
        );
      }

      // Log performance metrics
      if (process.env.NODE_ENV === "development") {
        console.log(
          `Performance: Current FPS: ${fps}, Avg FPS: ${avgFps.toFixed(
            1
          )}, ScrollTriggers: ${this.scrollTriggerCount}`
        );
      }

      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    requestAnimationFrame(() => this.monitor());
  }

  updateScrollTriggerCount() {
    this.scrollTriggerCount =
      (
        window as unknown as { ScrollTrigger?: { getAll?: () => unknown[] } }
      ).ScrollTrigger?.getAll?.()?.length || 0;
  }

  getMetrics() {
    const avgFps =
      this.fpsHistory.length > 0
        ? this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length
        : 0;

    return {
      currentFps: this.fpsHistory[this.fpsHistory.length - 1] || 0,
      averageFps: avgFps,
      scrollTriggerCount: this.scrollTriggerCount,
      isHealthy: avgFps >= 45,
    };
  }
}

// ScrollTrigger performance utilities
export const ScrollTriggerPerformance = {
  // Monitor ScrollTrigger performance
  monitorPerformance() {
    const monitor = new PerformanceMonitor();

    // Update ScrollTrigger count every second
    setInterval(() => {
      monitor.updateScrollTriggerCount();
    }, 1000);

    return monitor;
  },

  // Clean up all ScrollTriggers
  cleanupAll() {
    if (
      typeof window !== "undefined" &&
      (window as unknown as { ScrollTrigger?: { getAll: () => unknown[] } })
        .ScrollTrigger
    ) {
      const scrollTrigger = (
        window as unknown as { ScrollTrigger: { getAll: () => unknown[] } }
      ).ScrollTrigger;
      scrollTrigger.getAll().forEach((trigger: unknown) => {
        if (
          trigger &&
          typeof (trigger as { kill?: () => void }).kill === "function"
        ) {
          (trigger as { kill: () => void }).kill();
        }
      });
      console.log("All ScrollTriggers cleaned up");
    }
  },

  // Get ScrollTrigger statistics
  getStats() {
    if (
      typeof window !== "undefined" &&
      (window as unknown as { ScrollTrigger?: { getAll: () => unknown[] } })
        .ScrollTrigger
    ) {
      const scrollTrigger = (
        window as unknown as { ScrollTrigger: { getAll: () => unknown[] } }
      ).ScrollTrigger;
      const triggers = scrollTrigger.getAll();
      return {
        totalTriggers: triggers.length,
        activeTriggers: triggers.filter(
          (t: unknown) => (t as { isActive?: boolean }).isActive
        ).length,
        triggers: triggers.map((t: unknown) => ({
          id: (t as { vars?: { id?: string } }).vars?.id || "unknown",
          isActive: (t as { isActive?: boolean }).isActive,
          progress: (t as { progress?: number }).progress,
        })),
      };
    }
    return { totalTriggers: 0, activeTriggers: 0, triggers: [] };
  },

  // Optimize ScrollTrigger refresh
  debouncedRefresh(delay: number = 100) {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (
          typeof window !== "undefined" &&
          (window as unknown as { ScrollTrigger?: { refresh: () => void } })
            .ScrollTrigger
        ) {
          (
            window as unknown as { ScrollTrigger: { refresh: () => void } }
          ).ScrollTrigger.refresh();
        }
      }, delay);
    };
  },

  // Check for ScrollTrigger conflicts
  checkConflicts() {
    if (
      typeof window !== "undefined" &&
      (window as unknown as { ScrollTrigger?: { getAll: () => unknown[] } })
        .ScrollTrigger
    ) {
      const scrollTrigger = (
        window as unknown as { ScrollTrigger: { getAll: () => unknown[] } }
      ).ScrollTrigger;
      const triggers = scrollTrigger.getAll();
      const conflicts: Array<{
        trigger1: string;
        trigger2: string;
        element: unknown;
      }> = [];

      // Check for overlapping triggers
      triggers.forEach((trigger1: unknown, index1: number) => {
        triggers.forEach((trigger2: unknown, index2: number) => {
          if (
            index1 !== index2 &&
            (trigger1 as { trigger?: unknown }).trigger ===
              (trigger2 as { trigger?: unknown }).trigger
          ) {
            conflicts.push({
              trigger1:
                (trigger1 as { vars?: { id?: string } }).vars?.id ||
                `trigger-${index1}`,
              trigger2:
                (trigger2 as { vars?: { id?: string } }).vars?.id ||
                `trigger-${index2}`,
              element: (trigger1 as { trigger?: unknown }).trigger,
            });
          }
        });
      });

      if (conflicts.length > 0) {
        console.warn("ScrollTrigger conflicts detected:", conflicts);
      }

      return conflicts;
    }
    return [];
  },
};

// Performance optimization helpers
export const PerformanceHelpers = {
  // Debounce function
  debounce(func: (...args: unknown[]) => void, delay: number) {
    let timeoutId: NodeJS.Timeout;
    return (...args: unknown[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },

  // Throttle function
  throttle(func: (...args: unknown[]) => void, delay: number) {
    let lastCall = 0;
    return (...args: unknown[]) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  },

  // Request animation frame wrapper
  raf(func: (...args: unknown[]) => void) {
    return (...args: unknown[]) => {
      requestAnimationFrame(() => func(...args));
    };
  },

  // GPU acceleration helper
  enableGPUAcceleration(element: HTMLElement) {
    element.style.transform = "translateZ(0)";
    element.style.willChange = "transform";
    element.style.backfaceVisibility = "hidden";
  },

  // Disable GPU acceleration
  disableGPUAcceleration(element: HTMLElement) {
    element.style.transform = "";
    element.style.willChange = "";
    element.style.backfaceVisibility = "";
  },
};

export default PerformanceMonitor;
