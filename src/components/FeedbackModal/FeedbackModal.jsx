import React, { useState } from 'react';
import './FeedbackModal.css';
import { Dialog, DialogTitle, DialogContent, Rating, TextField, DialogActions, Button } from '@mui/material';

const FeedbackModal = ({ isOpen, onClose, serviceName, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (!rating) {
      alert('Vui lòng chọn số sao đánh giá!');
      return;
    }

    onSubmit({
      rating,
      content: feedback
    });

    // Reset form
    setRating(0);
    setFeedback('');
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        Đánh giá dịch vụ: {serviceName}
      </DialogTitle>
      <DialogContent>
        <Rating
          value={rating}
          onChange={(_, newValue) => setRating(newValue)}
        />
        <TextField
          multiline
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          label="Nội dung đánh giá"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit}>Gửi đánh giá</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackModal;
