import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MyGraveDetail.css";
import Header from "../../components/Header/header";
import { getGraveById } from "../../APIcontroller/API";

const MyGraveDetail = () => {
  const navigate = useNavigate();
  const { martyrId } = useParams();
  const [martyrDetails, setMartyrDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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
    sessionStorage.setItem('selectedMartyrId', martyrId);
    // Navigate to the service listing page
    navigate('/dichvutheoloai');
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
      type: "Cleaning",
      description: "General cleaning and polishing of the memorial stone.",
      performedBy: "John Doe"
    },
    {
      id: 2,
      date: "2023-08-22",
      type: "Restoration",
      description: "Repaired minor cracks and refreshed the engraving.",
      performedBy: "Jane Smith"
    },
    {
      id: 3,
      date: "2024-01-10",
      type: "Landscaping",
      description: "Planted new flowers and trimmed surrounding vegetation.",
      performedBy: "Mike Johnson"
    }
  ];

  return (
    <>
      <Header />
      <div className="grave-detail-container">
        <div className="grave-info">
          <h1>Tưởng niệm Liệt sĩ</h1>

          <div className="image-section">
            <div className="memorial-image">
              <img
                src={
                  martyrDetails.images[0]?.urlPath || "/api/placeholder/400/300"
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
                <label>Ngày hy sinh:</label>
                <span>
                  {new Date(info.dateOfSacrifice).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="inscription">
              <h3>Huân chương/ Chiến công</h3>
              <p>{info.medal}</p>
            </div>
          </div>

          <div className="service-button-container">
            <button className="book-service-button" onClick={handleBookService}>
              Đặt dịch vụ
            </button>
          </div>
        </div>
        <div className="maintenance-section">
          <h2>Maintenance History</h2>
          <div className="maintenance-list">
            {fakeMaintenanceHistory.map((record) => (
              <div key={record.id} className="maintenance-item">
                <div className="maintenance-header">
                  <span className="maintenance-date">{record.date}</span>
                  <span className="maintenance-type">{record.type}</span>
                </div>
                <p className="maintenance-description">{record.description}</p>
                <span className="maintenance-performer">
                  Performed by: {record.performedBy}
                </span>
              </div>
            ))}
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
