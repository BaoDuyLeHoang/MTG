import React from "react";
import "./ServiceCard.css";


const ServiceCard = ({ categoryName, description, urlImageCategory }) => {
  return (
    <div className="service-card">
      <div className="service-card__image-wrapper">
        <img 
          src={urlImageCategory} // Use provided imageSrc or fallback to default
          alt={categoryName}
          className="service-card__image"
          loading="lazy" // Add lazy loading for better performance
        />
      </div>
      <div className="service-card__content">
        <h4 className="service-card__title">{categoryName}</h4>
        <p className="service-card__description">{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
