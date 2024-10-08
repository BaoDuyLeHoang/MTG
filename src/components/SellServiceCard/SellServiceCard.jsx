import React from "react";
import "./SellServiceCard.css";

const SellServiceCard = ({ serviceName, title, price, imagePath }) => {
  return (
    <div className="sell-service-card">
      <img src={imagePath} alt={serviceName} className="sell-service-card-image" />
      <div className="sell-service-card-content">
        <h3 className="sell-service-card-title">{serviceName}</h3>
        <p className="sell-service-card-price">{price}</p>
      </div>
    </div>
  );
};

export default SellServiceCard;
