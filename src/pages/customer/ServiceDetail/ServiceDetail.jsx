import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/Header/header';
import Footer from '../../../components/Footer/footer';
import Loading from '../../../components/Loading/Loading';
import { getServiceScheduleById } from '../../../APIcontroller/API';
import './ServiceDetail.css';

const ServiceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [serviceDetail, setServiceDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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
                    <label>Trạng thái:</label>
                    <span>
                      {(() => {
                        switch (serviceDetail.latestAssignment.status) {
                          case 1:
                            return 'Đang chờ';
                          case 2:
                            return 'Từ chối';
                          case 3:
                            return 'Đang thực hiện';
                          case 4:
                            return 'Đã hoàn thành';
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
                    {serviceDetail.latestAssignment.taskImages.map((image, index) => (
                      <img key={index} src={image} alt={`Hình ảnh ${index + 1}`} className="task-image" />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceDetail; 