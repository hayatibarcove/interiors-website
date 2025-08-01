"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'wide';
  objectFit?: 'cover' | 'contain';
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  srcSet?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  aspectRatio = 'landscape',
  objectFit = 'contain',
  className = '',
  style = {},
  // loading = 'lazy',
  // sizes,
  // srcSet,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const containerClasses = [
    'image-container',
    `image-container--${aspectRatio}`,
    className
  ].filter(Boolean).join(' ');

  const imageClasses = [
    'responsive-image',
    `responsive-image--${objectFit}`,
    'scene-element',
    isLoaded ? 'opacity-100' : 'opacity-0',
    'transition-opacity duration-300'
  ].join(' ');

  return (
    <div className={containerClasses} style={style}>
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-gray-500">
          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="scene-caption">Image not found</span>
        </div>
      )}

      {/* Actual image */}
      {!hasError && (
        <Image
          src={src}
          alt={alt}
          fill
          className={imageClasses}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            objectFit: objectFit,
          }}
        />
      )}
    </div>
  );
};

export default ResponsiveImage;

// Example usage in story scenes:

// Basic responsive image
// <ResponsiveImage
//   src="/images/bauhaus-poster.jpg"
//   alt="Bauhaus poster design"
//   aspectRatio="portrait"
//   objectFit="cover"
// />

// Responsive image with srcSet for different screen densities
// <ResponsiveImage
//   src="/images/golden-ratio.jpg"
//   srcSet="/images/golden-ratio@1x.jpg 1x, /images/golden-ratio@2x.jpg 2x"
//   sizes="(max-width: 768px) 100vw, 50vw"
//   alt="Golden ratio visualization"
//   aspectRatio="square"
//   objectFit="contain"
//   className="scene-element"
// />

// Lazy-loaded portrait image
// <ResponsiveImage
//   src="/images/street-photography.jpg"
//   alt="Street photography example"
//   aspectRatio="landscape"
//   objectFit="cover"
//   loading="lazy"
//   onLoad={() => console.log('Image loaded successfully')}
//   onError={() => console.log('Failed to load image')}
// /> 