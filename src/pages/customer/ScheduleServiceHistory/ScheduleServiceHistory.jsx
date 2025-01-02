import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/Header/header';
import Footer from '../../../components/Footer/footer';
import Loading from '../../../components/Loading/Loading';
import { getServiceSchedulesForCustomer } from '../../../APIcontroller/API';
import './ScheduleServiceHistory.css';
import { useNavigate } from 'react-router-dom';

const ScheduleServiceHistory = () => {
  const { user } = useAuth();
  const [serviceSchedules, setServiceSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="page-wrapper-schedule-service-history">
        <Header />
        <div className="schedule-service-history">
          <Loading fullScreen={false} text="Đang tải lịch sử dịch vụ..." />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper-schedule-service-history">
      <Header />
      <div className="schedule-service-history">
        <div className="intro-section">
          <div className="intro-content">
            <div className="intro-text">
              <h1>Dịch vụ định kỳ của tôi</h1>
              <p className="intro-description">
                Quản lý và theo dõi các dịch vụ chăm sóc phần mộ định kỳ
              </p>
            </div>
            <div className="intro-stats">
              <div className="stat-item">
                <span className="stat-number">{serviceSchedules.length}</span>
                <span className="stat-label">Tổng số dịch vụ</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">
                  {serviceSchedules.filter(s => s.status === 1).length}
                </span>
                <span className="stat-label">Đang hoạt động</span>
              </div>
            </div>
          </div>
        </div>

        <div className="table-section">


          <div className="table-container">
            <table className="service-table">
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
                </tr>
              </thead>
              <tbody>
                {serviceSchedules.map((schedule, index) => (
                  <tr 
                    key={schedule.serviceScheduleId} 
                    onClick={() => handleRowClick(schedule.serviceScheduleId)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="index-cell">{index + 1}</td>
                    <td className="image-cell">
                      <img src={schedule.serviceImage} alt="Service" className="service-image" />
                    </td>
                    <td className="service-name-cell">{schedule.serviceName}</td>
                    <td className="martyr-name-cell">{schedule.martyrName}</td>
                    <td>
                      <div className="date-cell">
                        {formatDate(schedule.scheduleDate)}
                      </div>
                    </td>
                    <td className="amount-cell">
                      {schedule.amount.toLocaleString()}đ
                    </td>
                    <td className="note-cell">{schedule.note || '-'}</td>
                    <td>
                      <span className={`status-badge ${schedule.status === 1 ? 'active' : 'inactive'}`}>
                        {schedule.status === 1 ? 'Hoạt động' : 'Ngừng'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ScheduleServiceHistory; 