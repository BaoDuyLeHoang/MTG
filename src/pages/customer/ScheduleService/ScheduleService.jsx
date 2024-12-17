import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import AlertMessage from '../../../components/AlertMessage/AlertMessage';
import Header from '../../../components/Header/header';
import Footer from '../../../components/Footer/footer';
import { getServiceDetails, createServiceSchedule, getServiceScheduleById } from '../../../APIcontroller/API';
import './ScheduleService.css';
import Loading from '../../../components/Loading/Loading';

const ScheduleService = () => {
  const { serviceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [serviceDetails, setServiceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    accountId: user?.accountId || 0,
    serviceId: parseInt(serviceId),
    martyrId: sessionStorage.getItem("selectedMartyrId") || 0,
    dayOfService: 1,
    note: ''
  });

  const [alertState, setAlertState] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        
        // Lấy thông tin chi tiết dịch vụ
        const serviceData = await getServiceDetails(serviceId);
        
        // Cập nhật state với dữ liệu nhận được
        setServiceDetails({
          ...serviceData,
          // Đảm bảo có các thông tin từ location.state
          serviceName: serviceData.serviceName || location.state?.serviceName,
          price: serviceData.price || location.state?.price
        });
        
        // Cập nhật formData với serviceId
        setFormData(prev => ({
          ...prev,
          serviceId: parseInt(serviceId)
        }));

      } catch (error) {
        console.error("Error fetching service details:", error);
        setAlertState({
          open: true,
          message: 'Không thể tải thông tin dịch vụ',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    if (!sessionStorage.getItem("selectedMartyrId")) {
      setAlertState({
        open: true,
        message: 'Vui lòng chọn mộ liệt sĩ trước khi đặt dịch vụ',
        severity: 'warning'
      });
      navigate('/relative-grave');
      return;
    }

    fetchServiceData();
  }, [serviceId, navigate, location.state]);

  const handleDayChange = (e) => {
    const value = parseInt(e.target.value);
    if (serviceDetails?.recurringType === 1) {
      // Weekly service (1-7)
      if (value >= 1 && value <= 7) {
        setFormData({ ...formData, dayOfService: value });
      }
    } else if (serviceDetails?.recurringType === 2) {
      // Monthly service (1-31)
      if (value >= 1 && value <= 31) {
        setFormData({ ...formData, dayOfService: value });
      }
    }
  };

  const handleNoteChange = (e) => {
    setFormData({
      ...formData,
      note: e.target.value
    });
  };

  const renderDayOptions = () => {
    if (!serviceDetails?.recurringType) return null;

    if (serviceDetails.recurringType === 1) {
      // Weekly options (Thứ 2 - Chủ nhật)
      return (
        <select 
          value={formData.dayOfService} 
          onChange={handleDayChange}
          className="day-select"
        >
          <option value={1}>Thứ 2</option>
          <option value={2}>Thứ 3</option>
          <option value={3}>Thứ 4</option>
          <option value={4}>Thứ 5</option>
          <option value={5}>Thứ 6</option>
          <option value={6}>Thứ 7</option>
          <option value={7}>Chủ nhật</option>
        </select>
      );
    } else if (serviceDetails.recurringType === 2) {
      // Monthly options (1-31)
      return (
        <select 
          value={formData.dayOfService} 
          onChange={handleDayChange}
          className="day-select"
        >
          {[...Array(31)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Ngày {i + 1}
            </option>
          ))}
        </select>
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate day selection based on RecurringType
    if (serviceDetails.recurringType === 1 && (formData.dayOfService < 1 || formData.dayOfService > 7)) {
      setAlertState({
        open: true,
        message: 'Chọn sai ngày cho dịch vụ hàng tuần',
        severity: 'error'
      });
      return;
    }

    if (serviceDetails.recurringType === 2 && (formData.dayOfService < 1 || formData.dayOfService > 31)) {
      setAlertState({
        open: true,
        message: 'Chọn sai ngày cho dịch vụ hàng tháng',
        severity: 'error'
      });
      return;
    }

    try {
      const response = await createServiceSchedule(formData);
      if (response.status === true) {
        setAlertState({
          open: true,
          message: response.messages,
          severity: 'success'
        });
        setTimeout(() => navigate('/'), 2000);
      } else {
        setAlertState({
          open: true,
          message: response.messages || 'Có lỗi xảy ra khi đặt dịch vụ',
          severity: 'error'
        });
      }
    } catch (error) {
      setAlertState({
        open: true,
        message: error.response?.data?.messages || 'Có lỗi xảy ra khi đặt dịch vụ',
        severity: 'error'
      });
    }
  };

  const handleAlertClose = () => {
    setAlertState({ ...alertState, open: false });
  };

  if (loading) {
    return (
      <div className="schedule-service-page">
        <Header />
        <div className="schedule-container" style={{ position: 'relative', minHeight: '400px' }}>
          <Loading text="Đang tải thông tin dịch vụ..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (!serviceDetails) {
    return (
      <div className="schedule-service-page">
        <Header />
        <div className="schedule-error">Không thể tải thông tin dịch vụ</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="schedule-service-page">
      <Header />
      <div className="schedule-container">
        <h1>Đặt Dịch Vụ Định Kỳ</h1>
        
        <div className="service-hero">
          <div className="schedule-service-image">
            <img 
              src={serviceDetails?.imagePath || '/placeholder-service.jpg'} 
              alt={serviceDetails?.serviceName}
            />
          </div>
          <div className="service-quick-info">
            <h2>{serviceDetails?.serviceName}</h2>
            <div className="service-badges">
              <span className="badge recurring-type">
                <i className="fas fa-sync-alt"></i>
                {serviceDetails?.recurringType === 1 ? 'Hàng tuần' : 'Hàng tháng'}
              </span>
              <span className="badge price">
                <i className="fas fa-tag"></i>
                {serviceDetails?.price?.toLocaleString('vi-VN')} đ
              </span>
            </div>
            <p className="service-description">{serviceDetails?.description}</p>
          </div>
        </div>

        <div className="service-features">
          <div className="feature-card">
            <i className="fas fa-clock"></i>
            <h3>Tiết Kiệm Thời Gian</h3>
            <p>Tự động thực hiện theo lịch, không cần đặt lại</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-shield-alt"></i>
            <h3>An Tâm Tuyệt Đối</h3>
            <p>Đảm bảo thực hiện đúng lịch và chất lượng</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-wallet"></i>
            <h3>Thanh Toán Tự Động</h3>
            <p>Tự động trừ tiền từ ví, không cần lo lắng</p>
          </div>
        </div>

        <div className="service-process">
          <h3>Quy Trình Thực Hiện</h3>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Đặt Lịch</h4>
              <p>Chọn thời gian phù hợp</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Xác Nhận</h4>
              <p>Nhận thông báo xác nhận</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Thực Hiện</h4>
              <p>Dịch vụ được thực hiện tự động</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h4>Báo Cáo</h4>
              <p>Nhận báo cáo sau khi hoàn thành</p>
            </div>
          </div>
        </div>

        <div className="service-notes">
          <h3>Lưu Ý Quan Trọng</h3>
          <div className="notes-grid">
            <div className="note-item">
              <i className="fas fa-calendar-check"></i>
              <p>Dịch vụ tự động theo lịch đã chọn</p>
            </div>
            <div className="note-item">
              <i className="fas fa-undo-alt"></i>
              <p>Có thể hủy bất cứ lúc nào</p>
            </div>
            <div className="note-item">
              <i className="fas fa-bell"></i>
              <p>Thông báo trước khi thực hiện</p>
            </div>
            <div className="note-item">
              <i className="fas fa-hand-holding-usd"></i>
              <p>Thanh toán tự động qua ví</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="schedule-form">
          <div className="form-group">
            <label>
              <i className="fas fa-calendar-alt"></i>
              {serviceDetails?.recurringType === 1 
                ? 'Chọn thứ trong tuần:' 
                : 'Chọn ngày trong tháng:'}
            </label>
            {renderDayOptions()}
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-comment-alt"></i>
              Ghi chú đặc biệt (nếu có):
            </label>
            <textarea
              value={formData.note}
              onChange={handleNoteChange}
              placeholder="Ví dụ: Màu hoa yêu thích, vị trí đặt hoa cụ thể..."
              className="note-input"
            />
          </div>

          <button type="submit" className="submit-button">
            <i className="fas fa-check-circle"></i>
            Xác nhận đặt dịch vụ
          </button>
        </form>
      </div>

      <AlertMessage
        open={alertState.open}
        handleClose={handleAlertClose}
        severity={alertState.severity}
        message={alertState.message}
      />
      <Footer />
    </div>
  );
};

export default ScheduleService; 