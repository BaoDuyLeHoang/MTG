import React, { useState, useEffect, useCallback } from "react";
import "./imageSlider.css";

const Slider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  // Auto-slide functionality
  useEffect(() => {
    if (!isPaused) {
      const slideInterval = setInterval(goToNext, 3000); // Change slide every 3 seconds
      return () => clearInterval(slideInterval);
    }
  }, [isPaused, goToNext]);

  // Add pause on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div 
      className="slider"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button onClick={goToPrevious} className="left-arrow">
        ❮
      </button>
      <div className="imageSlider-container">
        <img 
          src={images[currentIndex]} 
          alt={`slide-${currentIndex}`}
          style={{ opacity: 1 }}
        />
      </div>
      <button onClick={goToNext} className="right-arrow">
        ❯
      </button>
      <div className="dots-container">
        {images.map((_, index) => (
          <div
            key={index}
            className={`dot ${currentIndex === index ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
