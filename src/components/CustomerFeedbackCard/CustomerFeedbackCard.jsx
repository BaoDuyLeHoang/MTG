import React from "react";
import "./CustomerFeedbackCard.css";
import image1 from "../../assets/images/image1.png";

const CustomerFeedbackCard = () => {
  return (
    <div className="review-card">
      <div className="review-card-content">
        <div className="stars-container">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className={`star ${index < 5 ? "filled" : ""}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
          ))}
        </div>
        <h3 className="review-title">Phan hoi ve dich vu bao duong mo</h3>
        <p className="review-body">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloribus
          sunt nemo aliquid 
        </p>
        <div className="reviewer">
          <img
            className="avatar"
            src={image1}
            alt={`Nguyen Van A avatar`}
          />
          <div className="reviewer-info">
            <p className="reviewer-name">Nguyen Van A</p>
            <p className="review-date">09/10/2423</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerFeedbackCard;
