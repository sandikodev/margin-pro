import React from 'react';

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-2 lg:gap-10 lg:overflow-visible ${className}`}>
      {children}
    </div>
  );
};

export const CarouselItem: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`min-w-[85%] sm:min-w-[350px] lg:min-w-0 flex-shrink-0 snap-center ${className}`}>
      {children}
    </div>
  );
};
