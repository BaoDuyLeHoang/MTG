import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Upload, X, User, Calendar, Flag, MapPin, CheckCircle, Clock, AlertCircle, Camera } from 'lucide-react';
import './TaskDetail.css';
import Sidebar from '../../../components/Sidebar/sideBar';
import { getTaskById, updateTaskStatus, updateTaskStatusWithImages } from '../../../APIcontroller/API';
import { storage } from '../../../firebase'; // Make sure this import is correct
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AlertMessage from '../../../components/AlertMessage/AlertMessage';


const TaskDetails = () => {
  const [task, setTask] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const { taskId } = useParams();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkInLocation, setCheckInLocation] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInPhoto, setCheckInPhoto] = useState(null);
  const [checkInPhotoPreview, setCheckInPhotoPreview] = useState(null);
  const checkInPhotoRef = useRef(null);

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

  const uploadImageToFirebase = async (file) => {
    const storageRef = ref(storage, `task_images/${taskId}/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

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

  const handleStatusUpdate = async (newStatus) => {
    try {
      if (newStatus === 4 && images.length > 0) {
        // Send image URLs to your API
        const imageUrls = images.map(img => img.url);
        await updateTaskStatusWithImages(taskId, imageUrls);
      } else {
        // Just update status
        await updateTaskStatus(taskId, newStatus);
      }
      // Refresh the task data after updating
      const updatedTask = await getTaskById(taskId);
      setTask(updatedTask);
      let message = '';
      switch (newStatus) {
        case 3: message = 'Nhiệm vụ đã được chấp nhận thành công'; break;
        case 2: message = 'Nhiệm vụ đã được từ chối thành công'; break;
        case 4: message = 'Nhiệm vụ đã hoàn thành thành công'; break;
        case 5: message = 'Nhiệm vụ đã được đánh dấu là thất bại'; break;
        default: message = 'Trạng thái nhiệm vụ đã được cập nhật thành công';
      }
      setAlertMessage(message);
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (error) {
      console.error('Error updating task status:', error);
      setAlertMessage('Không thể cập nhật trạng thái nhiệm vụ. Vui lòng thử lại.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const handleCheckInPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setAlertMessage('Ảnh không được vượt quá 5MB');
        setAlertSeverity('error');
        setAlertOpen(true);
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/heic'].includes(file.type)) {
        setAlertMessage('Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc HEIC');
        setAlertSeverity('error');
        setAlertOpen(true);
        return;
      }
      setCheckInPhoto(file);
      const previewUrl = URL.createObjectURL(file);
      setCheckInPhotoPreview(previewUrl);
    }
  };

  const handleCheckIn = async () => {
    if (!checkInPhoto) {
      setAlertMessage('Vui lòng chụp ảnh xác nhận vị trí của bạn');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    setAlertMessage('Đang xác định vị trí của bạn...');
    setAlertSeverity('info');
    setAlertOpen(true);

    try {
      // First upload the check-in photo
      const storageRef = ref(storage, `checkin_photos/${taskId}/${Date.now()}_${checkInPhoto.name}`);
      await uploadBytes(storageRef, checkInPhoto);
      const photoUrl = await getDownloadURL(storageRef);

      // Then get location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const now = new Date();
            setCheckInTime(now);
            setCheckInLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            setIsCheckedIn(true);
            setAlertMessage('Check-in thành công! Bạn có thể xem chi tiết nhiệm vụ.');
            setAlertSeverity('success');
            setAlertOpen(true);
            
            // Here you might want to send the check-in data to your backend
            // including the photoUrl, location, and timestamp
          },
          (error) => {
            let errorMessage = 'Không thể xác định vị trí của bạn. ';
            switch(error.code) {
              case error.PERMISSION_DENIED:
                errorMessage += 'Vui lòng cấp quyền truy cập vị trí cho trình duyệt.';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage += 'Thông tin vị trí không khả dụng.';
                break;
              case error.TIMEOUT:
                errorMessage += 'Quá thời gian yêu cầu vị trí.';
                break;
              default:
                errorMessage += 'Đã xảy ra lỗi không xác định.';
            }
            setAlertMessage(errorMessage);
            setAlertSeverity('error');
            setAlertOpen(true);
          }
        );
      }
    } catch (error) {
      console.error('Error during check-in:', error);
      setAlertMessage('Đã xảy ra lỗi khi tải ảnh lên. Vui lòng thử lại.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  // Add these new helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!task) return <div>Loading...</div>;

  return (
    <div className="td-page-layout">
      <Sidebar />
      <div className="td-main-content">
        <div className="td-container">
          {!isCheckedIn && task.status === 3 ? (
            <div className="td-checkin-card">
              <div className="td-checkin-header">
                <AlertCircle size={24} className="td-checkin-alert" />
                <h2 className="td-checkin-title">Yêu Cầu Check-in</h2>
              </div>

              <div className="td-checkin-content">
                <div className="td-checkin-preview">
                  <div className="td-preview-header">
                    <div className="td-preview-id">#{task.taskId}</div>
                    <span className={`td-status-badge td-status-${task.status}`}>
                      {getStatusText(task.status)}
                    </span>
                  </div>
                  <h3 className="td-preview-title">{task.serviceName}</h3>
                  <div className="td-preview-details">
                    <div className="td-preview-item">
                      <MapPin size={16} />
                      <span>{task.graveLocation}</span>
                    </div>
                    <div className="td-preview-item">
                      <Calendar size={16} />
                      <span>{formatDate(task.startDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="td-checkin-steps">
                  <h3 className="td-steps-title">Hướng dẫn check-in</h3>
                  <div className="td-step">
                    <div className="td-step-number">1</div>
                    <div className="td-step-content">
                      <p className="td-step-text">Đảm bảo bạn đã đến đúng địa điểm làm việc</p>
                    </div>
                  </div>
                  <div className="td-step">
                    <div className="td-step-number">2</div>
                    <div className="td-step-content">
                      <p className="td-step-text">Chụp ảnh tài liệu để xác nhận vị trí</p>
                    </div>
                  </div>
                  <div className="td-step">
                    <div className="td-step-number">3</div>
                    <div className="td-step-content">
                      <p className="td-step-text">Nhấn nút check-in để xác nhận vị trí</p>
                    </div>
                  </div>
                </div>

                <div className="td-checkin-photo-section">
                  <input
                    type="file"
                    ref={checkInPhotoRef}
                    className="td-checkin-photo-input"
                    accept="image/jpeg,image/png,image/heic"
                    onChange={handleCheckInPhoto}
                    style={{ display: 'none' }}
                  />
                  
                  {!checkInPhotoPreview ? (
                    <div 
                      className="td-checkin-photo-upload"
                      onClick={() => checkInPhotoRef.current.click()}
                    >
                      <Camera size={32} />
                      <p className="td-upload-text">Chụp ảnh xác nhận vị trí</p>
                      <span className="td-upload-hint">Nhấn để chụp ảnh hoặc chọn từ thư viện</span>
                    </div>
                  ) : (
                    <div className="td-checkin-photo-preview">
                      <img src={checkInPhotoPreview} alt="Ảnh check-in" />
                      <button 
                        className="td-photo-remove"
                        onClick={() => {
                          setCheckInPhoto(null);
                          setCheckInPhotoPreview(null);
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="td-checkin-prompt">
                  <button 
                    className="td-btn td-btn-checkin"
                    onClick={handleCheckIn}
                    disabled={!checkInPhoto}
                  >
                    <CheckCircle size={20} />
                    Check-in ngay
                  </button>
                  <p className="td-checkin-note">
                    <Clock size={14} />
                    Thời gian check-in có hiệu lực trong 24 giờ
                  </p>
                </div>

                {checkInTime && (
                  <div className="td-checkin-info">
                    <h4>Thông tin Check-in</h4>
                    <div className="td-info-item">
                      <Clock size={16} />
                      <span>Thời gian: {checkInTime.toLocaleString('vi-VN')}</span>
                    </div>
                    {checkInLocation && (
                      <div className="td-info-item">
                        <MapPin size={16} />
                        <span>Tọa độ: {checkInLocation.lat.toFixed(6)}, {checkInLocation.lng.toFixed(6)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Original task detail content
            <>
              <div className="td-header">
                <div className="td-header-content">
                  <div className="td-task-id">#{task.taskId}</div>
                  <h1 className="td-title">{task.serviceName}</h1>
                  <span className={`td-status-badge td-status-${task.status}`}>
                    {getStatusText(task.status)}
                  </span>
                </div>
              </div>

              <div className="td-grid">
                <div className="td-card">
                  <div className="td-card-header">
                    <User size={20} />
                    <h2 className="td-card-title">Thông tin nhiệm vụ</h2>
                  </div>
                  <div className="td-card-content">
                    <div className="td-info-row">
                      <div className="td-info-label">Người được giao</div>
                      <div className="td-info-value">{task.fullname}</div>
                    </div>
                    <div className="td-info-row">
                      <div className="td-info-label">Ngày bắt đầu</div>
                      <div className="td-info-value">{new Date(task.startDate).toLocaleDateString()}</div>
                    </div>
                    <div className="td-info-row">
                      <div className="td-info-label">Ngày kết thúc</div>
                      <div className="td-info-value">{new Date(task.endDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="td-card">
                  <div className="td-card-header">
                    <MapPin size={20} />
                    <h2 className="td-card-title">Vị trí mộ</h2>
                  </div>
                  <div className="td-card-content">
                    <div className="td-info-row">
                      <div className="td-info-label">Vị trí</div>
                      <div className="td-info-value">{task.graveLocation}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="td-description-card">
                <h3>Mô tả</h3>
                <p>{task.serviceDescription || 'Không có mô tả.'}</p>
              </div>

              {task.status !== 1 && task.status !== 4 && task.status !== 5 && (
                <div className="td-upload-section">
                  <h3>Ảnh tài liệu</h3>
                  
                  <div 
                    className="td-upload-area"
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
                    <Upload className="td-upload-icon" />
                    <p className="td-upload-text">
                      {uploading ? 'Đang tải lên...' : 'Nhấp để tải lên hoặc kéo và thả'}
                    </p>
                    <p className="td-upload-note">JPG, PNG hoặc HEIC (tối đa 5MB)</p>
                  </div>

                  <div className="td-image-grid">
                    {images.map((image) => (
                      <div key={image.id} className="td-image-item">
                        <img src={image.url} alt="Tài liệu" />
                        <button
                          onClick={() => removeImage(image.id)}
                          className="td-remove-btn"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="td-actions">
                {task.status === 1 && (
                  <>
                    <button className="td-btn td-btn-accept">
                      <CheckCircle size={20} />
                      Chấp nhận nhiệm vụ
                    </button>
                    <button className="td-btn td-btn-reject">
                      <X size={20} />
                      Từ chối nhiệm vụ
                    </button>
                  </>
                )}
                {task.status === 2 && (
                  <button className="td-btn td-btn-primary">
                    Thất bại
                  </button>
                )}
                {task.status === 3 && (
                  <>
                    <button className="td-btn td-btn-complete">
                      <CheckCircle size={20} />
                      Hoàn thành nhiệm vụ
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <AlertMessage
        open={alertOpen}
        handleClose={handleAlertClose}
        severity={alertSeverity}
        message={alertMessage}
      />
    </div>
  );
};

export default TaskDetails;
