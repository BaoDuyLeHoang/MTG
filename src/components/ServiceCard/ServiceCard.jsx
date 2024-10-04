import React from "react";
import "./ServiceCard.css";
import image1 from '../../assets/images/image1.png'
const ServiceCard = ({ title, description, imageSrc }) => {
  return (
    <div className="container">
      <div className="image-wrapper">
        <img src={image1} alt={title} className="image" />
      </div>
      <h4 className="card-title">{title}</h4>
      <p className="description">{description}</p>
    </div>
  );
};

export default ServiceCard;
