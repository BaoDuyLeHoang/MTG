import React from 'react';
import './SellServiceCard.css';

const SellServiceCard = ({ image, title, price }) => {
  return (
    <div className="sell-service-card">
      <img src={image} alt={title} className="sell-service-card-image" />
      <div className="sell-service-card-content">
        <h3 className="sell-service-card-title">{title}</h3>
        <p className="sell-service-card-price">{price}</p>
      </div>
    </div>
  );
};

export default SellServiceCard;
