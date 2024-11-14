import React from "react";
import "./SellServiceCard.css";

const SellServiceCard = ({ serviceName, price, imagePath, description }) => {
  return (
    <div className="sell-service-card">
      <div className="sell-service-card-image-container">
        <img src={imagePath} alt={serviceName} className="sell-service-card-image" />
      </div>
      <div className="sell-service-card-content">
        <h3 className="sell-service-card-title">{serviceName}</h3>
        <p className="sell-service-card-description">{description}</p>
        <div className="sell-service-card-footer">
          <p className="sell-service-card-price">{price} đ</p>
          <button className="sell-service-card-button">Chi tiết</button>
        </div>
      </div>
    </div>
  );
};

export default SellServiceCard;
