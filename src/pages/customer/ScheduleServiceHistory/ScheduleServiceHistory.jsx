import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/Header/header';
import Footer from '../../../components/Footer/footer';
import Loading from '../../../components/Loading/Loading';
import { getServiceSchedulesForCustomer, updateServiceScheduleStatus } from '../../../APIcontroller/API';
import './ScheduleServiceHistory.css';
import { useNavigate } from 'react-router-dom';
import AlertMessage from '../../../components/AlertMessage/AlertMessage';

const ScheduleServiceHistory = () => {
  const { user } = useAuth();
  const [serviceSchedules, setServiceSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    severity: 'success',
    message: ''
  });
  const [updatingId, setUpdatingId] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  useEffect(() => {
    const fetchServiceSchedules = async () => {
      try {
        const response = await getServiceSchedulesForCustomer(user.accountId);
        setServiceSchedules(response);
      } catch (error) {
        console.error("Error fetching service schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.accountId) {
      fetchServiceSchedules();
    }
  }, [user]);

  const handleRowClick = (serviceScheduleId) => {
    navigate(`/schedule-service-detail/${serviceScheduleId}`);
  };

  const handleToggleStatus = async (serviceScheduleId) => {
    try {
      setUpdatingId(serviceScheduleId);
      await updateServiceScheduleStatus(serviceScheduleId, user.accountId);
      
      // Refresh data
      const response = await getServiceSchedulesForCustomer(user.accountId);
      setServiceSchedules(response);
      
      setAlertInfo({
        open: true,
        severity: 'success',
        message: 'Cập nhật trạng thái dịch vụ thành công'
      });
    } catch (error) {
      setAlertInfo({
        open: true,
        severity: 'error',
        message: error.message || 'Có lỗi xảy ra khi cập nhật trạng thái'
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCloseAlert = () => {
    setAlertInfo(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <div className="schedule-service-page-wrapper">
        <Header />
        <div className="schedule-service-content">
          <div className="schedule-service-intro">
            <div className="schedule-service-intro-content">
              <div className="schedule-service-intro-text">
                <h1>Dịch vụ định kỳ của tôi</h1>
                <p className="schedule-service-description">
                  Quản lý và theo dõi các dịch vụ chăm sóc phần mộ định kỳ
                </p>
              </div>
              <div className="schedule-service-stats">
                <div className="schedule-service-stat-item">
                  <span className="schedule-service-stat-number">{serviceSchedules.length}</span>
                  <span className="schedule-service-stat-label">Tổng số dịch vụ</span>
                </div>
                <div className="schedule-service-stat-divider"></div>
                <div className="schedule-service-stat-item">
                  <span className="schedule-service-stat-number">
                    {serviceSchedules.filter(s => s.status === 1).length}
                  </span>
                  <span className="schedule-service-stat-label">Đang hoạt động</span>
                </div>
              </div>
            </div>
          </div>

          <div className="schedule-service-table-section">
            <div className="schedule-service-table-container">
              <table className="schedule-service-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Hình ảnh</th>
                    <th>Tên dịch vụ</th>
                    <th>Tên liệt sĩ</th>
                    <th>Ngày thực hiện</th>
                    <th>Số tiền</th>
                    <th>Ghi chú</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceSchedules.map((schedule, index) => (
                    <tr 
                      key={schedule.serviceScheduleId}
                      onClick={() => handleRowClick(schedule.serviceScheduleId)}
                      className="schedule-service-table-row"
                    >
                      <td className="schedule-service-index">{index + 1}</td>
                      <td className="schedule-service-image-cell">
                        <img src={schedule.serviceImage} alt="Service" className="schedule-service-image" />
                      </td>
                      <td className="schedule-service-name">{schedule.serviceName}</td>
                      <td className="schedule-service-martyr-name">{schedule.martyrName}</td>
                      <td className="schedule-service-date">
                        {formatDate(schedule.scheduleDate)}
                      </td>
                      <td className="schedule-service-amount">
                        {schedule.amount.toLocaleString()}đ
                      </td>
                      <td className="schedule-service-note">{schedule.note || '-'}</td>
                      <td>
                        <span className={`schedule-service-status ${schedule.status === 1 ? 'active' : 'inactive'}`}>
                          {schedule.status === 1 ? 'Hoạt động' : 'Ngừng'}
                        </span>
                      </td>
                      <td className="schedule-service-action">
                        <button
                          className="schedule-service-toggle-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(schedule.serviceScheduleId);
                          }}
                          disabled={updatingId === schedule.serviceScheduleId}
                          title={schedule.status === 1 ? 'Tạm ngừng' : 'Kích hoạt'}
                        >
                          {updatingId === schedule.serviceScheduleId ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <i className={`fas ${schedule.status === 1 ? 'fa-toggle-off' : 'fa-toggle-on'}`}></i>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
  }

  return (
    <div className="schedule-service-page-wrapper">
      <Header />
      <div className="schedule-service-content">
        <div className="schedule-service-intro">
          <div className="schedule-service-intro-content">
            <div className="schedule-service-intro-text">
              <h1>Dịch vụ định kỳ của tôi</h1>
              <p className="schedule-service-description">
                Quản lý và theo dõi các dịch vụ chăm sóc phần mộ định kỳ
              </p>
            </div>
            <div className="schedule-service-stats">
              <div className="schedule-service-stat-item">
                <span className="schedule-service-stat-number">{serviceSchedules.length}</span>
                <span className="schedule-service-stat-label">Tổng số dịch vụ</span>
              </div>
              <div className="schedule-service-stat-divider"></div>
              <div className="schedule-service-stat-item">
                <span className="schedule-service-stat-number">
                  {serviceSchedules.filter(s => s.status === 1).length}
                </span>
                <span className="schedule-service-stat-label">Đang hoạt động</span>
              </div>
            </div>
          </div>
        </div>

        <div className="schedule-service-table-section">
          <div className="schedule-service-table-container">
            <table className="schedule-service-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Hình ảnh</th>
                  <th>Tên dịch vụ</th>
                  <th>Tên liệt sĩ</th>
                  <th>Ngày thực hiện</th>
                  <th>Số tiền</th>
                  <th>Ghi chú</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {serviceSchedules.map((schedule, index) => (
                  <tr 
                    key={schedule.serviceScheduleId}
                    onClick={() => handleRowClick(schedule.serviceScheduleId)}
                    className="schedule-service-table-row"
                  >
                    <td className="schedule-service-index">{index + 1}</td>
                    <td className="schedule-service-image-cell">
                      <img src={schedule.serviceImage} alt="Service" className="schedule-service-image" />
                    </td>
                    <td className="schedule-service-name">{schedule.serviceName}</td>
                    <td className="schedule-service-martyr-name">{schedule.martyrName}</td>
                    <td className="schedule-service-date">
                      {formatDate(schedule.scheduleDate)}
                    </td>
                    <td className="schedule-service-amount">
                      {schedule.amount.toLocaleString()}đ
                    </td>
                    <td className="schedule-service-note">{schedule.note || '-'}</td>
                    <td>
                      <span className={`schedule-service-status ${schedule.status === 1 ? 'active' : 'inactive'}`}>
                        {schedule.status === 1 ? 'Hoạt động' : 'Ngừng'}
                      </span>
                    </td>
                    <td className="schedule-service-action">
                      <button
                        className="schedule-service-toggle-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(schedule.serviceScheduleId);
                        }}
                        disabled={updatingId === schedule.serviceScheduleId}
                        title={schedule.status === 1 ? 'Tạm ngừng' : 'Kích hoạt'}
                      >
                        {updatingId === schedule.serviceScheduleId ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          <i className={`fas ${schedule.status === 1 ? 'fa-toggle-off' : 'fa-toggle-on'}`}></i>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default ScheduleServiceHistory; 