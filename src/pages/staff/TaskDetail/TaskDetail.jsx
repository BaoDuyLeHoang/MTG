import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Upload,
  X,
  User,
  Calendar,
  Flag,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  Camera,
} from "lucide-react";
import "./TaskDetail.css";
import Sidebar from "../../../components/Sidebar/sideBar";
import {
  getTaskById,
  updateTaskStatus,
  updateTaskStatusWithImages,
} from "../../../APIcontroller/API";
import { storage } from "../../../firebase"; // Make sure this import is correct
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AlertMessage from "../../../components/AlertMessage/AlertMessage";
import { getByScheduleDetailId } from "../../../services/scheduleDetail"; // Add this import
import { useAuth } from "../../../context/AuthContext";
import { addTaskImages } from "../../../services/task";
import { updateAssignmentTaskImage } from "../../../services/assignmentTask";
import { checkAttendanceForStaff } from "../../../services/attendance";
import { updateTaskImage } from "../../../services/task";

const TaskDetails = () => {
  const { accountId, scheduleDetailId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkInLocation, setCheckInLocation] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInPhoto, setCheckInPhoto] = useState(null);
  const [checkInPhotoPreview, setCheckInPhotoPreview] = useState(null);
  const checkInPhotoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState(null);
  const [checkInPhotos, setCheckInPhotos] = useState([]);
  const [checkInPhotosPreviews, setCheckInPhotosPreviews] = useState([]);
  const [showEditAttendance, setShowEditAttendance] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [currentPhotos, setCurrentPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [newPhotosPreviews, setNewPhotosPreviews] = useState([]);
  const [workplacePhoto, setWorkplacePhoto] = useState(null);
  const [resultPhotos, setResultPhotos] = useState([]);
  const [workplacePhotoPreview, setWorkplacePhotoPreview] = useState(null);
  const [resultPhotosPreviews, setResultPhotosPreviews] = useState([]);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        const response = await getByScheduleDetailId(accountId, scheduleDetailId);
        setTask(response.scheduleDetail);
        setAttendance(response.attendanceStaff);

        // Xử lý ảnh nơi làm việc
        if (response.scheduleDetail.imageWorkSpace) {
          setWorkplacePhotoPreview(response.scheduleDetail.imageWorkSpace);
        }

        // Xử lý ảnh kết quả công việc
        if (response.scheduleDetail.imageTaskImages && response.scheduleDetail.imageTaskImages.length > 0) {
          const taskImages = response.scheduleDetail.imageTaskImages.map((img, index) => ({
            id: index + 1,
            url: img.images
          }));
          setImages(taskImages);
        }

        // Xử lý ảnh điểm danh nếu có
        if (response.attendanceStaff) {
          const existingPhotos = [
            response.attendanceStaff.imagePath1,
            response.attendanceStaff.imagePath2,
            response.attendanceStaff.imagePath3
          ].filter(Boolean);
          setCurrentPhotos(existingPhotos);
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
        setError("Không thể tải thông tin công việc. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (accountId && scheduleDetailId) {
      fetchTaskDetails();
    }
  }, [accountId, scheduleDetailId]);

  const uploadImageToFirebase = async (file) => {
    const storageRef = ref(
      storage,
      `task_images/${scheduleDetailId}/${file.name}`
    );
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleFileUpload = async (files) => {
    if (images.length + files.length > 3) {
      setAlertMessage("Chỉ được phép tải lên tối đa 3 ảnh");
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }

    setUploading(true);
    try {
      for (let file of files) {
        if (file.size > 5 * 1024 * 1024) {
          setAlertMessage(`File ${file.name} quá lớn. Kích thước tối đa là 5MB.`);
          setAlertSeverity("error");
          setAlertOpen(true);
          continue;
        }
        if (!["image/jpeg", "image/png", "image/heic"].includes(file.type)) {
          setAlertMessage(`File ${file.name} không đúng định dạng. Vui lòng sử dụng JPG, PNG, hoặc HEIC.`);
          setAlertSeverity("error");
          setAlertOpen(true);
          continue;
        }
        try {
          const downloadURL = await uploadImageToFirebase(file);
          setImages((prevImages) => [...prevImages, { id: Date.now(), url: downloadURL }]);
        } catch (error) {
          console.error("Error uploading image:", error);
          setAlertMessage(`Không thể tải lên ${file.name}. Lỗi: ${error.message}`);
          setAlertSeverity("error");
          setAlertOpen(true);
        }
      }
    } finally {
      setUploading(false);
    }
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
    setImages((prevImages) => prevImages.filter((img) => img.id !== id));
    // Note: This doesn't delete the image from Firebase Storage.
    // You may want to implement that functionality if needed.
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Đã giao";
      case 2:
        return "Từ chối";
      case 3:
        return "Đang thực hiện";
      case 4:
        return "Hoàn thành";
      case 5:
        return "Thất bại";
      default:
        return "Không xác định";
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      if (newStatus === 4 && images.length > 0) {
        // Send image URLs to your API
        const imageUrls = images.map((img) => img.url);
        await updateTaskStatusWithImages(scheduleDetailId, imageUrls);
      } else {
        // Just update status
        await updateTaskStatus(scheduleDetailId, newStatus);
      }
      // Refresh the task data after updating
      const updatedTask = await getByScheduleDetailId(
        accountId,
        scheduleDetailId
      );
      setTask(updatedTask);
      let message = "";
      switch (newStatus) {
        case 3:
          message = "Nhiệm vụ đã được chấp nhận thành công";
          break;
        case 2:
          message = "Nhiệm vụ đã được từ chối thành công";
          break;
        case 4:
          message = "Nhiệm vụ đã hoàn thành thành công";
          break;
        case 5:
          message = "Nhiệm vụ đã được đánh dấu là thất bại";
          break;
        default:
          message = "Trạng thái nhiệm vụ đã được cập nhật thành công";
      }
      setAlertMessage(message);
      setAlertSeverity("success");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error updating task status:", error);
      setAlertMessage(
        "Không thể cập nhật trạng thái nhiệm vụ. Vui lòng thử lại."
      );
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  const handleCheckInPhoto = (e) => {
    const files = Array.from(e.target.files);
    
    if (checkInPhotos.length + files.length > 3) {
      setAlertMessage("Chỉ được phép tải ln tối đa 3 ảnh");
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        setAlertMessage("nh không được vượt quá 5MB");
        setAlertSeverity("error");
        setAlertOpen(true);
        return;
      }
      if (!["image/jpeg", "image/png", "image/heic"].includes(file.type)) {
        setAlertMessage("Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc HEIC");
        setAlertSeverity("error");
        setAlertOpen(true);
        return;
      }

      setCheckInPhotos(prev => [...prev, file]);
      const previewUrl = URL.createObjectURL(file);
      setCheckInPhotosPreviews(prev => [...prev, previewUrl]);
    });
  };

  const handleCheckIn = async () => {
    if (checkInPhotos.length === 0) {
      setAlertMessage("Vui lòng chụp ít nhất 1 ảnh xác nhận vị trí của bạn");
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }

    try {
      const photoUrls = await Promise.all(checkInPhotos.map(async (photo, index) => {
        const storageRef = ref(
          storage,
          `attendance_photos/${attendance.attendanceId}/${Date.now()}_${index}_${photo.name}`
        );
        await uploadBytes(storageRef, photo);
        return await getDownloadURL(storageRef);
      }));

      const attendanceData = {
        attendanceId: attendance.attendanceId,
        attendanceStatus: attendance.attendanceStatus,
        imagePath1: photoUrls[0] || "",
        imagePath2: photoUrls[1] || "",
        imagePath3: photoUrls[2] || ""
      };

      // Add attendance check API call with photo URLs
      await checkAttendanceForStaff(attendance.accountId, attendanceData);
      
      // Reload dữ liệu mới
      const response = await getByScheduleDetailId(accountId, scheduleDetailId);
      setAttendance(response.attendanceStaff);
      setIsCheckedIn(true);
      
      // Reset states
      setCheckInPhotos([]);
      setCheckInPhotosPreviews([]);
      
      // Hiển thị thông báo thành công
      setAlertMessage("Check-in thành công!");
      setAlertSeverity("success");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error during check-in:", error);
      setAlertMessage("Đã xảy ra lỗi khi tải ảnh lên. Vui lòng thử lại.");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  const removeCheckInPhoto = (index) => {
    setCheckInPhotos(prev => prev.filter((_, i) => i !== index));
    setCheckInPhotosPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Thêm hàm formatDate để xử lý riêng cho startDate và endDate
  const formatDate = (date) => {
    try {
      if (!date) return "Chưa có thông tin";
      
      // Chuyển đổi định dạng ngày từ API (YYYY-MM-DD)
      const [year, month, day] = date.split('-');
      const dateObj = new Date(year, month - 1, day);
      
      // Kiểm tra nếu dateObj không hợp lệ
      if (isNaN(dateObj.getTime())) {
        return "Định dạng ngày không hợp lệ";
      }

      return dateObj.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Lỗi định dạng ngày";
    }
  };

  // Giữ nguyên hàm formatDateTime cho các trường hợp cần cả ngày và gi
  const formatDateTime = (date, time) => {
    try {
      if (!date || !time) return "Chưa có thông tin";
      
      const [year, month, day] = date.split('-');
      const [hour, minute] = time.split(':');
      const dateObj = new Date(year, month - 1, day, hour, minute);
      
      if (isNaN(dateObj.getTime())) {
        return "Định dạng thời gian không hợp lệ";
      }

      return dateObj.toLocaleString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date time:", error);
      return "Lỗi định dạng thời gian";
    }
  };

  // Debug: Thêm log để kiểm tra dữ liệu
  useEffect(() => {
    if (task) {
      console.log("Task dates:", {
        startDate: task.startDate,
        startTime: task.startTime,
        endDate: task.endDate,
        endTime: task.endTime
      });
    }
  }, [task]);

  const handleEditAttendance = async () => {
    setShowEditAttendance(true);
    // Khởi tạo state cho ảnh hiện tại
    const currentImages = [
      attendance?.imagePath1,
      attendance?.imagePath2,
      attendance?.imagePath3
    ].filter(Boolean);
    setCurrentPhotos(currentImages);
  };

  const handleConfirmEdit = async () => {
    try {
      // Upload ảnh mới (nếu có)
      const photoUrls = [...currentPhotos];
      
      // Cập nhật attendance data
      const attendanceData = {
        attendanceId: attendance.attendanceId,
        attendanceStatus: attendance.attendanceStatus,
        imagePath1: photoUrls[0] || "",
        imagePath2: photoUrls[1] || "",
        imagePath3: photoUrls[2] || ""
      };

      await checkAttendanceForStaff(attendance.accountId, attendanceData);
      
      // Reload dữ liệu mới
      const response = await getByScheduleDetailId(accountId, scheduleDetailId);
      setAttendance(response.attendanceStaff);
      
      setShowEditAttendance(false);
      setAlertMessage("Cập nhật điểm danh thành công!");
      setAlertSeverity("success");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error updating attendance:", error);
      setAlertMessage("Không thể cập nhật điểm danh. Vui lòng thử lại.");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  const handleAddPhoto = async (e) => {
    const files = Array.from(e.target.files);
    
    if (currentPhotos.length + files.length > 3) {
      setAlertMessage("Chỉ được phép tải lên tối đa 3 ảnh");
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }

    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          setAlertMessage("Ảnh không được vượt quá 5MB");
          setAlertSeverity("error");
          setAlertOpen(true);
          return;
        }

        const storageRef = ref(
          storage,
          `attendance_photos/${attendance.attendanceId}/${Date.now()}_${file.name}`
        );
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setCurrentPhotos(prev => [...prev, downloadURL]);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setAlertMessage("Không thể tải ảnh lên. Vui lòng thử lại.");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  const handleRemovePhoto = (index) => {
    setCurrentPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleWorkplacePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setAlertMessage("Ảnh không được vượt quá 5MB");
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }

    if (!["image/jpeg", "image/png", "image/heic"].includes(file.type)) {
      setAlertMessage("Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc HEIC");
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }

    setWorkplacePhoto(file);
    setWorkplacePhotoPreview(URL.createObjectURL(file));
  };

  const handleResultPhotos = (e) => {
    const files = Array.from(e.target.files);
    
    if (resultPhotos.length + files.length > 3) {
      setAlertMessage("Chỉ được phép tải lên tối đa 3 ảnh kết quả");
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        setAlertMessage("Ảnh không được vượt quá 5MB");
        setAlertSeverity("error");
        setAlertOpen(true);
        return;
      }
      if (!["image/jpeg", "image/png", "image/heic"].includes(file.type)) {
        setAlertMessage("Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc HEIC");
        setAlertSeverity("error");
        setAlertOpen(true);
        return;
      }

      setResultPhotos(prev => [...prev, file]);
      const previewUrl = URL.createObjectURL(file);
      setResultPhotosPreviews(prev => [...prev, previewUrl]);
    });
  };

  const handleCompleteTask = async () => {
    if (!workplacePhoto) {
        setAlertMessage("Vui lòng chụp ảnh nơi làm việc");
        setAlertSeverity("error");
        setAlertOpen(true);
        return;
    }

    if (resultPhotos.length === 0) {
        setAlertMessage("Vui lòng chụp ít nhất 1 ảnh kết quả công việc");
        setAlertSeverity("error");
        setAlertOpen(true);
        return;
    }

    try {
        // Upload ảnh nơi làm việc
        const workplaceStorageRef = ref(
            storage,
            `task_completion/${task.taskId || task.assignmentTaskId}/workplace_${Date.now()}`
        );
        await uploadBytes(workplaceStorageRef, workplacePhoto);
        const workplaceUrl = await getDownloadURL(workplaceStorageRef);

        // Upload ảnh kết quả
        const resultUrls = await Promise.all(resultPhotos.map(async (photo, index) => {
            const storageRef = ref(
                storage,
                `task_completion/${task.taskId || task.assignmentTaskId}/result_${index}_${Date.now()}`
            );
            await uploadBytes(storageRef, photo);
            return await getDownloadURL(storageRef);
        }));

        // Kiểm tra taskId và assignmentTaskId để gọi API phù hợp
        if (task.taskId) {
            // Gọi API với format mới và taskId
            await updateTaskImage(task.taskId, {
                imageWorkSpace: workplaceUrl,
                urlImages: resultUrls
            });
        } else if (task.assignmentTaskId) {
            // Gọi API để cập nhật ảnh cho assignmentTaskId
            await updateAssignmentTaskImage(task.assignmentTaskId, {
                imageWorkSpace: workplaceUrl,
                urlImages: resultUrls
            });
        }

        // Hiển thị thông báo thành công
        setAlertMessage("Đã cập nhật trạng thái công việc thành công!");
        setAlertSeverity("success");
        setAlertOpen(true);

        // Đợi 1 giây để người dùng thấy thông báo thành công
        setTimeout(() => {
            // Điều hướng về trang lịch làm việc
            navigate(`/schedule-staff`);
        }, 1000);

    } catch (error) {
        console.error("Error completing task:", error);
        setAlertMessage("Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại.");
        setAlertSeverity("error");
        setAlertOpen(true);
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (loading) return <div className="loading-message">Đang tải...</div>;
  if (!task) return <div className="error-message">Không tìm thấy thông tin công việc</div>;

  return (
    <div className="td-page-layout">
      <Sidebar />
      <div className="td-main-content">
        <div className="td-container">
          <div className="td-header">
            <div className="td-header-content">
              <div className="td-task-id">#{scheduleDetailId}</div>
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
                  <div className="td-info-label">Mã liệt sĩ</div>
                  <div className="td-info-value">{task.martyrCode}</div>
                </div>
                <div className="td-info-row">
                  <div className="td-info-label">Ngày bắt đầu</div>
                  <div className="td-info-value">
                    {formatDate(task.startDate)}
                  </div>
                </div>
                <div className="td-info-row">
                  <div className="td-info-label">Ngày kết thúc</div>
                  <div className="td-info-value">
                    {formatDate(task.endDate)}
                  </div>
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
                  <div className="td-info-label">Khu vực</div>
                  <div className="td-info-value">Khu {task.areaNumber}</div>
                </div>
                <div className="td-info-row">
                  <div className="td-info-label">Hàng</div>
                  <div className="td-info-value">Hàng {task.rowNumber}</div>
                </div>
                <div className="td-info-row">
                  <div className="td-info-label">Số mộ</div>
                  <div className="td-info-value">{task.martyrNumber}</div>
                </div>
                <div className="td-location-visual">
                  <div className="td-location-path">
                    Khu {task.areaNumber} → Hàng {task.rowNumber} → Mộ số{" "}
                    {task.martyrNumber}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="td-description-card">
            <h3>Mô tả</h3>
            <p>{task.serviceDescription || "Không có mô tả."}</p>
          </div>

          {task.status === 4 ? (
            <div className="td-upload-section">
              <h3>Ảnh đã tải lên</h3>
              <div className="td-image-grid">
                {images.map((image) => (
                  <div key={image.id} className="td-image-item">
                    <img src={image.url} alt="Tài liệu" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            task.status !== 1 &&
            task.status !== 5 && (
              <div className="td-upload-sections">
         
              </div>
            )
          )}

          {isCheckedIn && (
            <div className="td-attendance-sections">
              <div className="td-attendance-photos">
                <h3>Ảnh điểm danh</h3>
                <div className="td-image-grid">
                  {(showEditAttendance ? currentPhotos : [attendance?.imagePath1, attendance?.imagePath2, attendance?.imagePath3])
                    .filter(Boolean)
                    .map((imageUrl, index) => (
                      <div key={index} className="td-image-item">
                        <img src={imageUrl} alt={`Ảnh điểm danh ${index + 1}`} />
                        {showEditAttendance && (
                          <button
                            className="td-photo-remove"
                            onClick={() => handleRemovePhoto(index)}
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    
                  {/* Nút thêm ảnh khi đang edit và chưa đủ 3 ảnh */}
                  {showEditAttendance && currentPhotos.length < 3 && (
                    <div 
                      className="td-image-item td-image-add"
                      onClick={() => document.getElementById('add-photo-input').click()}
                    >
                      <Camera size={24} />
                      <span>Thêm ảnh</span>
                      <input
                        id="add-photo-input"
                        type="file"
                        accept="image/jpeg,image/png,image/heic"
                        onChange={handleAddPhoto}
                        style={{ display: 'none' }}
                        multiple
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {!showEditAttendance ? (
                <button 
                  className="td-btn td-btn-edit" 
                  onClick={handleEditAttendance}
                >
                  Sửa điểm danh
                </button>
              ) : (
                <div className="td-edit-actions">
                  <button 
                    className="td-btn td-btn-confirm" 
                    onClick={handleConfirmEdit}
                  >
                    Xác nhận
                  </button>
                  <button 
                    className="td-btn td-btn-cancel" 
                    onClick={() => setShowEditAttendance(false)}
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Add confirmation dialog */}
          {confirmDialogOpen && (
            <div className="td-confirm-dialog">
              <div className="td-confirm-content">
                <h3>Xác nhận cập nhật</h3>
                <p>Bạn có chắc chắn muốn cập nhật ảnh điểm danh?</p>
                <div className="td-confirm-actions">
                  <button 
                    className="td-btn td-btn-confirm" 
                    onClick={handleConfirmEdit}
                  >
                    Xác nhận
                  </button>
                  <button 
                    className="td-btn td-btn-cancel" 
                    onClick={() => setConfirmDialogOpen(false)}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}

          {task && task.status === 3 && (
            <div className="td-completion-section">
              <h3>Hoàn thành công việc</h3>
              
              <div className="td-workplace-photo">
                <h4>Ảnh nơi làm việc</h4>
                {workplacePhotoPreview ? (
                  <div className="td-image-preview">
                    <img src={workplacePhotoPreview} alt="Workplace" />
                    <button onClick={() => {
                      setWorkplacePhoto(null);
                      setWorkplacePhotoPreview(null);
                    }}>
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div 
                    className="td-image-upload"
                    onClick={() => document.getElementById('workplace-photo-input').click()}
                  >
                    <Camera size={24} />
                    <span>Chụp ảnh nơi làm việc</span>
                    <input
                      id="workplace-photo-input"
                      type="file"
                      accept="image/jpeg,image/png,image/heic"
                      onChange={handleWorkplacePhoto}
                      style={{ display: 'none' }}
                    />
                  </div>
                )}
              </div>

              <div className="td-result-photos">
                <h4>Ảnh kết quả công việc</h4>
                <div className="td-image-grid">
                  {resultPhotosPreviews.map((preview, index) => (
                    <div key={index} className="td-image-preview">
                      <img src={preview} alt={`Result ${index + 1}`} />
                      <button onClick={() => {
                        setResultPhotos(prev => prev.filter((_, i) => i !== index));
                        setResultPhotosPreviews(prev => prev.filter((_, i) => i !== index));
                      }}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  
                  {resultPhotosPreviews.length < 3 && (
                    <div 
                      className="td-image-upload"
                      onClick={() => document.getElementById('result-photos-input').click()}
                    >
                      <Camera size={24} />
                      <span>Thêm ảnh kết quả</span>
                      <input
                        id="result-photos-input"
                        type="file"
                        accept="image/jpeg,image/png,image/heic"
                        onChange={handleResultPhotos}
                        style={{ display: 'none' }}
                        multiple
                      />
                    </div>
                  )}
                </div>
              </div>

              <button 
                className="td-btn td-btn-complete"
                onClick={handleCompleteTask}
                disabled={!workplacePhoto || resultPhotos.length === 0}
              >
                Hoàn thành công việc
              </button>
            </div>
          )}

          {task.status === 4 && (
            <div className="td-completed-images">
              <h3>Ảnh đã hoàn thành</h3>
              
              {task.imageWorkSpace && (
                <div className="td-image-section">
                  <h4>Ảnh nơi làm việc</h4>
                  <div className="td-image-preview">
                    <img src={task.imageWorkSpace} alt="Workplace" />
                  </div>
                </div>
              )}

              {task.imageTaskImages && task.imageTaskImages.length > 0 && (
                <div className="td-image-section">
                  <h4>Ảnh kết quả công việc</h4>
                  <div className="td-image-grid">
                    {task.imageTaskImages.map((img, index) => (
                      <div key={index} className="td-image-preview">
                        <img src={img.images} alt={`Result ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
