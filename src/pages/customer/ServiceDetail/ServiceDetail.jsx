import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/Header/header';
import Footer from '../../../components/Footer/footer';
import Loading from '../../../components/Loading/Loading';
import AlertMessage from '../../../components/AlertMessage/AlertMessage';
import { getServiceScheduleById, createAssignmentFeedback } from '../../../APIcontroller/API';
import './ServiceDetail.css';
import axios from 'axios';

const ServiceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [serviceDetail, setServiceDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState({
    content: '',
    rating: 0
  });
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    severity: 'success',
    message: ''
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const data = await getServiceScheduleById(id, user.accountId);
        setServiceDetail(data);
      } catch (error) {
        console.error("Error fetching service detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id && user?.accountId) {
      fetchServiceDetail();
    }
  }, [id, user]);

  const handleCloseAlert = () => {
    setAlertInfo(prev => ({
      ...prev,
      open: false
    }));
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading-container">
          <Loading text="Đang tải dữ liệu..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (!serviceDetail) {
    return (
      <div>
        <Header />
        <div className="error-message">Không tìm thấy thông tin dịch vụ</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Header />
      <div className="service-detail-container">
        <div className="service-detail-card">
          <div className="card-header">
            <h2>Chi tiết dịch vụ định kỳ</h2>
          </div>
          
          <div className="service-info">
            <div className="service-header">
              <img src={serviceDetail.serviceImage} alt={serviceDetail.serviceName} className="service-image" />
              <div className="service-basic-info">
                <h3>{serviceDetail.serviceName}</h3>
                <p className="amount">Số tiền: {serviceDetail.amount.toLocaleString()}đ</p>
                <p className="status">
                  Trạng thái:   
                  <span className={`status-badge ${serviceDetail.status === 1 ? 'active' : 'inactive'}`}>
                    {serviceDetail.status === 1 ? 'Hoạt động' : 'Ngừng'}
                  </span>
                </p>
              </div>
            </div>

            <div className="info-section">
              <h4>Thông tin liệt sĩ</h4>
              <div className="info-grid">
                <div className="info-item">
                  <label>Tên liệt sĩ:</label>
                  <span>{serviceDetail.martyrName}</span>
                </div>
                <div className="info-item">
                  <label>Khu vực:</label>
                  <span>{serviceDetail.areaNumber}</span>
                </div>
                <div className="info-item">
                  <label>Hàng số:</label>
                  <span>{serviceDetail.rowNumber}</span>
                </div>
                <div className="info-item">
                  <label>Mộ số:</label>
                  <span>{serviceDetail.martyrNumber}</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h4>Thông tin người đặt</h4>
              <div className="info-grid">
                <div className="info-item">
                  <label>Tên của bạn:</label>
                  <span>{serviceDetail.accountName}</span>
                </div>
                <div className="info-item">
                  <label>Số điện thoại:</label>
                  <span>{serviceDetail.phoneNumber}</span>
                </div>
                <div className="info-item">
                  <label>Ngày thực hiện:</label>
                  <span>{formatDate(serviceDetail.scheduleDate)}</span>
                </div>
                <div className="info-item">
                  <label>Ghi chú:</label>
                  <span>{serviceDetail.note || 'Không có'}</span>
                </div>
              </div>
            </div>

            {serviceDetail.latestAssignment && (
              <div className="info-section">
                <h4>Thông tin thực hiện gần nhất</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Nhân viên thực hiện:</label>
                    <span>{serviceDetail.latestAssignment.staffName}</span>
                  </div>
                  <div className="info-item">
                    <label>Số điện thoại nhân viên:</label>
                    <span>{serviceDetail.latestAssignment.phoneNumber}</span>
                  </div>
                  <div className="info-item">
                    <label>Trạng thái:</label>
                    <span>
                      {(() => {
                        const status = serviceDetail.latestAssignment.status;
                        if (status === 4) {
                          return (
                            <>
                              <span className="status-assignment-task-completed">Đã hoàn thành</span>
                              <button 
                                className="service-detail-feedback-button"
                                onClick={() => setShowFeedbackModal(true)}
                              >
                                Gửi đánh giá
                              </button>
                            </>
                          );
                        }
                        switch (status) {
                          case 1:
                            return 'Đang chờ';
                          case 2:
                            return 'Từ chối';
                          case 3:
                            return 'Đang thực hiện';
                          case 5:
                            return 'Thất bại';
                          default:
                            return 'Không xác định';
                        }
                      })()}
                    </span>
                  </div>
                </div>
                <div className="images-section">
                  <h5>Hình ảnh kết quả</h5>
                  <div className="image-grid">
                    {serviceDetail.latestAssignment.taskImages.map((imageData, index) => (
                      <div key={index} className="task-image-container">
                        <img 
                          src={imageData.imagePath} 
                          alt={`Hình ảnh ${index + 1}`} 
                          className="task-image" 
                          onClick={() => setSelectedImage(imageData.imagePath)}
                        />
                        <p className="image-date">
                          {formatDate(imageData.createAt)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {selectedImage && (
                    <div className="image-modal" onClick={() => setSelectedImage(null)}>
                      <img 
                        src={selectedImage} 
                        alt="Enlarged" 
                        className="modal-image"
                      />
                    </div>
                  )}
                </div>

                {showFeedbackModal && (
                  <div className="service-detail-feedback-modal">
                    <div className="service-detail-feedback-content">
                      <h3 className="service-detail-feedback-title">Đánh giá dịch vụ</h3>
                      <div className="service-detail-rating-container">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`service-detail-star ${star <= feedback.rating ? 'active' : ''}`}
                            onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <textarea
                        className="service-detail-feedback-textarea"
                        placeholder="Nhập nội dung đánh giá..."
                        value={feedback.content}
                        onChange={(e) => setFeedback(prev => ({ ...prev, content: e.target.value }))}
                      />
                      <div className="service-detail-feedback-actions">
                        <button 
                          className="service-detail-submit-feedback"
                          onClick={async () => {
                            try {
                              if (feedback.rating === 0) {
                                setAlertInfo({
                                  open: true,
                                  severity: 'warning',
                                  message: 'Vui lòng chọn số sao đánh giá!'
                                });
                                return;
                              }
                              await createAssignmentFeedback({
                                customerId: user.accountId,
                                assignmentTaskId: serviceDetail.latestAssignment.assignmentTaskId,
                                content: feedback.content,
                                rating: feedback.rating
                              });
                              setAlertInfo({
                                open: true,
                                severity: 'success',
                                message: 'Cảm ơn bạn đã gửi đánh giá!'
                              });
                              setShowFeedbackModal(false);
                            } catch (error) {
                              console.error('Error submitting feedback:', error);
                              setAlertInfo({
                                open: true,
                                severity: 'error',
                                message: 'Bạn đã gửi đánh giá này rồi!'
                              });
                            }
                          }}
                        >
                          Gửi đánh giá
                        </button>
                        <button 
                          className="service-detail-cancel-feedback"
                          onClick={() => setShowFeedbackModal(false)}
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <AlertMessage
        open={alertInfo.open}
        handleClose={handleCloseAlert}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <Footer />
    </div>
  );
};

export default ServiceDetail; 