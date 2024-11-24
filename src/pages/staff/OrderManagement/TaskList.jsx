import React, { useState, useEffect, useRef } from 'react';
import { updateTaskStatus } from '../../../APIcontroller/API';
import { getTasksByAccountId , updateTaskImage} from '../../../services/task';
import { useAuth } from '../../../context/AuthContext';
import { ROLES } from '../../../utils/auth';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TaskList.css'; // You'll need to create this CSS file
import Sidebar from '../../../components/Sidebar/sideBar';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { Upload, X } from "lucide-react";
import { storage } from "../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addTaskImages } from "../../../services/task";
import { getFeedbackWithDetailId, createFeedbackResponse } from '../../../services/feedback';

const TaskList = () => {
    // Calculate initial start date (2 days before current date)
    const initialStartDate = new Date();
    initialStartDate.setDate(initialStartDate.getDate() - 3);

    const [tasks, setTasks] = useState([]);
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(new Date());
    const [filter, setFilter] = useState('all'); // 'all', 'completed', 'pending'
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [taskImages, setTaskImages] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [responseContent, setResponseContent] = useState('');
    const [isResponding, setIsResponding] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 10; // Số lượng công việc trên mỗi trang
    const [statusFilter, setStatusFilter] = useState('all');

    // Add status options
    const statusOptions = [
        { value: 'all', label: 'Tất cả' },
        { value: 'pending', label: 'Chờ xác nhận' },
        { value: 'assigned', label: 'Đã giao' },
        { value: 'inProgress', label: 'Đang thực hiện' },
        { value: 'completed', label: 'Hoàn thành' },
        { value: 'rejected', label: 'Từ chối' },
        { value: 'failed', label: 'Thất bại' }
    ];

    useEffect(() => {
        if (user?.accountId) {
            console.log('fetching tasks');
            fetchTasks();
        }
    }, [user?.accountId, startDate, endDate, filter]);
    
 
    const fetchTasks = async () => {
        if (user && user.accountId && user.role === ROLES.STAFF) {
            try {
                const response = await getTasksByAccountId(user.accountId);
                console.log('response', response); 
                const transformed = response.tasks.map(tasks => ({
                    id: tasks.taskId,
                    serviceName: tasks.serviceName,
                    serviceDescription: tasks.serviceDescription,
                    graveLocation: tasks.graveLocation,
                    startDate: tasks.startDate,
                    endDate: tasks.endDate,
                    status: tasks.status,
                    imagePath1: tasks.imagePath1,
                    imagePath2: tasks.imagePath2,
                    imagePath3: tasks.imagePath3    
                 
                  }));

                setTasks(transformed);
            
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        } else {
            console.log('User is not logged in or is not a staff member');
        }
    };
    const filteredTasks =  tasks.filter(task => {
        // First check the status filter
        let statusMatch;
        switch (statusFilter) {
            case 'pending':
                statusMatch = task.status === 0;
                break;
            case 'assigned':
                statusMatch = task.status === 1;
                break;
            case 'rejected':
                statusMatch = task.status === 2;
                break;
            case 'inProgress':
                statusMatch = task.status === 3;
                break;
            case 'completed':
                statusMatch = task.status === 4;
                break;
            case 'failed':
                statusMatch = task.status === 5;
                break;
            default: // 'all'
                statusMatch = true;
        }

        // Then check the date range
        const taskDate = new Date(task.startDate);
        const isWithinDateRange = taskDate >= startDate && taskDate <= endDate;

        return statusMatch && isWithinDateRange;
    });
    

    const handleConfirm = async (taskId) => {
        navigate(`/schedule-staff`);
    };

    const handleReject = async (taskId) => {
        if (!rejectReason.trim()) {
            alert('Vui lòng nhập lý do từ chối');
            return;
        }
        
        try {
            await updateTaskStatus(taskId, 2, rejectReason); // Thêm rejectReason vào API call
            setIsPopupOpen(false);
            setIsRejectPopupOpen(false);
            setRejectReason('');
            fetchTasks();
        } catch (error) {
            console.error('Failed to reject task:', error);
        }
    };

    const handleComplete = async (taskId) => {
        try {
            await updateTaskStatus(taskId, 4); // 4 is the status for "Hoàn thành"
            // Refresh the task list
            fetchTasks();
        } catch (error) {
            console.error('Failed to complete task:', error);
            // Handle the error (e.g., show an error message to the usser)
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 0: return { text: 'Chờ xác nhận', color: '#f39c12' }; // Orange
            case 1: return { text: 'Đã giao, chờ xác nhận', color: '#3498db' }; // Blue
            case 2: return { text: 'Từ chối', color: '#e74c3c' }; // Red
            case 3: return { text: 'Đang thực hiện', color: '#2ecc71' }; // Green
            case 4: return { text: 'Hoàn thành', color: '#27ae60' }; // Dark Green
            case 5: return { text: 'Thất bại', color: '#c0392b' }; // Dark Red
            default: return { text: 'Không xác định', color: '#95a5a6' }; // Gray
        }
    };

    

    const handleViewDetails = async (task) => {
        setSelectedTask(task);
        if (task.status === 4) {
            // Transform existing image paths into the format we need
            const existingImages = [
                task.imagePath1,
                task.imagePath2,
                task.imagePath3
            ]
            .filter(path => path) // Remove null/empty paths
            .map((url, index) => ({
                id: index + 1,
                url: url
            }));
            setTaskImages(existingImages);

            // Fetch feedback when task is completed
            try {
                const feedbackData = await getFeedbackWithDetailId(task.id);
                console.log('Feedback data:', feedbackData); // For debugging
                setFeedback(feedbackData);
            } catch (error) {
                console.error('Error fetching feedback:', error);
                setFeedback(null);
            }
        } else {
            setTaskImages([]);
            setFeedback(null);
        }
        setIsPopupOpen(true);
    };

    const handleDateChange = (date, setDate) => {
        if (date instanceof Date && !isNaN(date)) {
            setDate(date);
        } else {
            console.error('Invalid date selected');
        }
    };

    const uploadImageToFirebase = async (file) => {
        const storageRef = ref(storage, `task_images/${selectedTask.id}/${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    const handleFileUpload = async (files) => {
        if (images.length + files.length > 3) {
            alert('Chỉ được phép tải lên tối đa 3 ảnh');
            return;
        }

        setUploading(true);
        for (let file of files) {
            if (file.size > 5 * 1024 * 1024) {
                alert(`File ${file.name} quá lớn. Kích thước tối đa là 5MB.`);
                continue;
            }
            if (!["image/jpeg", "image/png", "image/heic"].includes(file.type)) {
                alert(`File ${file.name} không được hỗ trợ. Vui lòng sử dụng JPG, PNG, hoặc HEIC.`);
                continue;
            }
            try {
                const downloadURL = await uploadImageToFirebase(file);
                setImages(prevImages => [...prevImages, { id: Date.now(), url: downloadURL }]);
            } catch (error) {
                console.error("Error uploading image:", error);
                alert(`Không thể tải lên ${file.name}. Lỗi: ${error.message}`);
            }
        }
        setUploading(false);
    };

    const removeImage = (id) => {
        setImages(prevImages => prevImages.filter(img => img.id !== id));
    };

    const handleSaveImages = async () => {
        try {
            setUploading(true);
            const imageUrls = images.map(img => img.url);
            await updateTaskImage(selectedTask.id, imageUrls);
            alert('Lưu ảnh thành công!');
            setIsPopupOpen(false);
            fetchTasks();
        } catch (error) {
            console.error("Error saving images:", error);
            alert("Không thể lưu ảnh. Vui lòng thử lại.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmitResponse = async (feedbackId) => {
        try {
            const responseData = {
                feedbackId: feedbackId,
                staffId: user.accountId,
                responseContent: responseContent
            };
            
            await createFeedbackResponse(responseData);
            // Refresh feedback data
            const updatedFeedback = await getFeedbackWithDetailId(selectedTask.id);
            setFeedback(updatedFeedback);
            // Reset form
            setResponseContent('');
            setIsResponding(false);
        } catch (error) {
            console.error('Error submitting response:', error);
            alert('Không thể gửi phản hồi. Vui lòng thử lại.');
        }
    };

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

    return (
        <div className="staff-task-list-container">
            <Sidebar />
            <div className="staff-task-list-content">
                <h1 className="staff-task-list-page-title">Quản Lý Công Việc</h1>
                <div className="staff-task-list-date-range">
                    <div className="filter-group">
                        <span>Trạng thái:</span>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="staff-task-list-status-select"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <span>Từ ngày:</span>
                        <DatePicker 
                            selected={startDate} 
                            onChange={date => handleDateChange(date, setStartDate)}
                            maxDate={endDate}
                        />
                    </div>
                    <div className="filter-group">
                        <span>Đến ngày:</span>
                        <DatePicker 
                            selected={endDate} 
                            onChange={date => handleDateChange(date, setEndDate)}
                            minDate={startDate}
                        />
                    </div>
                </div>
                <table className="staff-task-list-table">
                    <thead>
                        <tr>
                            <th>Công việc</th>
                            <th>Vị trí</th>
                            <th>Thời gian</th>
                            <th>Thời hạn</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {currentTasks.map(task => (
                            <tr key={task.id}>
                                <td>{task.serviceName || task.description || 'Không có mô tả'}</td>
                                <td>{task.graveLocation || `MTG-K${task.orderId}D${task.detailId}`}</td>
                                <td>{new Date(task.startDate).toLocaleDateString()}</td>
                                <td>{new Date(task.endDate).toLocaleDateString()}</td>
                                <td>
                                    <span className="status-badge" style={{
                                        backgroundColor: getStatusText(task.status).color,
                                        color: 'white',
                                        padding: '6px 12px',
                                        borderRadius: '12px',
                                        fontSize: '0.9em',
                                        fontWeight: '500'
                                    }}>
                                        {getStatusText(task.status).text}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        className="staff-task-list-detail-button" 
                                        onClick={() => handleViewDetails(task)}
                                    >
                                        Chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Phân trang */}
                <div className="pagination">
                    {Array.from({ length: Math.ceil(filteredTasks.length / tasksPerPage) }, (_, index) => (
                        <button 
                            key={index + 1} 
                            onClick={() => setCurrentPage(index + 1)} 
                            className={currentPage === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                {isPopupOpen && selectedTask && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <div className="popup-header">
                                <h2>Chi Tiết Công Việc</h2>
                                <button 
                                    className="close-button"
                                    onClick={() => {
                                        setIsPopupOpen(false);
                                        setTaskImages([]);
                                        setImages([]);
                                    }}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="popup-body">
                                <div className="detail-row">
                                    <label>Công việc:</label>
                                    <span>{selectedTask.serviceName}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Mô tả:</label>
                                    <span>{selectedTask.serviceDescription}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Vị trí:</label>
                                    <span>{selectedTask.graveLocation}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Thời gian:</label>
                                    <span>{new Date(selectedTask.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Thời hạn:</label>
                                    <span>{new Date(selectedTask.endDate).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Trạng thái:</label>
                                    <span className="status-badge" style={{
                                        backgroundColor: getStatusText(selectedTask.status).color,
                                        color: 'white',
                                        padding: '6px 12px',
                                        borderRadius: '12px'
                                    }}>
                                        {getStatusText(selectedTask.status).text}
                                    </span>
                                </div>
                                {selectedTask.status === 4 && taskImages.length > 0 && (
                                    <div className="completed-task-images">
                                        <h3>Hình ảnh đã tải lên</h3>
                                        <div className="image-preview-grid">
                                            {taskImages.map(image => (
                                                <div key={image.id} className="image-preview-item">
                                                    <img 
                                                        src={image.url} 
                                                        alt={`Tài liệu ${image.id}`}
                                                        onClick={() => window.open(image.url, '_blank')}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {selectedTask.status === 3 && (
                                    <div className="upload-section">
                                        <h3>Ảnh tài liệu ({images.length}/3)</h3>
                                        {images.length < 3 && (
                                            <div
                                                className="upload-area"
                                                onClick={() => fileInputRef.current.click()}
                                            >
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                                                    multiple
                                                    accept="image/jpeg,image/png,image/heic"
                                                />
                                                <Upload className="upload-icon" />
                                                <p className="upload-text">
                                                    {uploading ? "Đang tải lên..." : "Nhấp để tải lên ảnh"}
                                                </p>
                                                <p className="upload-note">
                                                    JPG, PNG hoặc HEIC (tối đa 5MB)
                                                </p>
                                            </div>
                                        )}

                                        <div className="image-preview-grid">
                                            {images.map(image => (
                                                <div key={image.id} className="image-preview-item">
                                                    <img src={image.url} alt="Tài liệu" />
                                                    <button
                                                        className="remove-image-btn"
                                                        onClick={() => removeImage(image.id)}
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {images.length > 0 && (
                                            <div className="upload-actions">
                                                <button
                                                    className="save-images-btn"
                                                    onClick={handleSaveImages}
                                                    disabled={uploading}
                                                >
                                                    {uploading ? "Đang tải..." : "Check-in"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {selectedTask.status === 4 && (
                                    <>
                                        {feedback && (
                                            <div className="feedback-section">
                                                <h3>Đánh giá từ khách hàng</h3>
                                                <div className="feedback-content">
                                                    <div className="customer-info">
                                                        <div className="customer-avatar">
                                                            <img 
                                                                src={feedback.avatarPath || 'https://firebasestorage.googleapis.com/v0/b/mtg-capstone-2024.appspot.com/o/accounts%2Favt-7.jpg?alt=media&token=43c0380f-9a7d-4b88-b72c-05fd146b764f'} 
                                                                alt="Avatar"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = 'https://firebasestorage.googleapis.com/v0/b/mtg-capstone-2024.appspot.com/o/accounts%2Favt-7.jpg?alt=media&token=43c0380f-9a7d-4b88-b72c-05fd146b764f';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="customer-details">
                                                            <span className="customer-name">
                                                                {feedback.accountName || 'Khách hàng'}
                                                            </span>
                                                            <span className="feedback-date">
                                                                {new Date(feedback.createdAt).toLocaleDateString('vi-VN')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="rating">
                                                        <label>Đánh giá:</label>
                                                        <span>{feedback.rating}/5 ⭐</span>
                                                    </div>
                                                    <div className="comment">
                                                        <label>Nhận xét:</label>
                                                        <p>{feedback.content}</p>
                                                    </div>

                                                    {/* Phần phản hồi */}
                                                    {feedback.responseContent ? (
                                                        <div className="staff-response">
                                                            <div className="response-header">
                                                                <span className="staff-name">Phản hồi từ nhân viên</span>
                                                                
                                                            </div>
                                                            <p className="response-content">{feedback.responseContent}</p>
                                                        </div>
                                                    ) : (
                                                        <div className="response-section">
                                                            {!isResponding ? (
                                                                <button 
                                                                    className="respond-button"
                                                                    onClick={() => setIsResponding(true)}
                                                                >
                                                                    Phản hồi đánh giá
                                                                </button>
                                                            ) : (
                                                                <div className="response-form">
                                                                    <textarea
                                                                        value={responseContent}
                                                                        onChange={(e) => setResponseContent(e.target.value)}
                                                                        placeholder="Nhập phản hồi của bạn..."
                                                                        rows={4}
                                                                    />
                                                                    <div className="response-actions">
                                                                        <button 
                                                                            className="submit-response"
                                                                            onClick={() => handleSubmitResponse(feedback.feedbackId)}
                                                                            disabled={!responseContent.trim()}
                                                                        >
                                                                            Gửi phản hồi
                                                                        </button>
                                                                        <button 
                                                                            className="cancel-response"
                                                                            onClick={() => {
                                                                                setIsResponding(false);
                                                                                setResponseContent('');
                                                                            }}
                                                                        >
                                                                            Hủy
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="popup-footer">
                                {(selectedTask.status === 0 || selectedTask.status === 1) && (
                                    <div className="action-buttons">
                                        <button 
                                            className="accept-button"
                                            onClick={() => {
                                                handleConfirm(selectedTask.id);
                                                setIsPopupOpen(false);
                                            }}
                                        >
                                            Xếp lịch làm việc
                                        </button>
                                        <button 
                                            className="reject-button"
                                            onClick={() => {
                                                setIsRejectPopupOpen(true);
                                            }}
                                        >
                                            Từ chối
                                        </button>
                                    </div>
                                )}
                                
                            </div>
                        </div>
                    </div>
                )}

                {isRejectPopupOpen && (
                    <div className="popup-overlay">
                        <div className="popup-content reject-reason-popup">
                            <div className="popup-header">
                                <h2>Lý Do Từ Chối</h2>
                                <button 
                                    className="close-button"
                                    onClick={() => {
                                        setIsRejectPopupOpen(false);
                                        setRejectReason('');
                                    }}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="popup-body">
                                <textarea
                                    className="reject-reason-input"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Nhập lý do từ chối..."
                                    rows={4}
                                />
                            </div>
                            <div className="popup-footer">
                                <button 
                                    className="reject-button"
                                    onClick={() => handleReject(selectedTask.id)}
                                >
                                    Xác nhận từ chối
                                </button>
                                <button 
                                    className="close-popup-button"
                                    onClick={() => {
                                        setIsRejectPopupOpen(false);
                                        setRejectReason('');
                                    }}
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
        </div>
    );
};

export default TaskList;
