import React, { useState } from 'react';
import './GraveDetailManager.css'; // We'll define CSS styles separately

const GraveDetailManager = () => {
  // Sample data - in real app this would come from props or API
  const [graveData, setGraveData] = useState({
    id: "001",
    location: {
      cemetery: "National Heroes Cemetery",
      section: "A",
      plot: "123",
      coordinates: "31.5204° N, 74.3587° E"
    },
    martyr: {
      name: "Ahmed Hassan",
      dateOfMartyrdom: "2023-05-15",
      age: 28,
      rank: "Captain",
      force: "Army",
      serviceNumber: "AH-789456"
    },
    relative: {
      name: "Mohammad Hassan",
      relationship: "Father",
      contact: "+92 300 1234567",
      address: "123 Peace Street, Islamabad"
    },
    image: "/api/placeholder/400/300"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(graveData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(graveData);
  };

  const handleSave = () => {
    setGraveData(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(graveData);
  };

  const handleChange = (section, field, value) => {
    setEditedData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="grave-details">
      <h1>Chi Tiết Mộ Liệt Sĩ</h1>
      
      <div className="content-wrapper">
        {/* Image Section */}
        <div className="image-section">
          <img src={graveData.image} alt="Mộ" />
        </div>

        {/* Details Section */}
        <div className="details-section">
          <div className="info-card">
            <h2>Thông Tin Vị Trí</h2>
            <div className="field-group">
              <label>Nghĩa Trang:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.location.cemetery}
                  onChange={(e) => handleChange('location', 'cemetery', e.target.value)}
                />
              ) : (
                <span>{graveData.location.cemetery}</span>
              )}
            </div>
            <div className="field-group">
              <label>Khu Vực:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.location.section}
                  onChange={(e) => handleChange('location', 'section', e.target.value)}
                />
              ) : (
                <span>{graveData.location.section}</span>
              )}
            </div>
            <div className="field-group">
              <label>Số Lô:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.location.plot}
                  onChange={(e) => handleChange('location', 'plot', e.target.value)}
                />
              ) : (
                <span>{graveData.location.plot}</span>
              )}
            </div>
            <div className="field-group">
              <label>Tọa Độ:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.location.coordinates}
                  onChange={(e) => handleChange('location', 'coordinates', e.target.value)}
                />
              ) : (
                <span>{graveData.location.coordinates}</span>
              )}
            </div>
          </div>

          <div className="martyr-profile">
            <h1>Thông tin cá nhân</h1>
            
            <div className="profile-container">
              {/* Left side - Photo */}
              <div className="profile-photo">
                <img src={graveData.image} alt="Ảnh liệt sĩ" />
              </div>

              {/* Right side - Details */}
              <div className="profile-details">
                <div className="detail-row">
                  <div className="detail-group">
                    <label>Tên:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.martyr.name}
                        onChange={(e) => handleChange('martyr', 'name', e.target.value)}
                      />
                    ) : (
                      <span>{graveData.martyr.name}</span>
                    )}
                  </div>
                  <div className="detail-group">
                    <label>Bí danh:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.martyr.alias}
                        onChange={(e) => handleChange('martyr', 'alias', e.target.value)}
                      />
                    ) : (
                      <span>{graveData.martyr.alias || ''}</span>
                    )}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-group">
                    <label>Chức danh:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.martyr.rank}
                        onChange={(e) => handleChange('martyr', 'rank', e.target.value)}
                      />
                    ) : (
                      <span>{graveData.martyr.rank}</span>
                    )}
                  </div>
                  <div className="detail-group">
                    <label>Quê quán:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.martyr.hometown}
                        onChange={(e) => handleChange('martyr', 'hometown', e.target.value)}
                      />
                    ) : (
                      <span>{graveData.martyr.hometown}</span>
                    )}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-group">
                    <label>Ngày sinh:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.martyr.dateOfBirth}
                        onChange={(e) => handleChange('martyr', 'dateOfBirth', e.target.value)}
                      />
                    ) : (
                      <span>{graveData.martyr.dateOfBirth}</span>
                    )}
                  </div>
                  <div className="detail-group">
                    <label>Ngày mất:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.martyr.dateOfDeath}
                        onChange={(e) => handleChange('martyr', 'dateOfDeath', e.target.value)}
                      />
                    ) : (
                      <span>{graveData.martyr.dateOfDeath}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h2>Thông Tin Thân Nhân</h2>
            <div className="field-group">
              <label>Họ Tên:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.relative.name}
                  onChange={(e) => handleChange('relative', 'name', e.target.value)}
                />
              ) : (
                <span>{graveData.relative.name}</span>
              )}
            </div>
            {/* Continue with other relative fields similarly */}
          </div>

          <div className="button-group">
            {!isEditing ? (
              <button className="update-btn" onClick={handleEdit}>
                Cập Nhật Thông Tin
              </button>
            ) : (
              <>
                <button className="save-btn" onClick={handleSave}>
                  Lưu
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  Hủy
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraveDetailManager;