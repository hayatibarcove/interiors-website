"use client";

import BookAnimation from '../components/BookAnimation';
import ProgressIndicator from '../components/ProgressIndicator';
import ScrollInstruction from '../components/ScrollInstruction';

export default function Home() {
  return (
    <div className="relative w-full">
      {/* Overlay Header - Constrained positioning */}
      {/* <header className="fullscreen-header" role="banner">
        <div className="container mx-auto max-w-6xl h-full flex flex-col justify-center px-4">
          <h1 className="text-2xl md:text-3xl font-light tracking-wider text-center">
            INTERIORS
          </h1>
          <p className="text-center text-stone-600 mt-1 text-xs md:text-sm font-light tracking-wide">
            A Portfolio of Interior Design Excellence
          </p>
        </div>
      </header> */}

      {/* Book Container */}
      <main className="relative" role="main" aria-label="Interactive interior design portfolio">
        <BookAnimation />
      </main>

      {/* Overlay Progress Indicator */}
      <ProgressIndicator totalPages={10} />

      {/* Enhanced Scroll Instruction */}
      <ScrollInstruction text="Scroll to explore" />

      {/* Overlay Footer */}
      {/* <footer className="fullscreen-footer" role="contentinfo">
        <div className="container mx-auto h-full flex items-center justify-center px-4">
          <p className="text-xs font-light opacity-70 tracking-wide">
            Interior Design Portfolio • Built with Next.js & GSAP
          </p>
        </div>
      </footer> */}
    </div>
  );
}
