import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderDetails, createFeedback } from '../../../APIcontroller/API';
import { getFeedbackWithDetailId } from '../../../services/feedback';
import './OrderDetailCus.css';
import Header from '../../../components/Header/header';
import Footer from '../../../components/Footer/footer';
import FeedbackModal from '../../../components/FeedbackModal/FeedbackModal';
import { useAuth } from '../../../context/AuthContext';
import AlertMessage from '../../../components/AlertMessage/AlertMessage';
import { FaStar, FaRegClock, FaComment, FaReply } from 'react-icons/fa';

const OrderDetailCus = () => {
  const [orderData, setOrderData] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { orderId } = useParams(); // Assuming you're using react-router and have the orderId in the URL
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [feedbacks, setFeedbacks] = useState({});

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!user || !user.accountId) {
          console.error('User information not available');
          return;
        }
        const data = await getOrderDetails(orderId, user.accountId);
        setOrderData(data);
        
        // Fetch feedback for each detail
        const feedbackPromises = data.orderDetails.map(detail =>
          getFeedbackWithDetailId(detail.detailId)
        );
        const feedbackResults = await Promise.all(feedbackPromises);
        
        // Create an object with detailId as key and feedback as value
        const feedbackMap = {};
        data.orderDetails.forEach((detail, index) => {
          feedbackMap[detail.detailId] = feedbackResults[index];
        });
        setFeedbacks(feedbackMap);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, user]);

  // Add simple formatting functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Sử dụng định dạng 24 giờ
    });
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      0: 'Đang chờ',
      1: 'Đã thanh toán',
      2: 'Đã thất bại',
      4: 'Hoàn thành'
    };
    return statusMap[status] || 'Unknown';
  };

  const getTaskStatusLabel = (statusTask) => {
    const taskStatusMap = {
      0: 'Đang chờ',
      1: 'Đang bàn giao',
      2: 'Từ chối',
      3: 'Đang thực hiện',
      4: 'Hoàn thành',
      5: 'Thất bại'
    };
    return taskStatusMap[statusTask] || 'Unknown';
  };

  const getTaskStatusClass = (statusTask) => {
    const statusClassMap = {
      0: 'status-waiting',
      1: 'status-transferring',
      2: 'status-rejected',
      3: 'status-in-progress',
      4: 'status-completed',
      5: 'status-failed'
    };
    return statusClassMap[statusTask] || '';
  };

  const RatingStars = ({ rating }) => {
    return (
      <div className="rating-stars">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={index < rating ? 'star-filled' : 'star-empty'}
          />
        ))}
      </div>
    );
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      const feedback = {
        accountId: user.accountId,
        detailId: selectedService.detailId,
        content: feedbackData.content,
        rating: feedbackData.rating
      };

      await createFeedback(feedback);
      
      // Thay alert bằng AlertMessage
      setAlertMessage('Cảm ơn bạn đã gửi đánh giá!');
      setAlertSeverity('success');
      setAlertOpen(true);
      setShowFeedbackModal(false);
      
      // Refresh lại data
      const updatedData = await getOrderDetails(orderId, user.accountId);
      setOrderData(updatedData);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Thay alert bằng AlertMessage
      setAlertMessage('Bạn đã đánh giá đơn này rồi!');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  // Thêm hàm formatDateOnly để chỉ hiển thị ngày tháng năm
  const formatDateOnly = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (!orderData) return <div>Loading...</div>;

  return (
    <div className="odc-container">
      <Header />
      <h2 className="odc-title">Chi tiết đơn hàng #{orderData.orderId}</h2>
      <div className="odc-info-container">
        <div className="odc-info">
          <div className="odc-info-group">
            <p>
              <strong>Ngày đặt:</strong>
              <span>{formatDate(orderData.orderDate)}</span>
            </p>
            <p>
              <strong>Thời gian thực hiện:</strong>
              <span>{formatDateOnly(orderData.orderDate)} - {formatDateOnly(orderData.expectedCompletionDate)}</span>
            </p>
            <p>
              <strong>Trạng thái đơn hàng:</strong>
              <span className={`odc-status odc-status-${orderData.status}`}>
                {getStatusLabel(orderData.status)}
              </span>
            </p>
          </div>
        </div>
        
        <div className="odc-services-list">
          <h3>Dịch vụ đã đặt</h3>
          {orderData.orderDetails.map((detail) => (
            <div key={detail.detailId} className="odc-service-card">
              <div className="odc-service-info">
                <div className="odc-service-header">
                  <div className="odc-service-title-price">
                    <h4>{detail.serviceName}</h4>
                    <div className="odc-price-tag">
                      <span className="odc-price">{formatPrice(detail.orderPrice)} VNĐ</span>
                    </div>
                  </div>
                </div>
                <div className="odc-service-details">
                  <p><strong>Liệt sĩ:</strong> {detail.martyrName}</p>
                  <p>
                    <strong>Trạng thái công việc:</strong> 
                    <span className={`odc-status ${getTaskStatusClass(detail.staffs?.length === 0 ? 0 : detail.statusTask)}`}>
                      {detail.staffs?.length === 0 ? 'Đang chờ' : getTaskStatusLabel(detail.statusTask)}
                    </span>
                  </p>
                  <div className="odc-staff-info">
                    <strong>Nhân viên thực hiện:</strong>
                    {detail.staffs && detail.staffs.length > 0 ? (
                      detail.staffs.map((staff) => (
                        <span key={staff.accountId} className="odc-staff-name">
                          {staff.staffFullName}
                        </span>
                      ))
                    ) : (
                      <span className="odc-staff-name">Đang chờ phân công</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="odc-service-images">
                {[detail.imagePath1, detail.imagePath2, detail.imagePath3]
                  .filter(path => path) // Remove empty paths
                  .map((imagePath, index) => (
                    <img 
                      key={index}
                      src={imagePath}
                      alt={`Task image ${index + 1}`}
                      className="odc-service-image"
                    />
                ))}
              </div>

              {orderData.status === 4 && (
                <div className="odc-feedback-container">
                  {feedbacks[detail.detailId] ? (
                    <div className="odc-feedback-display">
                      <div className="odc-feedback-header">
                        <div className="odc-feedback-rating">
                          <RatingStars rating={feedbacks[detail.detailId].rating} />
                          <span className="rating-text">
                            {feedbacks[detail.detailId].rating}/5
                          </span>
                        </div>
                        <div className="odc-feedback-date">
                          <FaRegClock style={{ marginRight: '4px' }} />
                          {formatDate(feedbacks[detail.detailId].createdAt)}
                        </div>
                      </div>
                      <div className="odc-feedback-content">
                        <p className="feedback-label">
                          <FaComment style={{ marginRight: '8px' }} />
                          Đánh giá của bạn:
                        </p>
                        <p className="feedback-text">{feedbacks[detail.detailId].content}</p>
                      </div>
                      {feedbacks[detail.detailId].responseContent && (
                        <div className="odc-feedback-response-wrapper">
                          <div className="response-header">
                            <div className="response-date">
                              <FaRegClock style={{ marginRight: '4px' }} />
                              {formatDate(feedbacks[detail.detailId].updatedAt)}
                            </div>
                          </div>
                          <div className="odc-feedback-response">
                            <p className="response-label">
                              <FaReply style={{ marginRight: '8px' }} />
                              Phản hồi từ nhân viên:
                            </p>
                            <p className="response-text">
                              {feedbacks[detail.detailId].responseContent}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button 
                      className="odc-feedback-btn"
                      onClick={() => {
                        setSelectedService(detail);
                        setShowFeedbackModal(true);
                      }}
                    >
                      <FaComment />
                      Đánh giá dịch vụ
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="odc-order-total">
          <h3>Tổng tiền: {formatPrice(orderData.totalPrice)} VNĐ</h3>
        </div>
      </div>
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          setSelectedService(null);
        }}
        serviceName={selectedService?.serviceName}
        onSubmit={handleFeedbackSubmit}
      />
      <AlertMessage
        open={alertOpen}
        handleClose={handleAlertClose}
        severity={alertSeverity}
        message={alertMessage}
      />
      <Footer />
    </div>
  );
};

export default OrderDetailCus;
