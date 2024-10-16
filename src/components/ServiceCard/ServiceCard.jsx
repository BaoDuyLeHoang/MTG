import React from "react";
import "./ServiceCard.css";
import image1 from '../../assets/images/image1.png'
const ServiceCard = ({ categoryName, description, imageSrc }) => {
  return (
    <div className="container">
      <div className="image-wrapper">
        <img src={image1} alt={categoryName} className="image" />
      </div>
      <h4 className="card-title">{categoryName}</h4>
      <p className="description">{description}</p>
    </div>
  );
};

export default ServiceCard;
