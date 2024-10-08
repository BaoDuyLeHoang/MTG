import React from 'react';
import './checkoutSuccessPage.css';
import successImage from '../../assets/images/success.png'; // Make sure to add this image to your assets folder
import image from '../../assets/images/image.png';

const CheckoutSuccessPage = () => {
  return (
    <div className="checkout-success-page">
      <div className="success-content">
        <img src={image} alt="Success" className="success-image" />
        <div className="success-message">
          <h1>GIAO DỊCH THÀNH CÔNG</h1>
          <img src={successImage} alt="Success Icon" className="success-icon" />
        </div>
        <p className="thank-you-message">
          CẢM ƠN BẠN ĐÃ LUÔN TIN TƯỞNG VÀ SỬ DỤNG DỊCH VỤ CỦA CHÚNG TÔI
        </p>
        <div className="action-buttons">
          <button className="home-button">Trở về trang chủ</button>
          <button className="history-button">Lịch sử giao dịch</button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
