// components/ui/Carousel.js

import React, { useState } from 'react';

const Carousel = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded" onClick={prevImage}>
        &lt;
      </button>
      <img src={images[currentImageIndex]} alt={`Carousel Image ${currentImageIndex + 1}`} className="w-full" />
      <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded" onClick={nextImage}>
        &gt;
      </button>
    </div>
  );
};

export default Carousel;
