"use client";

import BookAnimation from '../components/BookAnimation';
import ProgressIndicator from '../components/ProgressIndicator';

export default function Home() {
  return (
    <div className="relative w-full">
      {/* Overlay Header - Constrained positioning */}
      {/* <header className="fullscreen-header" role="banner">
        <div className="container mx-auto max-w-6xl h-full flex flex-col justify-center px-4">
          <h1 className="text-2xl md:text-3xl font-light tracking-wider text-center">
            ARTISTRY
          </h1>
          <p className="text-center text-zinc-600 mt-1 text-xs md:text-sm font-light tracking-wide">
            A Visual Journey Through Art, Design & Photography
          </p>
        </div>
      </header> */}

      {/* Book Container */}
      <main className="relative" role="main" aria-label="Interactive art book">
        <BookAnimation />
      </main>

      {/* Overlay Progress Indicator */}
      <ProgressIndicator totalPages={10} />

      {/* Overlay Scroll Instruction */}
      <div className="fullscreen-scroll-instruction" role="note" aria-label="Scroll instruction">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="animate-pulse">
            <div className="w-6 h-12 border border-zinc-400 rounded-full flex justify-center items-start opacity-60">
              <div className="w-px h-4 bg-zinc-400 rounded-full mt-3 animate-bounce"></div>
            </div>
          </div>
          <p className="text-zinc-500 text-xs font-light tracking-wide uppercase text-center">Scroll to continue</p>
        </div>
      </div>

      {/* Overlay Footer */}
      {/* <footer className="fullscreen-footer" role="contentinfo">
        <div className="container mx-auto h-full flex items-center justify-center px-4">
          <p className="text-xs font-light opacity-70 tracking-wide">
            Curated Digital Exhibition • Built with Next.js & GSAP
          </p>
        </div>
      </footer> */}
    </div>
  );
}
