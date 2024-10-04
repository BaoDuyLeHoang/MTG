import React, { useState } from "react";
import "./imageSlider.css";

const Slider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="slider">
      <button onClick={goToPrevious} className="left-arrow">
        ❮
      </button>
      <div className="image-container">
        <img src={images[currentIndex]} alt="slider-img" />
      </div>
      <button onClick={goToNext} className="right-arrow">
        ❯
      </button>
    </div>
  );
};

export default Slider;
