"use client";

import BookAnimation from '../components/BookAnimation';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-stone-100">
      {/* Fixed Header Overlay - Art Gallery Style */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200 text-zinc-900 shadow-sm"
        style={{ height: 'var(--header-height, 88px)' }}
      >
        <div className="container mx-auto max-w-6xl h-full flex flex-col justify-center px-4">
          <h1 className="text-2xl md:text-3xl font-light tracking-wider text-center">
            ARTISTRY
          </h1>
          <p className="text-center text-zinc-600 mt-1 text-xs md:text-sm font-light tracking-wide">
            A Visual Journey Through Art, Design & Photography
          </p>
        </div>
      </header>

      {/* Main Book Container with Dynamic Sizing */}
      <main 
        className="relative"
        style={{
          paddingTop: 'var(--header-height, 88px)',
          paddingBottom: 'var(--footer-height, 52px)',
          minHeight: '100vh'
        }}
      >
        <BookAnimation />
      </main>

      {/* Progress Indicator - Minimalist Design */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40">
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
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Instruction - Gallery Style */}
      <div 
        className="fixed left-1/2 transform -translate-x-1/2 z-40 text-center scroll-instruction"
        style={{ bottom: 'calc(var(--footer-height, 52px) + 2rem)' }}
      >
        <div className="animate-pulse">
          <div className="w-6 h-12 border border-zinc-400 rounded-full flex justify-center opacity-60">
            <div className="w-px h-4 bg-zinc-400 rounded-full mt-3 animate-bounce"></div>
          </div>
        </div>
        <p className="text-zinc-500 text-xs mt-3 font-light tracking-wide uppercase">Begin Journey</p>
      </div>

      {/* Fixed Footer Overlay - Gallery Credits Style */}
      <footer 
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-stone-200 text-zinc-600 text-center"
        style={{ height: 'var(--footer-height, 52px)' }}
      >
        <div className="container mx-auto h-full flex items-center justify-center px-4">
          <p className="text-xs font-light opacity-70 tracking-wide">
            Curated Digital Exhibition • Built with Next.js & GSAP
          </p>
        </div>
      </footer>
    </div>
  );
}
