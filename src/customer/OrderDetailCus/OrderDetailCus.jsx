import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderDetails } from '../../APIcontroller/API';
import './OrderDetailCus.css';
import Header from '../../components/Header/header';
import FeedbackModal from '../../components/FeedbackModal/FeedbackModal';

const OrderDetailCus = () => {
  const [orderData, setOrderData] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { orderId } = useParams(); // Assuming you're using react-router and have the orderId in the URL

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await getOrderDetails(orderId);
        setOrderData(data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        // Handle error appropriately
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  // Add simple formatting functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      1: 'Chờ xác nhận',
      2: 'Đã xác nhận',
      3: 'Đang thực hiện',
      4: 'Hoàn thành',
       5: 'Đã hủy'
    };
    return statusMap[status] || 'Unknown';
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      // Here you would call your API to submit the feedback
      console.log('Feedback submitted:', feedbackData);
      // Add your API call here
      // await submitFeedback(feedbackData);
      
      // Show success message
      alert('Cảm ơn bạn đã gửi đánh giá!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.');
    }
  };

  if (!orderData) return <div>Loading...</div>;

  return (
    <div className="odc-container">
      <Header />
      <h2 style={{textAlign: 'center'}}>Chi tiết đơn hàng #{orderData.orderId}</h2>
      <div className="odc-info-container">
      {orderData.status === 4 && (
              <button 
                className="odc-feedback-btn"
                onClick={() => setShowFeedbackModal(true)}
              >
                Gửi đánh giá
              </button>
            )}
        <div className="odc-info">
          <div className="odc-info-group">
            <p><strong>Ngày đặt:</strong> {formatDate(orderData.orderDate)}</p>
            <p><strong>Thời gian thực hiện:</strong> {formatDate(orderData.startDate)} - {formatDate(orderData.endDate)}</p>
            <p><strong>Trạng thái:</strong> <span className={`odc-status odc-status-${orderData.status}`}>{getStatusLabel(orderData.status)}</span></p>
           
          </div>
        </div>
        
        <div className="odc-services-list">
          <h3>Dịch vụ đã đặt</h3>
          {orderData.orderDetails.map((detail) => (
            <div key={detail.detailId} className="odc-service-card">
              <div className="odc-service-header">
                <h4>{detail.serviceName}</h4>
                <span className="odc-price">{formatPrice(detail.orderPrice)} VNĐ</span>
              </div>
              <p className="odc-martyr-name"><strong>Liệt sĩ:</strong> {detail.martyrName}</p>
              <div className="odc-staff-list">
                <strong>Nhân viên thực hiện:</strong>
                {detail.staffs.map((staff) => (
                  <span key={staff.accountId} className="odc-staff-name">{staff.staffFullName}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="odc-order-total">
          <h3>Tổng tiền: {formatPrice(orderData.totalPrice)} VNĐ</h3>
        </div>
      </div>
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        orderId={orderId}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default OrderDetailCus;
