import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Upload, X, User, Calendar, Flag, MapPin } from 'lucide-react';
import './TaskDetail.css';
import Sidebar from '../../components/Sidebar/sideBar';
import { getTaskById, updateTaskStatus } from '../../APIcontroller/API';
import { app, storage } from '../../firebase'; // Adjust the path as needed
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const TaskDetails = () => {
  const [task, setTask] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const { taskId } = useParams();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const taskData = await getTaskById(taskId);
        setTask(taskData);
        // Initialize images array based on available image paths
        const taskImages = [
          taskData.imagePath1,
          taskData.imagePath2,
          taskData.imagePath3
        ].filter(Boolean).map((path, index) => ({ id: index + 1, url: path }));
        setImages(taskImages);
      } catch (error) {
        console.error('Error fetching task details:', error);
        setError('Failed to load task details. Please try again later.');
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleFileUpload = async (files) => {
    setUploading(true);
    for (let file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        continue;
      }
      if (!['image/jpeg', 'image/png', 'image/heic'].includes(file.type)) {
        alert(`File ${file.name} is not a supported image type. Please use JPG, PNG, or HEIC.`);
        continue;
      }
      try {
        console.log(`Attempting to upload file: ${file.name}`);
        const downloadURL = await uploadImageToFirebase(file);
        console.log(`File uploaded successfully. Download URL: ${downloadURL}`);
        setImages(prevImages => [...prevImages, { id: Date.now(), url: downloadURL }]);
      } catch (error) {
        console.error('Error uploading image:', error);
        console.error('Error details:', error.message);
        alert(`Failed to upload ${file.name}. Error: ${error.message}`);
      }
    }
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFileUpload(files);
  };

  const removeImage = (id) => {
    setImages(prevImages => prevImages.filter(img => img.id !== id));
    // Note: This doesn't delete the image from Firebase Storage.
    // You may want to implement that functionality if needed.
  };

  const uploadImageToFirebase = async (file) => {
    if (!taskId) {
      throw new Error('TaskId is undefined. Cannot upload image.');
    }
    const storageRef = ref(storage, `task_images/${taskId}/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1: return 'Đã giao';
      case 2: return 'Từ chối';
      case 3: return 'Đang thực hiện';
      case 4: return 'Hoàn thành';
      case 5: return 'Thất bại';
      default: return 'Không xác định';
    }
  };

  const canCompleteOrRefuse = images.length > 0;

  if (error) return <div className="error-message">{error}</div>;
  if (!task) return <div>Loading...</div>;

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      // Refresh the task data after updating
      const updatedTask = await getTaskById(taskId);
      setTask(updatedTask);
      alert(newStatus === 3 ? 'Task accepted successfully' : 'Task refused successfully');
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status. Please try again.');
    }
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <div className="container">
          {/* Header */}
          <div className="task-detail-header">
            <h1>Task #{task.taskId}: {task.serviceName}</h1>
            <span className={`status status-${getStatusText(task.status).toLowerCase().replace(' ', '-')}`}>
              {getStatusText(task.status)}
            </span>
          </div>

          <div className="content">
            {/* Info Grid */}
            <div className="info-grid">
              <div className="info-card">
                <h3><User size={16} /> Task Details</h3>
                <div className="info-content">
                  <p><strong>Assigned to:</strong> {task.fullname}</p>
                  <p><strong>Start Date:</strong> {new Date(task.startDate).toLocaleDateString()}</p>
                  <p><strong>End Date:</strong> {new Date(task.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="info-card">
                <h3><MapPin size={16} /> Grave Location</h3>
                <div className="info-content">
                  <p><strong>Location:</strong> {task.graveLocation}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="description-card">
              <h3>Description</h3>
              <p>{task.serviceDescription || 'No description available.'}</p>
            </div>

            {/* Image Upload Section */}
            {task.status !== 1 && task.status !== 4 && task.status !== 5 && (
              <div className="upload-section">
                <h3>Documentation Photos</h3>
                
                <div 
                  className="upload-area"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileInput}
                    multiple
                    accept="image/jpeg,image/png,image/heic"
                  />
                  <Upload className="upload-icon" />
                  <p className="upload-text">
                    {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                  </p>
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
            )}

            {/* Action Buttons */}
            <div className="action-buttons">
              {task.status === 1 && (
                <>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleStatusUpdate(3)}
                  >
                    Chấp nhận
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleStatusUpdate(2)}
                  >
                    Từ chối
                  </button>
                </>
              )}
              {(task.status === 2 || task.status === 3) && (
                <>
                  <button 
                    className="btn btn-primary" 
                    disabled={!canCompleteOrRefuse}
                    onClick={() => {/* Handle complete task */}}
                  >
                    Complete Task
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    disabled={!canCompleteOrRefuse}
                    onClick={() => {/* Handle refuse task */}}
                  >
                    Refuse Task
                  </button>
                </>
              )}
              {(task.status === 4 || task.status === 5) && (
                <button 
                  className="btn btn-secondary"
                  onClick={() => {/* Handle update status */}}
                >
                  Update Status
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
