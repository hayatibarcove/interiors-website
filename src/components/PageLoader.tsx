"use client";

import React from 'react';

interface PageLoaderProps {
  isVisible: boolean;
  type?: 'spinner' | 'dots' | 'pulse';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  isVisible, 
  type = 'spinner', 
  size = 'medium',
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const renderSpinner = () => (
    <div 
      className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-200 border-t-gray-600`}
      role="status"
      aria-label="Loading page content"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  const renderDots = () => (
    <div className="flex space-x-1" role="status" aria-label="Loading page content">
      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );

  const renderPulse = () => (
    <div 
      className={`${sizeClasses[size]} bg-gray-300 rounded-full animate-pulse`}
      role="status"
      aria-label="Loading page content"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      default:
        return renderSpinner();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`absolute inset-0 flex items-center justify-center z-50 pointer-events-none ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(1px)',
        transformStyle: 'preserve-3d'
      }}
      data-testid="page-loader"
    >
      <div className="flex flex-col items-center space-y-3">
        {renderLoader()}
        <p className="text-xs text-gray-500 font-light tracking-wide">
          Preparing content...
        </p>
      </div>
    </div>
  );
};

export default PageLoader; 