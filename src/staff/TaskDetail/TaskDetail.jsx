import { useState } from 'react';
import { Upload, X, User, Calendar, Flag, MapPin } from 'lucide-react';
import './TaskDetail.css';
import Sidebar from '../../components/Sidebar/sideBar';

const TaskDetails = () => {
  const [images, setImages] = useState([
    { id: 1, url: '/api/placeholder/150/150' },
    { id: 2, url: '/api/placeholder/150/150' }
  ]);

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    // Image upload logic would go here
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <div className="container">
          {/* Header */}
          <div className="task-detail-header">
            <h1>Task #T-456: Regular Maintenance</h1>
            <span className="status status-in-progress">In Progress</span>
          </div>

          <div className="content">
            {/* Info Grid */}
            <div className="info-grid">
              <div className="info-card">
                <h3><User size={16} /> Task Details</h3>
                <div className="info-content">
                  <p><strong>Assigned to:</strong> Ahmed Hassan</p>
                  <p><strong>Due Date:</strong> October 20, 2024</p>
                  <p><strong>Priority:</strong> Medium</p>
                </div>
              </div>

              <div className="info-card">
                <h3><MapPin size={16} /> Grave Location</h3>
                <div className="info-content">
                  <p><strong>ID:</strong> G-789</p>
                  <p><strong>Section:</strong> B</p>
                  <p><strong>Row:</strong> 12</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="description-card">
              <h3>Description</h3>
              <p>
                Perform regular maintenance and cleaning of the martyr's grave. 
                This includes cleaning the headstone, removing debris, replacing flowers, 
                and ensuring the surrounding area is well-maintained.
              </p>
            </div>

            {/* Image Upload Section */}
            <div className="upload-section">
              <h3>Documentation Photos</h3>
              
              <div 
                className="upload-area"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload className="upload-icon" />
                <p className="upload-text">Click to upload or drag and drop</p>
                <p className="upload-note">JPG, PNG or HEIC (max. 5MB)</p>
              </div>

              <div className="image-grid">
                {images.map((image) => (
                  <div key={image.id} className="image-preview">
                    <img src={image.url} alt="Documentation" />
                    <button
                      onClick={() => removeImage(image.id)}
                      className="remove-button"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn btn-primary">Complete Task</button>
            <button className="btn btn-secondary">Update Status</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
