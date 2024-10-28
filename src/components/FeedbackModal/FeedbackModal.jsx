import React, { useState } from 'react';
import './FeedbackModal.css';

const FeedbackModal = ({ isOpen, onClose, orderId, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ orderId, rating, comment });
    setRating(5);
    setComment('');
    onClose();
  };

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal">
        <button className="close-button" onClick={onClose}>&times;</button>
        
        <h2>Đánh giá dịch vụ</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="rating-container">
            <label>Đánh giá của bạn:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= rating ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="comment-container">
            <label>Nhận xét:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Hãy chia sẻ trải nghiệm của bạn..."
              rows="4"
            />
          </div>

          <div className="button-container">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="submit-btn">
              Gửi đánh giá
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
