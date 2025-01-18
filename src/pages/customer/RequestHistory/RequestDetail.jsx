import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRequestById, acceptServiceRequest, createRequestFeedback } from '../../../APIcontroller/API';
import Header from '../../../components/Header/header';
import Footer from '../../../components/Footer/footer';
import './RequestDetail.css';
import Button from '@mui/material/Button';
import { jwtDecode } from "jwt-decode";
import AlertMessage from '../../../components/AlertMessage/AlertMessage';
import Loading from '../../../components/Loading/Loading';
import { useAuth } from '../../../context/AuthContext';

const RequestDetail = () => {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState({
    content: '',
    rating: 0
  });
  const { user } = useAuth();

  const fetchRequestDetail = async () => {
    try {
      setLoading(true);
      const data = await getRequestById(requestId);
      setRequest(data);
    } catch (err) {
      setError(err.message);
      setAlertMessage(err.message);
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetail();
  }, [requestId]);

  const getStatusLabel = (status, typeId) => {
    const statusNum = parseInt(status);
    const typeNum = parseInt(typeId);

    if (typeNum === 1) {
      switch (statusNum) {
        case 1: return { text: 'Chờ xác nhận', class: 'pending' };
        case 2: return { text: 'Đã xác nhận', class: 'confirmed' };
        case 3: return { text: 'Từ chối', class: 'rejected' };
        case 7: return { text: 'Hoàn thành', class: 'completed' };
        case 8: return { text: 'Thất bại', class: 'failed' };
        default: return { text: 'Không xác định', class: 'unknown' };
      }
    }
    
    if (typeNum === 2) {
      switch (statusNum) {
        case 1: return { text: 'Chờ xác nhận', class: 'pending' };
        case 3: return { text: 'Từ chối', class: 'rejected' };
        case 4: return { text: 'Chờ phản hồi', class: 'waiting-response' };
        case 5: return { text: 'Đã phản hồi', class: 'responded' };
        case 6: return { text: 'Đang thực hiện', class: 'in-progress' };
        case 7: return { text: 'Hoàn thành', class: 'completed' };
        case 8: return { text: 'Thất bại', class: 'failed' };
        default: return { text: 'Không xác định', class: 'unknown' };
      }
    }
    
    if (typeNum === 3) {
      switch (statusNum) {
        case 1: return { text: 'Chờ xác nhận', class: 'pending' };
        case 2: return { text: 'Đã xác nhận', class: 'confirmed' };
        case 3: return { text: 'Từ chối', class: 'rejected' };
        default: return { text: 'Không xác định', class: 'unknown' };
      }
    }

    return { text: 'Không xác định', class: 'unknown' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleAcceptService = async () => {
    try {
      setIsProcessing(true);
      const token = localStorage.getItem('accessToken');
      const decodedToken = jwtDecode(token);
      
      const accountId = decodedToken.accountId;
      
      console.log('Decoded token:', decodedToken);
      console.log('Account ID:', accountId);

      if (!accountId) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      console.log('Sending request with:', { requestId: request.requestId, customerId: accountId });

      const response = await acceptServiceRequest(request.requestId, accountId);
      console.log('API Response:', response);
      
      // Refresh data sau khi xác nhận
      await fetchRequestDetail();
      
      setAlertMessage('Xác nhận dịch vụ thành công');
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (error) {
      console.error('Error details:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);

      let errorMessage = 'Có lỗi xảy ra khi xác nhận dịch vụ';
      
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || error.response.data || errorMessage;
        console.log('Error message extracted:', errorMessage);
      }

      setAlertMessage(errorMessage);
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="rd-container">
      <Header />
      <div className="rd-content">
        <Loading fullScreen={false} text="Đang tải chi tiết yêu cầu..." />
      </div>
      <Footer />
    </div>
  );

  if (error) return <div className="error">{error}</div>;
  if (!request) return <div className="not-found">Không tìm thấy yêu cầu</div>;

  return (
    <div className="rd-container">
      <Header />
      <div className="rd-content">
        <h2 className="rd-title">Chi Tiết Yêu Cầu</h2>
        
        <div className="rd-card">
          <div className="rd-section">
            <h3 className="rd-section-title">Thông Tin Yêu Cầu</h3>
            <div className="rd-row">
              <span className="rd-label">Mã yêu cầu:</span>
              <span className="rd-value">#{request.requestId}</span>
            </div>
            <div className="rd-row">
              <span className="rd-label">Loại yêu cầu:</span>
              <span className="rd-value">{request.requestTypeName}</span>
            </div>
            {request.serviceName && (
              <div className="rd-row">
                <span className="rd-label">Dịch vụ yêu cầu:</span>
                <span className="rd-value">{request.serviceName}</span>
              </div>
            )}
            <div className="rd-row">
              <span className="rd-label">Trạng thái:</span>
              <span className={`rd-status rd-status-${getStatusLabel(request.status, request.typeId).class}`}>
                {getStatusLabel(request.status, request.typeId).text}
              </span>
            </div>
            <div className="rd-row">
              <span className="rd-label">Ngày tạo:</span>
              <span className="rd-value">{formatDate(request.createAt)}</span>
            </div>
            <div className="rd-row">
              <span className="rd-label">Ngày hoàn thành dự kiến:</span>
              <span className="rd-value">
                {request.endDate ? formatDate(request.endDate) : 'Không áp dụng'}
              </span>
            </div>
            <div className="rd-row">
              <span className="rd-label">Tổng chi phí yêu cầu:</span>
              <span className="rd-value rd-price">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(request.price)}
              </span>
            </div>
          </div>

          <div className="rd-section">
            <h3 className="rd-section-title">Thông Tin Liệt Sĩ</h3>
            <div className="rd-row">
              <span className="rd-label">Mã mộ:</span>
              <span className="rd-value">{request.martyrCode}</span>
            </div>
            <div className="rd-row">
              <span className="rd-label">Tên liệt sĩ:</span>
              <span className="rd-value">{request.martyrName}</span>
            </div>
          </div>

          <div className="rd-section">
            <h3 className="rd-section-title">Thông Tin Người Yêu Cầu</h3>
            <div className="rd-row">
              <span className="rd-label">Họ tên:</span>
              <span className="rd-value">{request.customerName}</span>
            </div>
            <div className="rd-row">
              <span className="rd-label">Số điện thoại:</span>
              <span className="rd-value">{request.customerPhone}</span>
            </div>
          </div>

          {request.note && (
            <div className="rd-section">
              <h3 className="rd-section-title">Ghi Chú</h3>
              <div className="rd-note">{request.note}</div>
            </div>
          )}

          {request.price > 0 && (
            <div className="rd-section">
              <h3 className="rd-section-title">Thông Tin Thanh Toán</h3>
              <div className="rd-row">
                <span className="rd-label">Giá tiền:</span>
                <span className="rd-value rd-price">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(request.price)}
                </span>
              </div>
            </div>
          )}

          {/* Thông tin người quản lý */}
          {request.managerName && (
            <div className="rd-section">
              <h3 className="rd-section-title">Thông Tin Người Quản Lý</h3>
              <div className="rd-task-staff">
                <div className="rd-task-staff-info">
                  <span className="rd-task-label">Họ tên:</span>
                  <span className="rd-task-value">{request.managerName}</span>
                </div>
                <div className="rd-task-staff-info">
                  <span className="rd-task-label">Số điện thoại:</span>
                  <span className="rd-task-value">{request.managerPhoneNumber}</span>
                </div>
              </div>
            </div>
          )}

          {/* Phản hồi của quản lý */}
          {request.reasons && request.reasons.length > 0 && (
            <div className="rd-section">
              <h3 className="rd-section-title">Phản hồi của quản lý</h3>
              <div className="rd-reject-history">
                {request.reasons.map((reason, index) => (
                  <div key={index} className="rd-reject-item">
                    <div className="rd-reject-reason">
                      <span className="rd-reject-label">Nội dung:</span> {reason.rejectReason}
                    </div>
                    <div className="rd-reject-date">
                      <span className="rd-reject-label">Thời gian:</span>
                      {new Date(reason.rejectReason_CreateAt).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Task Section */}
          {request.requestTask && (
            <div className="rd-section">
              <h3 className="rd-section-title">Chi Tiết Công Việc</h3>
              <div className="rd-task-section">
                <div className="rd-task-info">
                  {/* Thông tin nhân viên */}
                  {request.requestTask.staffName && (
                    <div className="rd-task-staff">
                      <div className="rd-task-staff-info">
                        <span className="rd-task-label">Nhân viên phụ trách:</span>
                        <span className="rd-task-value">{request.requestTask.staffName}</span>
                      </div>
                      {request.requestTask.phoneNumber && (
                        <div className="rd-task-staff-info">
                          <span className="rd-task-label">Số điện thoại:</span>
                          <span className="rd-task-value">{request.requestTask.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Ghi chú */}
                  <div className="rd-task-note">
                    <span className="rd-task-label">Ghi chú của bạn:</span>
                    <div className="rd-task-description">
                      {request.requestTask.description || 'Không có ghi chú'}
                    </div>
                  </div>
                </div>

                {/* Thêm phần hiển thị ảnh nơi làm việc */}
                {request.requestTask.imageWorkSpace && (
                  <div className="rd-workplace-section">
                    <span className="rd-task-label">Nơi làm việc:</span>
                    <div className="rd-workplace-image">
                      <img 
                        src={request.requestTask.imageWorkSpace} 
                        alt="Workplace" 
                        onClick={() => setSelectedImage({
                          imageRequestTaskCustomer: request.requestTask.imageWorkSpace,
                          createAt: request.requestTask.createAt
                        })}
                      />
                    </div>
                  </div>
                )}

                {/* Phần hiển thị ảnh kết quả */}
                {request.requestTask && request.requestTask.taskImages && (
                  <div className="rd-image-section">
                    <span className="rd-task-label">Hình ảnh đính kèm:</span>
                    <div className="rd-image-grid">
                      {request.requestTask.taskImages.map((image, index) => (
                        <div 
                          key={index} 
                          className="rd-image-item"
                          onClick={() => setSelectedImage(image)}
                        >
                          <img 
                            src={image.imageRequestTaskCustomer} 
                            alt={`Task image ${index + 1}`} 
                          />
                          <div className="rd-image-date">
                            {new Date(image.createAt).toLocaleString('vi-VN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Report Section */}
          {request.reportTask && (
            <div className="rd-section">
              <h3 className="rd-section-title">Báo Cáo Công Việc</h3>
              <div className="rd-report-section">
                {/* Thêm thông tin nhân viên */}
                {request.reportTask.staffName && (
                  <div className="rd-task-staff">
                    <div className="rd-task-staff-info">
                      <span className="rd-task-label">Nhân viên báo cáo:</span>
                      <span className="rd-task-value">{request.reportTask.staffName}</span>
                    </div>
                    {request.reportTask.phoneNumber && (
                      <div className="rd-task-staff-info">
                        <span className="rd-task-label">Số điện thoại:</span>
                        <span className="rd-task-value">{request.reportTask.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {request.reportTask.videoFile && (
                  <iframe 
                    className="rd-video-player" 
                    src={request.reportTask.videoFile} 
                    allow="autoplay; encrypted-media" 
                    allowFullScreen
                  ></iframe>
                )}
                {request.reportTask.reportImages && request.reportTask.reportImages.length > 0 && (
                  <div className="rd-image-grid">
                    {request.reportTask.reportImages.map((image, index) => (
                      <div key={index} className="rd-image-item">
                        <img src={image.urlPath} alt={`Report image ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Materials Section với phí dịch vụ */}
          {request.requestMaterials && request.requestMaterials.length > 0 && (
            <div className="rd-section">
              <h3 className="rd-section-title">Nguyên Vật Liệu Sử Dụng</h3>
              <div className="rd-materials-section">
                <div className="rd-materials-container">
                  {request.requestMaterials.map((material) => (
                    <div key={material.requestMaterialId} className="rd-material-item">
                      <div className="rd-material-info">
                        <div className="rd-material-name">{material.materialName}</div>
                        <div className="rd-material-description">{material.description}</div>
                        <div className="rd-material-price">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(material.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rd-materials-total">
                  <div className="rd-total-item">
                    <div className="rd-total-label">Tổng chi phí vật liệu:</div>
                    <div className="rd-total-amount">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(request.requestMaterials.reduce((total, material) => total + material.price, 0))}
                    </div>
                  </div>
                  {request.typeId === 2 && (
                    <>
                      <div className="rd-total-item">
                        <div className="rd-total-label">Phí dịch vụ (5%):</div>
                        <div className="rd-total-amount">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(request.requestMaterials.reduce((total, material) => total + material.price, 0) * 0.05)}
                        </div>
                      </div>
                      <div className="rd-total-item rd-grand-total">
                        <div className="rd-total-label">Tổng cộng:</div>
                        <div className="rd-total-amount">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(request.requestMaterials.reduce((total, material) => total + material.price, 0) * 1.05)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Thêm nút xác nhận khi status = 4 (Chờ phản hồi) và typeId = 2 (Đặt dịch vụ riêng) */}
          {request.status === 4 && request.typeId === 2 && (
            <div className="rd-actions">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAcceptService}
                disabled={isProcessing}
                className="rd-accept-button"
              >
                {isProcessing ? 'Đang xử lý...' : 'Xác nhận dịch vụ'}
              </Button>
            </div>
          )}

          {/* Thêm nút feedback khi request type là 2 và status là 7 (hoàn thành) */}
          {request.typeId === 2 && request.status === 7 && (
            <div className="rd-actions">
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowFeedbackModal(true)}
                className="rd-feedback-button"
              >
                Gửi đánh giá
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
      
      {/* Thêm AlertMessage component */}
      <AlertMessage
        open={alertOpen}
        severity={alertSeverity}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />

      {/* Modal phóng to ảnh */}
      {selectedImage && (
        <div 
          className="rd-image-modal"
          onClick={() => setSelectedImage(null)}
        >
          <div className="rd-modal-content" onClick={e => e.stopPropagation()}>
            <img src={selectedImage.imageRequestTaskCustomer} alt="Enlarged view" />
            <div className="rd-modal-info">
              {new Date(selectedImage.createAt).toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <button 
              className="rd-modal-close"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="rd-feedback-modal">
          <div className="rd-feedback-content">
            <h3 className="rd-feedback-title">Đánh giá yêu cầu dịch vụ</h3>
            <div className="rd-rating-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`rd-star ${star <= feedback.rating ? 'active' : ''}`}
                  onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              className="rd-feedback-textarea"
              placeholder="Nhập nội dung đánh giá..."
              value={feedback.content}
              onChange={(e) => setFeedback(prev => ({ ...prev, content: e.target.value }))}
            />
            <div className="rd-feedback-actions">
              <Button 
                variant="contained"
                color="primary"
                onClick={async () => {
                  try {
                    if (feedback.rating === 0) {
                      setAlertMessage('Vui lòng chọn số sao đánh giá!');
                      setAlertSeverity('warning');
                      setAlertOpen(true);
                      return;
                    }

                    await createRequestFeedback({
                      customerId: user.accountId,
                      requestId: request.requestId,
                      content: feedback.content,
                      rating: feedback.rating
                    });

                    setAlertMessage('Cảm ơn bạn đã gửi đánh giá!');
                    setAlertSeverity('success');
                    setAlertOpen(true);
                    setShowFeedbackModal(false);
                  } catch (error) {
                    console.error('Error submitting feedback:', error);
                    setAlertMessage('Bạn đã gửi đánh giá này rồi. Vui lòng thử lại!');
                    setAlertSeverity('error');
                    setAlertOpen(true);
                  }
                }}
              >
                Gửi đánh giá
              </Button>
              <Button 
                variant="contained"
                color="error"
                onClick={() => setShowFeedbackModal(false)}
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetail; 