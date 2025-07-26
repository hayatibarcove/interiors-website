# Mobile Testing Guide for Interactive Book Website

## Testing Checklist

### 1. Device Testing

- [ ] iPhone (various sizes: SE, 12, 13, 14, 15)
- [ ] Android phones (Samsung, Google Pixel, OnePlus)
- [ ] Tablets (iPad, Android tablets)
- [ ] Landscape and portrait orientations
- [ ] Different screen densities (1x, 2x, 3x)

### 2. Browser Testing

- [ ] Safari (iOS)
- [ ] Chrome (Android)
- [ ] Firefox (mobile)
- [ ] Edge (mobile)
- [ ] Samsung Internet

### 3. Performance Testing

- [ ] Lighthouse mobile audit
- [ ] Core Web Vitals measurement
- [ ] Scroll performance (60fps target)
- [ ] Memory usage monitoring
- [ ] Battery consumption testing

### 4. Functionality Testing

#### Book Modal Sizing

- [ ] Book fits within viewport in portrait mode
- [ ] Book fits within viewport in landscape mode
- [ ] No overlap with header/footer
- [ ] Proper scaling on different screen sizes
- [ ] Smooth resize on orientation change

#### ScrollTrigger Animations

- [ ] Smooth page flip animations
- [ ] No jitter during scroll
- [ ] Proper snap behavior
- [ ] Touch scroll works correctly
- [ ] Reduced motion support works

#### Typography and Layout

- [ ] Text is readable on all screen sizes
- [ ] No text overflow
- [ ] 2-column layout adapts properly
- [ ] Images scale correctly
- [ ] Touch targets are 44px minimum

### 5. Accessibility Testing

- [ ] Screen reader compatibility
- [ ] Keyboard navigation
- [ ] High contrast mode
- [ ] Reduced motion preference
- [ ] Focus indicators visible

## Performance Optimization Tips

### 1. ScrollTrigger Mobile Optimizations

```javascript
// Use these settings for mobile ScrollTrigger
const mobileSettings = {
  scrub: 1.5, // Reduced sensitivity
  anticipatePin: 1, // Better touch handling
  preventOverlaps: true, // Prevent conflicts
  fastScrollEnd: true, // Performance mode
};
```

### 2. CSS Performance

```css
/* Use will-change sparingly */
.book-page * {
  will-change: transform, opacity;
}

/* Optimize for touch devices */
@media (hover: none) and (pointer: coarse) {
  .fullscreen-container {
    -webkit-overflow-scrolling: touch;
  }
}
```

### 3. Image Optimization

```javascript
// Use responsive images
<Image
  src={story.image}
  alt={alt}
  width={1080}
  height={1080}
  className="w-full h-full object-cover"
  priority={pageIndex < 3} // Prioritize first pages
/>
```

### 4. Memory Management

```javascript
// Clean up ScrollTrigger on unmount
useEffect(() => {
  return () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
}, []);
```

## Common Mobile Issues and Solutions

### 1. ScrollTrigger Jitter

**Problem**: Animations stutter on mobile
**Solution**: Increase scrub value and use `fastScrollEnd: true`

### 2. Touch Scroll Conflicts

**Problem**: Browser UI interferes with custom scroll
**Solution**: Use `preventOverlaps: true` and proper touch event handling

### 3. Memory Leaks

**Problem**: Performance degrades over time
**Solution**: Properly clean up ScrollTrigger instances and event listeners

### 4. Layout Shifts

**Problem**: Content jumps during load
**Solution**: Use proper aspect ratios and loading states

### 5. Text Overflow

**Problem**: Text doesn't fit in containers
**Solution**: Use responsive typography classes and proper line heights

## Testing Tools

### 1. Browser DevTools

- Chrome DevTools mobile simulation
- Safari Web Inspector (iOS)
- Firefox Responsive Design Mode

### 2. Performance Tools

- Lighthouse (mobile audit)
- WebPageTest (mobile testing)
- Chrome Performance tab

### 3. Real Device Testing

- BrowserStack
- LambdaTest
- Physical device testing

## Performance Benchmarks

### Target Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Time to Interactive**: < 3.5s

### Scroll Performance

- **Target FPS**: 60fps
- **Scroll Smoothness**: No visible jitter
- **Memory Usage**: < 50MB increase during scroll

## Debugging Tips

### 1. Console Logging

```javascript
// Add to ScrollTrigger onUpdate
onUpdate: (self) => {
  console.log("Scroll progress:", self.progress);
  console.log("Active page:", Math.floor(self.progress * totalPages));
};
```

### 2. Visual Debugging

```css
/* Add to CSS for debugging */
.book-page {
  border: 1px solid red;
}

.fullscreen-container {
  border: 1px solid blue;
}
```

### 3. Performance Monitoring

```javascript
// Monitor frame rate
let frameCount = 0;
let lastTime = performance.now();

function checkFrameRate() {
  frameCount++;
  const currentTime = performance.now();

  if (currentTime - lastTime >= 1000) {
    console.log("FPS:", frameCount);
    frameCount = 0;
    lastTime = currentTime;
  }

  requestAnimationFrame(checkFrameRate);
}
```

## Deployment Checklist

### 1. Pre-deployment

- [ ] All mobile breakpoints tested
- [ ] Performance metrics met
- [ ] Accessibility requirements satisfied
- [ ] Cross-browser compatibility verified

### 2. Post-deployment

- [ ] Real device testing completed
- [ ] Performance monitoring enabled
- [ ] Error tracking configured
- [ ] User feedback collected

### 3. Ongoing Monitoring

- [ ] Core Web Vitals tracking
- [ ] User experience metrics
- [ ] Error rate monitoring
- [ ] Performance regression testing
