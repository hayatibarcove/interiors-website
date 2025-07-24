# Prompt: Advanced Scroll-Triggered Book Content Animation with GSAP

I want to upgrade my interactive book website by animating the content inside each book page as part of the scroll-driven page flip flow. The goal is for **each content element (title, subtitle, image, text, artist name)** to appear one-by-one with visually engaging GSAP animations, triggered by the scroll progress before advancing to the next page. The book/page flip mechanics, fullscreen centered layout, and UI theme should remain as they are.

Scroll behavior and animation flow will follow this timeline:

| Scroll % | Sequence                                               |
| -------- | ------------------------------------------------------ |
| 0%       | Book is closed (initial state)                         |
| 0–10%    | Book opens (rotateY from -60° to 0°)                   |
| 10–30%   | Page 1 flips (rotateY) → pauses on blank spread        |
| 30–50%   | Page 1 content animates in, elements appear one-by-one |
| 50–70%   | Page 2 flips (rotateY) → pauses on blank spread        |
| 70–90%   | Page 2 content animates in, elements appear one-by-one |
| 90–100%  | Continue to next pages or closing/end scene animation  |

## Recommended GSAP Animations for Page Content Elements

Each key element can have a unique yet cohesive animation for lively presentation, inspired by interactive storytelling examples like `nodcoding.com`:

- **Title**: Fade in with upward slide (`opacity: 0 → 1; y: 40 → 0`)
- **Subtitle**: Fade in with staggered delay and slight right slide (`opacity: 0 → 1; x: -30 → 0`)
- **Image/Artwork**: Scale up and fade in (`scale: 0.85 → 1; opacity: 0 → 1`)
- **Main Content Text**: Fade in with subtle word/group staggering (`opacity: 0 → 1; y: 24 → 0; stagger`)
- **Artist/Author Name**: Fade in and slide up with a small delay (`opacity: 0 → 1; y: 24 → 0`)
- Use `easing` for smoothness (`power3.out`, `expo.out`), and set `stagger` on groups like content paragraphs or list items.

## ScrollTrigger Timeline Adjustments

Structure your GSAP timeline so that:

1. Each content page is its own timeline segment (after the flip).
2. The flip and the content animation are **sequential** and tied to scroll, not overlapping.
3. The content animation completes (all elements revealed) before scroll can trigger the next page flip.

### Example GSAP Timeline Setup (Pseudo-code)

```
// Assume: .book, .page, .title, .subtitle, .image, .content, .artistName selectors
const master = gsap.timeline({
scrollTrigger: {
trigger: ".book-container",
start: "top top",
end: "bottom bottom",
scrub: true,
snap: {
snapTo: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1], // Snap at each stage
duration: {min: 0.2, max: 0.5},
},
}
});

// Book open
master.to(".book", { rotationY: 0, duration: 1, ease: "expo.inOut" }, "0%");

// Page 1 flip
master.to(".page-1", { rotationY: -180, duration: 1, ease: "power2.inOut" }, "10%");

// Blank spread pause (use set or short durations)

// Page 1 content animation (runs in sequence)
master.to(".page-1 .title", { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "30%");
master.to(".page-1 .subtitle", { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }, "+=0.1");
master.to(".page-1 .image", { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }, "+=0.1");
master.to(".page-1 .content", { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power2.out" }, "+=0.1");
master.to(".page-1 .artistName", { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "+=0.1");

// Page 2 flip and similar content timeline

// ...repeat for each page as needed
```

## Example CSS (Initial State)

```
.title, .subtitle, .image, .content, .artistName {
opacity: 0;
transform: translateY(40px); /* or X for subtitle, scale for image */
transition: none;
}
```

## Integration Guidelines

- Keep the UI, layout, theme, font family, and centering intact as before.
- Adjust/extend existing GSAP and ScrollTrigger timelines to include staggered content transitions between flips.
- Test on both desktop and touch devices for scroll/animation smoothness.

## References

- GSAP ScrollTrigger docs: Scroll-linked animation best practices and snapping.
- GSAP sequencing and stagger documentation for animating groups of elements.
- Inspiration for narrative content animation: [nodcoding.com](https://nodcoding.com/), [storytelling.plank.co](https://storytelling.plank.co/)

---

**Thank you! This setup will result in a lively, immersive interactive book where every content element arrives in sequence, driven by scroll, providing a delightful narrative experience.**
