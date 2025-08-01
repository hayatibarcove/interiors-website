# 🏠 Interior Design Portfolio - Interactive Showcase

An immersive interior design portfolio website built with **Next.js** and **GSAP**, featuring scroll-controlled animations, interactive service showcases, and a 3D book-style portfolio presentation.

## ✨ Features

- **Interactive Service Showcase**: Animated service cards with hover effects and detailed descriptions
- **3D Portfolio Book**: Interactive book-style portfolio presentation with scroll-controlled page turning
- **Animated Story Scenes**: Each portfolio piece contains unique animated illustrations
- **Scroll-Driven Interactions**: All animations are controlled by scroll position using GSAP ScrollTrigger
- **Responsive Design**: Optimized for different screen sizes and devices
- **TypeScript**: Fully typed for better development experience
- **Video Backgrounds**: Dynamic video backgrounds for immersive experience

## 🚀 Technologies Used

- **Next.js 15.4.2** - React framework with App Router
- **GSAP 3.13.0** - Professional-grade animation library
- **ScrollTrigger** - GSAP plugin for scroll-based animations
- **Tailwind CSS 4** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **Swiper** - Touch slider for mobile-friendly interactions
- **Three.js** - 3D graphics and animations

## 🎬 How It Works

### 1. Service Showcase Animation

```typescript
// Service cards with hover animations
const serviceCards = contentRef.current!.querySelectorAll(".service-card");
serviceCards.forEach((card) => {
  SectionAnimations.serviceCardHover(card as HTMLElement);
});
```

### 2. Portfolio Book Mechanics

```typescript
// Each portfolio piece turns based on scroll position
gsap
  .timeline({
    scrollTrigger: {
      trigger: pageElement,
      start: "top 60%",
      end: "bottom 40%",
      scrub: 1,
    },
  })
  .from(pageElement, {
    rotationY: index % 2 === 0 ? 180 : -180,
    duration: 1,
    ease: "power2.inOut",
  });
```

### 3. Design Scene Animations

```typescript
// Animated elements within each design scene
gsap.to(elements, {
  y: -10,
  duration: 2,
  repeat: -1,
  yoyo: true,
  stagger: 0.3,
  ease: "power2.inOut",
});
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   ├── HeaderMenu.tsx      # Navigation menu
│   ├── IntroductionBanner.tsx # Hero section with video background
│   ├── AboutSection.tsx    # Company information and statistics
│   ├── ServicesSection.tsx # Service offerings showcase
│   ├── PortfolioSection.tsx # Portfolio with 3D book
│   ├── Book3D.tsx          # Main book component with GSAP animations
│   ├── BookPage.tsx        # Individual portfolio page component
│   └── StoryScene.tsx      # Animated design scenes
├── contexts/
│   └── BookContext.tsx     # State management for book interactions
├── utils/
│   └── animations.ts       # Animation utilities and configurations
└── hooks/
    └── Custom hooks for reusable logic
```

## 🎨 Key Components

### IntroductionBanner Component

- Hero section with video background
- Animated content entrance
- Scroll-triggered animations
- Mobile-responsive design

### ServicesSection Component

- Interactive service cards with hover effects
- Swiper carousel for mobile
- Animated statistics counters
- Professional service descriptions

### AboutSection Component

- Company pillars showcase (Creativity, Craftsmanship, Sustainability)
- Animated statistics (years of experience, projects completed)
- Swiper carousel for pillar cards
- Smooth scroll animations

### Book3D Component

- Main orchestrator of portfolio animations
- Manages book opening and page turning
- Sets up ScrollTrigger instances
- Controls 3D perspective and transforms

### BookPage Component

- Individual portfolio page styling and layout
- Paper-like texture with ruled lines
- Page shadows and depth effects
- Content organization

### StoryScene Component

- Animated illustrations for each design project
- Multiple scene types (residential, commercial, luxury, sustainable)
- GSAP animations for floating and rotating elements
- Design-focused graphics and icons

## 🎯 Animation Techniques

### 3D CSS Transforms

```css
transform-style: preserve-3d;
perspective: 1000px;
transform-origin: left center; /* For page turning */
```

### GSAP ScrollTrigger Configuration

- **Scrub**: `scrub: 1` for smooth scroll-linked animations
- **Stagger**: `stagger: 0.15` for sequential element animation
- **Easing**: `power2.out` for natural motion curves

### Service Card Hover Effects

- Scale and shadow transformations
- Smooth color transitions
- Interactive feedback for user engagement

## 🎨 Styling Approach

- **Neutral Color Palette**: Professional, design-focused aesthetic
- **Paper Texture**: Subtle grid background pattern for book pages
- **Typography**: Mix of sans-serif and serif fonts for hierarchy
- **Shadows**: Multiple shadow layers for depth and dimension
- **Gradients**: Smooth color transitions and overlays

## 🚀 Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Run Development Server**

   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

4. **Experience the Portfolio**
   - Scroll down to explore services
   - Continue scrolling to view portfolio book
   - Watch design scenes animate as they appear

## 🔧 Customization

### Adding New Services

```typescript
const services = [
  {
    title: "Your New Service",
    description: "Your service description here...",
    icon: "Your SVG icon",
    image: "/photos/your-service.jpg",
  },
];
```

### Creating New Design Scenes

Add a new case in `StoryScene.tsx`:

```typescript
case 'your-design-type':
  return (
    <div className="relative w-48 h-32 mx-auto">
      {/* Your custom design scene elements */}
    </div>
  );
```

### Adjusting Animation Timing

Modify ScrollTrigger parameters:

```typescript
scrollTrigger: {
  start: "top 60%",    // When animation starts
  end: "bottom 40%",   // When animation ends
  scrub: 1,           // Smoothness (0-1)
}
```

## 🎭 Performance Optimizations

- **GSAP Registration**: Conditional plugin registration for SSR
- **Element Queries**: Efficient DOM selections
- **Animation Cleanup**: Proper ScrollTrigger disposal
- **Transform Optimization**: Hardware-accelerated 3D transforms
- **Video Optimization**: Compressed video backgrounds

## 🌟 Best Practices Implemented

1. **Progressive Enhancement**: Works without JavaScript
2. **Accessibility**: Semantic HTML structure and ARIA labels
3. **Performance**: Optimized animations and transforms
4. **Responsive Design**: Adapts to different screen sizes
5. **Type Safety**: Full TypeScript implementation
6. **Clean Code**: Modular component architecture
7. **Mobile-First**: Touch-friendly interactions

## 🎨 Visual Design Principles

- **Depth**: Layered shadows and 3D transforms
- **Motion**: Natural, physics-inspired animations
- **Hierarchy**: Clear visual information structure
- **Consistency**: Unified color palette and spacing
- **Delight**: Unexpected animation details
- **Professional**: Interior design industry standards

## 📱 Browser Support

- Modern browsers with CSS 3D transform support
- Chrome 36+, Firefox 16+, Safari 9+
- Mobile browsers with touch scroll support

## 🔮 Future Enhancements

- **Project Galleries**: Detailed project showcases
- **Client Testimonials**: Interactive testimonial carousel
- **Contact Forms**: Integrated contact functionality
- **Blog Integration**: Design insights and trends
- **Virtual Tours**: 3D room walkthroughs
- **Booking System**: Consultation scheduling
- **Multi-language Support**: Internationalization
- **Touch Gestures**: Swipe to navigate on mobile

---

**Built with ❤️ for Interior Design Excellence using Next.js and GSAP**
