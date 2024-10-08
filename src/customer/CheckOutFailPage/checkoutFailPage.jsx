import React from 'react';
import './checkoutFailPage.css';
import failImage from '../../assets/images/fail.png'; // Make sure to add this image to your assets folder
import { useNavigate } from 'react-router-dom';

const CheckoutFailPage = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate('/'); // Navigate to the home page
  };

  return (
    <div className="checkout-fail-page">
      <div className="fail-content">
        <img src={failImage} alt="Fail" className="fail-image" />
        <h1 className="fail-message">GIAO DỊCH THẤT BẠI</h1>
        <p className="fail-description">
          Rất tiếc, giao dịch của bạn không thể hoàn thành. Vui lòng thử lại sau hoặc liên hệ với chúng tôi để được hỗ trợ.
        </p>
        <button className="return-home-button" onClick={handleReturnHome}>
          Trở về trang chủ
        </button>
      </div>
    </div>
  );
};

export default CheckoutFailPage;
