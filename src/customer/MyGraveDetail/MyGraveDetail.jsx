import React, { useState } from 'react';
import './MyGraveDetail.css';

const MyGraveDetail = () => {
  // Sample data - in a real app, this would come from props or an API
  const martyrDetails = {
    name: "John Smith",
    dateOfBirth: "1920-03-15",
    dateOfDeath: "1945-08-20",
    cause: "Killed in action",
    location: "Section A, Plot 123",
    inscription: "Greater love hath no man than this, that a man lay down his life for his friends",
    image: "/api/placeholder/400/300" // This would be replaced with actual image URL
  };

  const maintenanceHistory = [
    {
      id: 1,
      date: "2024-03-15",
      type: "Regular Cleaning",
      description: "Cleaned headstone and surrounding area",
      performedBy: "James Wilson"
    },
    {
      id: 2,
      date: "2024-02-01",
      type: "Structural Repair",
      description: "Fixed crack in base of monument",
      performedBy: "Robert Johnson"
    },
    {
      id: 3,
      date: "2024-01-10",
      type: "Landscaping",
      description: "Planted new flowers and trimmed grass",
      performedBy: "Mary Davis"
    }
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = () => {
    setSelectedImage(martyrDetails.image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="grave-detail-container">
      <div className="grave-info">
        <h1>Martyr's Memorial</h1>
        
        <div className="image-section">
          <div className="memorial-image">
            <img 
              src={martyrDetails.image} 
              alt="Memorial" 
              onClick={handleImageClick}
              title="Click to enlarge"
            />
          </div>
        </div>

        <div className="detail-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Name:</label>
              <span>{martyrDetails.name}</span>
            </div>
            <div className="info-item">
              <label>Date of Birth:</label>
              <span>{martyrDetails.dateOfBirth}</span>
            </div>
            <div className="info-item">
              <label>Date of Death:</label>
              <span>{martyrDetails.dateOfDeath}</span>
            </div>
            <div className="info-item">
              <label>Cause:</label>
              <span>{martyrDetails.cause}</span>
            </div>
            <div className="info-item">
              <label>Que quan:</label>
              <span>{martyrDetails.location}</span>
            </div>
          </div>
          
          <div className="inscription">
            <h3>Inscription</h3>
            <p>{martyrDetails.inscription}</p>
          </div>
        </div>

        <div className="maintenance-section">
          <h2>Maintenance History</h2>
          <div className="maintenance-list">
            {maintenanceHistory.map(record => (
              <div key={record.id} className="maintenance-item">
                <div className="maintenance-header">
                  <span className="maintenance-date">{record.date}</span>
                  <span className="maintenance-type">{record.type}</span>
                </div>
                <p className="maintenance-description">{record.description}</p>
                <span className="maintenance-performer">Performed by: {record.performedBy}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content">
            <img src={selectedImage} alt="Memorial - Large view" />
            <button className="modal-close" onClick={closeModal}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGraveDetail;