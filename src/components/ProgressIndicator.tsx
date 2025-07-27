"use client";

import React, { useEffect, useState } from 'react';

interface ProgressIndicatorProps {
  totalPages: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ totalPages }) => {
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    // Listen for scroll events to update progress
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate progress based on scroll position
      const scrollProgress = scrollTop / (documentHeight - windowHeight);
      const currentPage = Math.floor(scrollProgress * totalPages);
      
      setActivePage(Math.min(currentPage, totalPages - 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalPages]);

  return (
    <div className="fullscreen-progress" role="progressbar" aria-label="Book progress">
      {/* Desktop: Vertical bars */}
      <div className="hidden md:flex flex-col space-y-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <div
            key={index}
            className="w-0.5 h-6 bg-stone-200/60 rounded-full overflow-hidden"
          >
            <div 
              className="w-full bg-zinc-700 rounded-full transition-all duration-500 ease-out page-progress"
              data-page={index}
              style={{ 
                height: index <= activePage ? '100%' : '0%',
                transition: 'height 0.5s ease-out'
              }}
              aria-label={`Page ${index + 1} progress`}
            ></div>
          </div>
        ))}
      </div>
      
      {/* Mobile: Horizontal circles */}
      <div className="flex md:hidden flex-row space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-500 ease-out mobile-page-progress ${
              index <= activePage ? 'active' : ''
            }`}
            data-page={index}
            aria-label={`Page ${index + 1} progress`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator; 