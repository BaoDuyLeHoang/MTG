import React, { useState } from "react";
import "./MyGraveDetail.css";
import Header from "../../components/Header/header";

const MyGraveDetail = () => {
  // Dữ liệu mẫu - trong ứng dụng thực tế, dữ liệu này sẽ đến từ props hoặc API
  const martyrDetails = {
    name: "Nguyễn Văn A",
    dateOfBirth: "1920-03-15",
    dateOfDeath: "1945-08-20",
    cause: "Hy sinh trong chiến đấu",
    location: "Khu A, Lô 123",
    inscription:
      "Không có tình yêu nào cao cả hơn tình yêu của người hiến dâng mạng sống vì bạn bè mình",
    image: "/api/placeholder/400/300", // Đây sẽ được thay thế bằng URL hình ảnh thực tế
  };

  const maintenanceHistory = [
    {
      id: 1,
      date: "2024-03-15",
      type: "Vệ sinh thường xuyên",
      description: "Làm sạch bia mộ và khu vực xung quanh",
      performedBy: "Trần Văn B",
    },
    {
      id: 2,
      date: "2024-02-01",
      type: "Sửa chữa cấu trúc",
      description: "Sửa vết nứt ở đế của bia mộ",
      performedBy: "Lê Thị C",
    },
    {
      id: 3,
      date: "2024-01-10",
      type: "Chăm sóc cảnh quan",
      description: "Trồng hoa mới và cắt tỉa cỏ",
      performedBy: "Phạm Thị D",
    },
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = () => {
    setSelectedImage(martyrDetails.image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <Header />
      <div className="grave-detail-container">
        <div className="grave-info">
          <h1>Tưởng niệm Liệt sĩ</h1>

          <div className="image-section">
            <div className="memorial-image">
              <img
                src={martyrDetails.image}
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
                <span>{martyrDetails.name}</span>
              </div>
              <div className="info-item">
                <label>Bí danh:</label>
                <span>{martyrDetails.nickname}</span>
              </div>
              <div className="info-item">
                <label>Chuc danh:</label>
                <span>{martyrDetails.nickname}</span>
              </div>
              <div className="info-item">
                <label>Quê quán:</label>
                <span>{martyrDetails.location}</span>
              </div>
              <div className="info-item">
                <label>Ngày sinh:</label>
                <span>{martyrDetails.dateOfBirth}</span>
              </div>
              <div className="info-item">
                <label>Ngày mất:</label>
                <span>{martyrDetails.dateOfDeath}</span>
              </div>
              <div className="info-item">
                <label>Lý do:</label>
                <span>{martyrDetails.cause}</span>
              </div>

              <div className="info-item">
                <label>Vị trí mộ:</label>
                <span>{martyrDetails.location}</span>
              </div>
            </div>

            <div className="inscription">
              <h3>Huân chương/ Chiến công</h3>
              <p>{martyrDetails.inscription}</p>
            </div>
          </div>

          <div className="maintenance-section">
            <h2>Lịch sử bảo trì</h2>
            <div className="maintenance-list">
              {maintenanceHistory.map((record) => (
                <div key={record.id} className="maintenance-item">
                  <div className="maintenance-header">
                    <span className="maintenance-date">{record.date}</span>
                    <span className="maintenance-type">{record.type}</span>
                  </div>
                  <p className="maintenance-description">
                    {record.description}
                  </p>
                  <span className="maintenance-performer">
                    Thực hiện bởi: {record.performedBy}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedImage && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content">
              <img src={selectedImage} alt="Memorial - Large view" />
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyGraveDetail;
