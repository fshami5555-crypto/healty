import React, { useState, useEffect } from 'react';

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-lg">
      <img
        key={currentIndex}
        src={images[currentIndex]}
        alt={`carousel-image-${currentIndex}`}
        className="w-full h-full object-cover animate-fadeIn"
      />
      <div className="absolute inset-0 bg-black/20"></div>
    </div>
  );
};

export default Carousel;
