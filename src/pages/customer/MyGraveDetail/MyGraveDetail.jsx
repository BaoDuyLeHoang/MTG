import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MyGraveDetail.css";
import Header from "../../../components/Header/header";
import { getGraveById } from "../../../APIcontroller/API";
import { getGraveOrders } from "../../../services/graves";
import Footer from "../../../components/Footer/footer";

const MyGraveDetail = () => {
  const navigate = useNavigate();
  const { martyrId } = useParams();
  const [martyrDetails, setMartyrDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [orders, setOrders] = useState([]);

  const defaultImage = "https://firebasestorage.googleapis.com/v0/b/mtg-capstone-2024.appspot.com/o/grave_images%2Fbna_3..jpg?alt=media&token=8f7ddd09-355a-4d65-85b6-476829954072";

  useEffect(() => {
    const fetchData = async () => {
      if (!martyrId) {
        setError("No martyr ID provided");
        setLoading(false);
        return;
      }

      try {
        const [graveData, ordersData] = await Promise.all([
          getGraveById(martyrId),
          getGraveOrders(martyrId)
        ]);
        
        setMartyrDetails(graveData);
        setOrders(ordersData);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [martyrId]);

  const handleImageClick = () => {
    if (martyrDetails.images && martyrDetails.images.length > 0) {
      setSelectedImage(martyrDetails.images[0].urlPath);
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleBookService = () => {
    // Save martyrId to session storage
    sessionStorage.setItem("selectedMartyrId", martyrId);
    // Save martyr name to localStorage
    const martyrName = info.name || info.nickName || "Không có tên";
    localStorage.setItem("selectedMartyrName", martyrName);
    // Navigate to the service listing page
    navigate("/dichvutheoloai");
  };

  // Add this function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Add this helper function
  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Đã đặt";
      case 3:
        return "Đang thực hiện";
      case 4:
        return "Hoàn thành";
      default:
        return null;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!martyrDetails) return <div>No grave details found.</div>;

  const info = martyrDetails.matyrGraveInformations[0];

  return (
    <>
      <Header />
      <div className="grave-detail-container">
        <div className="grave-info">
          <h1>Tưởng niệm liệt sĩ</h1>
          <div className="grave-info-container">
            <div className="image-section">
              <div className="memorial-image">
                <img
                  src={
                    martyrDetails?.images?.[0]?.urlPath || defaultImage
                  }
                  alt="Bia tưởng niệm"
                  onClick={handleImageClick}
                  title="Nhấp để phóng to"
                />
              </div>
            </div>

            <div className="detail-section">
              <h2>Thông tin cá nhân</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Tên:</label>
                  <span>{info.name}</span>
                </div>
                <div className="info-item">
                  <label>Bí danh:</label>
                  <span>{info.nickName}</span>
                </div>
                <div className="info-item">
                  <label>Chức danh:</label>
                  <span>{info.position}</span>
                </div>
                <div className="info-item">
                  <label>Quê quán:</label>
                  <span>{info.homeTown}</span>
                </div>
                <div className="info-item">
                  <label>Ngày sinh:</label>
                  <span>{new Date(info.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <label>Ngày mất:</label>
                  <span>
                    {new Date(info.dateOfSacrifice).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="inscription">
            <h3>Huân chương/ Chiến công</h3>
            <p>{info.medal}</p>
          </div>
          <div className="service-button-container">
            <button className="book-service-button" onClick={handleBookService}>
              Đặt dịch vụ
            </button>
          </div>
        </div>
        <div className="maintenance-section">
          <h2>Lịch sử bảo trì</h2>
          <div className="order-history-list">
            {orders && orders.length > 0 ? (
              orders.map((order) => {
                // Only render orders with status 1, 3, or 4
                if (![1, 3, 4].includes(order.status)) return null;
                
                return (
                  <div key={order.orderDate} className="order-card" data-status={order.status}>
                    <div className="order-main-content">
                      <div className="order-top">
                        <div className="order-service">
                          <h3>{order.serviceName}</h3>
                          <p>{order.serviceCategoryName}</p>
                        </div>
                        <div className="order-meta">
                          <span className="order-date">{formatDate(order.orderDate)}</span>
                          <span className="status-badge status-${order.status}">
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <p>Chưa có dịch vụ nào được đặt cho mộ này</p>
              </div>
            )}
          </div>
        </div>

        {selectedImage && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content">
              <img 
                src={selectedImage === martyrDetails?.images?.[0]?.urlPath ? selectedImage : defaultImage} 
                alt="Memorial - Large view" 
              />
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyGraveDetail;
