"use client";

import BookAnimation from '../components/BookAnimation';

export default function Home() {
  return (
    <div className="relative w-full">
      {/* Overlay Header - Constrained positioning */}
      <header className="fullscreen-header" role="banner">
        <div className="container mx-auto max-w-6xl h-full flex flex-col justify-center px-4">
          <h1 className="text-2xl md:text-3xl font-light tracking-wider text-center">
            ARTISTRY
          </h1>
          <p className="text-center text-zinc-600 mt-1 text-xs md:text-sm font-light tracking-wide">
            A Visual Journey Through Art, Design & Photography
          </p>
        </div>
      </header>

      {/* Book Container */}
      <main className="relative" role="main" aria-label="Interactive art book">
        <BookAnimation />
      </main>

      {/* Overlay Progress Indicator */}
      <div className="fullscreen-progress" role="progressbar" aria-label="Book progress">
        <div className="flex flex-col space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
            <div
              key={page}
              className="w-0.5 h-6 bg-stone-200/60 rounded-full overflow-hidden"
            >
              <div 
                className="w-full bg-zinc-700 rounded-full transition-all duration-500 ease-out page-progress"
                data-page={page}
                style={{ height: '0%' }}
                aria-label={`Page ${page} progress`}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay Scroll Instruction */}
      <div className="fullscreen-scroll-instruction" role="note" aria-label="Scroll instruction">
        <div className="animate-pulse">
          <div className="w-6 h-12 border border-zinc-400 rounded-full flex justify-center opacity-60">
            <div className="w-px h-4 bg-zinc-400 rounded-full mt-3 animate-bounce"></div>
          </div>
        </div>
        <p className="text-zinc-500 text-xs mt-3 font-light tracking-wide uppercase">Begin Journey</p>
      </div>

      {/* Overlay Footer */}
      <footer className="fullscreen-footer" role="contentinfo">
        <div className="container mx-auto h-full flex items-center justify-center px-4">
          <p className="text-xs font-light opacity-70 tracking-wide">
            Curated Digital Exhibition • Built with Next.js & GSAP
          </p>
        </div>
      </footer>
    </div>
  );
}
