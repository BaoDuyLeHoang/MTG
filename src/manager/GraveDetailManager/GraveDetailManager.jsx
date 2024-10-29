import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./GraveDetailManager.css";
import { getGraveById } from "../../APIcontroller/API";
import Sidebar from "../../components/Sidebar/sideBar";
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

// Add this helper function to format date for input
const formatDateForInput = (dateString) => {
  return new Date(dateString).toISOString().split('T')[0];
};

const MyGraveDetail = () => {
  const { martyrId } = useParams();
  const [martyrDetails, setMartyrDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [graveLocation, setGraveLocation] = useState({
    area: "Khu A",
    row: "Hàng 5",
    number: "23",
    inCharge: {
      name: "Lê Văn Quản",
      phone: "0987654321"
    }
  });
  const [fakePersonalInfo, setFakePersonalInfo] = useState([
    {
      id: 1,
      name: "Nguyễn Văn An",
      phone: "0912345678",
      email: "nguyenvanan@email.com"
    },
  ]);
  const [editedLocation, setEditedLocation] = useState(graveLocation);
  const [editedPersonalInfo, setEditedPersonalInfo] = useState(fakePersonalInfo);

  useEffect(() => {
    const fetchGraveDetails = async () => {
      if (!martyrId) {
        setError("No martyr ID provided");
        setLoading(false);
        return;
      }

      try {
        const data = await getGraveById(martyrId);
        setMartyrDetails(data);
        setEditedData(data);
      } catch (err) {
        setError("Failed to fetch grave details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGraveDetails();
  }, [martyrId]);

  const handleImageClick = () => {
    if (martyrDetails?.images?.[0]?.urlPath) {
      setSelectedImage(martyrDetails.images[0].urlPath);
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      matyrGraveInformations: [
        {
          ...prev.matyrGraveInformations[0],
          [field]: value
        }
      ]
    }));
  };

  const handleSave = async () => {
    try {
      // TODO: Add API call to save all changes
      // await updateGrave(martyrId, {
      //   ...editedData,
      //   location: editedLocation,
      //   personalInfo: editedPersonalInfo
      // });
      setMartyrDetails(editedData);
      setGraveLocation(editedLocation);
      setFakePersonalInfo(editedPersonalInfo);
      setIsEditing(false);
    } catch (error) {
      setError("Failed to save changes. Please try again.");
    }
  };

  const renderInfoItem = (label, field, value) => (
    <div className="grave-detail-manager-info-item">
      <label>{label}:</label>
      {isEditing ? (
        <input
          type="text"
          value={editedData.matyrGraveInformations[0][field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );

  const handleLocationChange = (field, value) => {
    setEditedLocation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInChargeChange = (field, value) => {
    setEditedLocation(prev => ({
      ...prev,
      inCharge: {
        ...prev.inCharge,
        [field]: value
      }
    }));
  };

  const handlePersonalInfoChange = (id, field, value) => {
    setEditedPersonalInfo(prev =>
      prev.map(person =>
        person.id === id ? { ...person, [field]: value } : person
      )
    );
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!martyrDetails) return <div className="no-data-message">No grave details found.</div>;

  const info = martyrDetails.matyrGraveInformations[0];

  return (
    <div className="grave-detail-manager-layout-wrapper">
      <Sidebar />
      <div className="grave-detail-manager-container">
        <div className="grave-detail-manager-info">
          <div className="header-with-actions">
            <h1>Thông tin chi tiết</h1>
            {isEditing ? (
              <div className="edit-actions">
                <button onClick={handleSave}>
                  <FaSave /> Lưu
                </button>
                <button onClick={() => setIsEditing(false)}>
                  <FaTimes /> Hủy
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)}>
                <FaEdit /> Chỉnh sửa
              </button>
            )}
          </div>

          <div className="grave-detail-manager-info-container">
            <div className="grave-detail-manager-image-section">
              <div className="grave-detail-manager-memorial-image">
                <img
                  src={
                    martyrDetails.images[0]?.urlPath ||
                    "/api/placeholder/400/300"
                  }
                  alt="Bia tưởng niệm"
                  onClick={handleImageClick}
                  title="Nhấp để phóng to"
                />
              </div>
            </div>

            <div className="grave-detail-manager-detail-section">
              <h2>Thông tin cá nhân</h2>
              <div className="grave-detail-manager-info-grid">
                {renderInfoItem("Tên", "name", info.name)}
                {renderInfoItem("Bí danh", "nickName", info.nickName)}
                {renderInfoItem("Chức danh", "position", info.position)}
                {renderInfoItem("Quê quán", "homeTown", info.homeTown)}
                <div className="grave-detail-manager-info-item">
                  <label>Ngày sinh:</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formatDateForInput(editedData.matyrGraveInformations[0].dateOfBirth)}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                  ) : (
                    <span>{new Date(info.dateOfBirth).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="grave-detail-manager-info-item">
                  <label>Ngày mất:</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formatDateForInput(editedData.matyrGraveInformations[0].dateOfSacrifice)}
                      onChange={(e) => handleInputChange('dateOfSacrifice', e.target.value)}
                    />
                  ) : (
                    <span>{new Date(info.dateOfSacrifice).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="grave-detail-manager-inscription">
                  <h3>Huân chương/ Chiến công</h3>
                  {isEditing ? (
                    <textarea
                      value={editedData.matyrGraveInformations[0].medal || ''}
                      onChange={(e) => handleInputChange('medal', e.target.value)}
                      rows="4"
                    />
                  ) : (
                    <p>{info.medal}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          
        </div>
        <div className="grave-detail-manager-location-section">
          <h2>Vị trí mộ</h2>
          <div className="grave-detail-manager-location-grid">
            <div className="grave-detail-manager-location-item">
              <label>Khu vực:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedLocation.area}
                  onChange={(e) => handleLocationChange('area', e.target.value)}
                />
              ) : (
                <span>{graveLocation.area}</span>
              )}
            </div>
            <div className="grave-detail-manager-location-item">
              <label>Hàng:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedLocation.row}
                  onChange={(e) => handleLocationChange('row', e.target.value)}
                />
              ) : (
                <span>{graveLocation.row}</span>
              )}
            </div>
            <div className="grave-detail-manager-location-item">
              <label>Số:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedLocation.number}
                  onChange={(e) => handleLocationChange('number', e.target.value)}
                />
              ) : (
                <span>{graveLocation.number}</span>
              )}
            </div>
            <div className="grave-detail-manager-location-manager">
              <label>Người phụ trách:</label>
              <div className="grave-detail-manager-location-manager-info">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editedLocation.inCharge.name}
                      onChange={(e) => handleInChargeChange('name', e.target.value)}
                      placeholder="Tên người phụ trách"
                    />
                    <input
                      type="text"
                      value={editedLocation.inCharge.phone}
                      onChange={(e) => handleInChargeChange('phone', e.target.value)}
                      placeholder="Số điện thoại"
                    />
                  </>
                ) : (
                  <div className="manager-info-card">
                    <div className="manager-name">
                      <span className="manager-label">Họ và tên:</span>
                      <span className="manager-value">{graveLocation.inCharge.name}</span>
                    </div>
                    <div className="manager-phone">
                      <span className="manager-label">SĐT:</span>
                      <span className="manager-value">{graveLocation.inCharge.phone}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="grave-detail-manager-personal-section">
          <h2>Thông tin thân nhân</h2>
          <div className="grave-detail-manager-personal-list">
            {(isEditing ? editedPersonalInfo : fakePersonalInfo).map((person) => (
              <div key={person.id} className="grave-detail-manager-personal-item">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={person.name}
                      onChange={(e) => handlePersonalInfoChange(person.id, 'name', e.target.value)}
                      placeholder="Tên thân nhân"
                      className="grave-detail-manager-personal-input"
                    />
                    <div className="grave-detail-manager-personal-contact">
                      <input
                        type="text"
                        value={person.phone}
                        onChange={(e) => handlePersonalInfoChange(person.id, 'phone', e.target.value)}
                        placeholder="Số điện thoại"
                      />
                      <input
                        type="email"
                        value={person.email}
                        onChange={(e) => handlePersonalInfoChange(person.id, 'email', e.target.value)}
                        placeholder="Email"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grave-detail-manager-personal-name">
                      {person.name}
                    </div>
                    <div className="grave-detail-manager-personal-contact">
                      <span>SĐT: {person.phone}</span>
                      <span>Email: {person.email}</span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {selectedImage && (
          <div className="grave-detail-manager-modal-overlay" onClick={closeModal}>
            <div className="grave-detail-manager-modal-content">
              <img src={selectedImage} alt="Memorial - Large view" />
              <button className="grave-detail-manager-modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGraveDetail;
