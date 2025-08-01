import React from 'react';
import Image from 'next/image';

interface PillarCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

const PillarCard: React.FC<PillarCardProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  className = ""
}) => {
  return (
    <div 
      className={`pillar-card rounded-xl shadow-lg overflow-hidden flex-shrink-0 ${className}`}
      style={{ 
        background: 'var(--secondary-background)',
        willChange: 'transform, opacity',
        transform: 'translateZ(0)' // Force hardware acceleration
      }}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={400}
          height={300}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h4 className="text-xl font-serif mb-2" style={{ color: 'var(--foreground)' }}>
          {title}
        </h4>
        <p className="text-sm font-sans" style={{ color: 'var(--typography-secondary)' }}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default PillarCard; 