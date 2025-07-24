# ScrollTrigger Refactoring Implementation Guide

## Overview

This document outlines the successful refactoring of the catalog-website's scroll animations from custom scroll handling to GSAP ScrollTrigger for smooth, scrubbed, and snapped scroll animations similar to the book-website project.

## Key Changes Made

### 1. BookAnimation.tsx - Core Animation Logic

**Before (Custom Scroll Handling):**

- Manual wheel/touch event listeners
- React state-driven animation progress
- Custom scroll sensitivity calculations
- Individual GSAP animations triggered by state

**After (ScrollTrigger Implementation):**

```typescript
// Master timeline with scroll-driven animations
const masterTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: container,
    start: "top top",
    end: "bottom bottom",
    scrub: 1, // Smooth scrubbing for fluid animations
    pin: ".book-display", // Pin the book container during scroll
    pinSpacing: false,
    onUpdate: (self) => {
      const progress = self.progress;
      // Update progress indicators and UI elements
    },
  },
});

// Phase 1: Cover opens (0% to 10%)
masterTimeline.to(".book-cover", {
  rotationY: -180,
  duration: 0.1,
  ease: "power2.inOut",
});

// Phase 2: Pages flip sequentially (10% to 100%)
const totalPages = 9;
const pagesProgress = 0.9;
const progressPerPage = pagesProgress / totalPages;

for (let i = 0; i < totalPages; i++) {
  const startProgress = 0.1 + i * progressPerPage;

  // Page flip animation
  masterTimeline.to(
    `[data-page="${i}"]`,
    {
      rotationY: -180,
      duration: progressPerPage,
      ease: "power2.inOut",
    },
    startProgress
  );

  // Content reveal animation
  masterTimeline.fromTo(
    `[data-page="${i}"] .art-scene, [data-page="${i}"] .minimal-scene`,
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: progressPerPage * 0.3,
      stagger: 0.05,
      ease: "back.out(1.7)",
    },
    startProgress + progressPerPage * 0.1
  );
}
```

### 2. Book3D.tsx - Component Interface

**Before:**

```typescript
interface Book3DProps {
  scrollProgress: number;
  scrollDirection: number;
}
```

**After:**

```typescript
// No props needed - ScrollTrigger handles all scroll logic
const Book3D: React.FC = () => {
  // Component logic
};
```

### 3. CSS Updates - Scroll Behavior

**Before (Scroll Prevention):**

```css
html {
  overflow: hidden; /* Prevent page scrolling */
  scroll-behavior: auto;
}

body {
  overflow: hidden;
  touch-action: none;
}
```

**After (ScrollTrigger-friendly):**

```css
html {
  scroll-behavior: smooth; /* Enable smooth scrolling for ScrollTrigger */
  height: 100%;
}

body {
  height: 100%;
  overflow-x: hidden; /* Allow vertical scrolling */
}

.fullscreen-container {
  position: relative; /* Changed from fixed */
  overflow-x: hidden; /* Allow vertical scrolling for ScrollTrigger */
}
```

### 4. BookPage.tsx - ScrollTrigger Targeting

**Added data attributes for ScrollTrigger targeting:**

```typescript
<div
  className="book-page absolute inset-0 bg-white"
  data-page={pageIndex} // For ScrollTrigger targeting
  data-page-index={pageIndex}
  style={{
    transformStyle: 'preserve-3d',
    backfaceVisibility: 'hidden',
    zIndex: totalPages - pageIndex,
  }}
>
```

## ScrollTrigger Animation Patterns Implemented

### 1. Master Timeline with Scrub

- Single timeline that syncs with scroll progress
- `scrub: 1` for smooth scroll-to-animation sync
- Progressive animation phases (cover → pages)

### 2. Pinning Strategy

- `.book-display` pinned during scroll
- Maintains book position during animations
- `pinSpacing: false` for seamless transitions

### 3. Sequential Page Flips

- Each page flip is a discrete step in the timeline
- Calculated progress distribution (10% cover, 90% pages)
- Individual page targeting with `data-page` attributes

### 4. Content Reveal Animations

- Staggered content animations when pages are visible
- Back easing for natural motion
- Opacity and transform animations

### 5. Progress Indicators

- Real-time progress bar updates
- Scroll instruction visibility management
- Smooth UI state transitions

## Performance Optimizations

### 1. Hardware Acceleration

```css
.book-container * {
  backface-visibility: hidden;
}

.book-display {
  transform: translateZ(0); /* Force hardware acceleration */
}
```

### 2. Will-change Properties

```css
.book-container {
  will-change: transform;
}

.book-cover,
.book-page {
  will-change: transform;
}
```

### 3. Efficient DOM Queries

- Use data attributes for targeting
- Minimize DOM queries in animation loops
- Cleanup ScrollTrigger instances on unmount

## Testing and Validation

### 1. Smoothness Testing

- **Scroll Responsiveness**: Test scroll speed variations
- **Animation Fluidity**: Verify no stuttering or frame drops
- **Direction Changes**: Test rapid scroll direction changes

### 2. Performance Testing

- **Frame Rate**: Monitor 60fps during animations
- **Memory Usage**: Check for memory leaks
- **CPU Usage**: Ensure efficient animation rendering

### 3. Cross-browser Testing

- **Chrome/Safari**: Primary testing focus
- **Firefox**: Verify ScrollTrigger compatibility
- **Mobile**: Touch scroll behavior validation

### 4. Responsive Testing

- **Desktop**: Full resolution testing
- **Tablet**: Touch and mouse scroll
- **Mobile**: Touch-only scroll behavior

## Common Pitfalls Avoided

### 1. ScrollTrigger Cleanup

```typescript
return () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
};
```

### 2. SSR Compatibility

```typescript
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
```

### 3. Proper Initial States

```typescript
// Pages start visible for ScrollTrigger
gsap.set(pages, {
  rotationY: 0,
  opacity: 1, // Keep pages visible for ScrollTrigger
  zIndex: artTopics.length - index,
});
```

### 4. Responsive Considerations

- Dynamic book sizing maintained
- CSS custom properties for layout constraints
- Mobile-friendly scroll behavior

## Benefits Achieved

### 1. Smooth Animation Experience

- Native scroll behavior with smooth scrubbing
- No custom scroll event handling complexity
- Consistent animation timing across devices

### 2. Better Performance

- Hardware-accelerated animations
- Efficient ScrollTrigger optimization
- Reduced JavaScript execution overhead

### 3. Enhanced User Experience

- Natural scroll feel
- Responsive to scroll speed
- Smooth direction changes
- Better mobile touch handling

### 4. Maintainable Code

- Centralized animation logic
- Clear timeline structure
- Easy to modify and extend
- Better debugging capabilities

## Future Enhancements

### 1. Advanced ScrollTrigger Features

- Snap points for discrete page positions
- Scroll markers for visual feedback
- Custom easing curves per animation phase

### 2. Accessibility Improvements

- Keyboard navigation support
- Screen reader compatibility
- Reduced motion preferences

### 3. Performance Monitoring

- Animation performance metrics
- User interaction analytics
- Performance regression testing

## Conclusion

The refactoring successfully transformed the catalog-website's scroll animations from custom handling to GSAP ScrollTrigger, achieving:

- **Smooth, scrubbed animations** similar to book-website
- **Better performance** through hardware acceleration
- **Enhanced user experience** with natural scroll behavior
- **Maintainable codebase** with centralized animation logic
- **Cross-device compatibility** with responsive design

The implementation preserves all existing UI, layout, and content while significantly improving the animation smoothness and responsiveness.
