import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MyGraveDetail.css";
import Header from "../../../components/Header/header";
import { getGraveById } from "../../../APIcontroller/API";

const MyGraveDetail = () => {
  const navigate = useNavigate();
  const { martyrId } = useParams();
  const [martyrDetails, setMartyrDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const defaultImage = "https://firebasestorage.googleapis.com/v0/b/mtg-capstone-2024.appspot.com/o/grave_images%2Fbna_3..jpg?alt=media&token=8f7ddd09-355a-4d65-85b6-476829954072";

  useEffect(() => {
    const fetchGraveDetails = async () => {
      if (!martyrId) {
        setError("No martyr ID provided");
        setLoading(false);
        return;
      }

      try {
        const data = await getGraveById(martyrId);
        console.log("Fetched data:", data); // Log the fetched data
        setMartyrDetails(data);
      } catch (err) {
        setError("Failed to fetch grave details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGraveDetails();
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!martyrDetails) return <div>No grave details found.</div>;

  const info = martyrDetails.matyrGraveInformations[0];

  // Add this fake data
  const fakeMaintenanceHistory = [
    {
      id: 1,
      date: "2023-05-15",
      type: "Vệ sinh",
      description: "Vệ sinh tổng thể và đánh bóng bia tưởng niệm.",
      performedBy: "Nguyễn Văn An",
    },
    {
      id: 2,
      date: "2023-08-22",
      type: "Phục hồi",
      description: "Sửa chữa các vết nứt nhỏ và làm mới phần khắc chữ.",
      performedBy: "Trần Thị Bình",
    },
    {
      id: 3,
      date: "2024-01-10",
      type: "Cảnh quan",
      description: "Trồng hoa mới và cắt tỉa thực vật xung quanh.",
      performedBy: "Lê Văn Cường",
    },
  ];

  return (
    <>
      <Header />
      <div className="grave-detail-container">
        <div className="grave-info">
          <h1>Tưởng niệm Liệt sĩ</h1>
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
          <div className="maintenance-list">
            {fakeMaintenanceHistory.map((record) => (
              <div key={record.id} className="maintenance-item">
                <div className="maintenance-header">
                  <span className="maintenance-date">{record.date}</span>
                  <span className="maintenance-type">{record.type}</span>
                </div>
                <p className="maintenance-description">{record.description}</p>
                <span className="maintenance-performer">
                  Thực hiện bởi: {record.performedBy}
                </span>
              </div>
            ))}
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
    </>
  );
};

export default MyGraveDetail;
