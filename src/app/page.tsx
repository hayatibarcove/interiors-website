"use client";

import BookAnimation from '../components/BookAnimation';

export default function Home() {
  return (
    <div className="fullscreen-layout">
      {/* Fullscreen Container - No Native Scrolling */}
      <div className="fullscreen-container">
        
        {/* Floating Header - Minimal Overlay */}
        <header className="floating-header">
          <div className="header-content">
            <h1 className="font-display text-2xl md:text-3xl font-light tracking-wider text-center text-zinc-800">
              ARTISTRY
            </h1>
            <p className="font-body text-center text-zinc-600 mt-1 text-xs md:text-sm font-light tracking-wide">
              A Visual Journey Through Art, Design & Photography
            </p>
          </div>
        </header>

        {/* Centered Book Container */}
        <main className="book-stage">
          <div className="book-wrapper">
            <BookAnimation />
          </div>
        </main>

        {/* Progress Indicator - Right Side */}
        <aside className="progress-sidebar">
          <div className="progress-container">
            <div className="progress-label">
              <span className="font-body text-xs text-zinc-500 font-light tracking-wide uppercase">
                Progress
              </span>
            </div>
            <div className="progress-bars">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
                <div
                  key={page}
                  className="progress-bar"
                  data-page={page}
                >
                  <div 
                    className="progress-fill page-progress"
                    data-page={page}
                    style={{ height: '0%' }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Scroll Instruction - Bottom Center */}
        <div className="scroll-instruction-container">
          <div className="scroll-instruction">
            <div className="scroll-mouse">
              <div className="scroll-wheel"></div>
            </div>
            <p className="font-body text-zinc-500 text-xs mt-3 font-light tracking-wide uppercase">
              Scroll to Explore
            </p>
          </div>
        </div>

        {/* Floating Footer - Minimal Credits */}
        <footer className="floating-footer">
          <div className="footer-content">
            <p className="font-body text-xs font-light text-zinc-500 tracking-wide">
              Built with Next.js & GSAP • Interactive 3D Experience
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}
