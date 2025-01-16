import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/Sidebar/sideBar';
import { getAssignmentTasks, rejectAssignmentTask } from '../../../services/assignmentTask';
import './RecurringTasks.css';
import ClearIcon from '@mui/icons-material/Clear';
import { getAssignmentTaskDetail, getAssignmentFeedback } from '../../../APIcontroller/API';
import AlertMessage from '../../../components/AlertMessage/AlertMessage';
import LoadingForSideBar from '../../../components/LoadingForSideBar/LoadingForSideBar';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

// Thêm hàm helper để format date an toàn
const formatDate = (dateString) => {
  if (!dateString) return 'Không có';
  try {
    return format(new Date(dateString), 'dd/MM/yyyy');
  } catch (error) {
    console.error('Invalid date:', dateString);
    return 'Ngày không hợp lệ';
  }
};

const RecurringTasks = () => {
    const [allTasks, setAllTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTasks, setTotalTasks] = useState(0);
    const pageSize = 10;
    const { user } = useAuth();
    const [selectedTask, setSelectedTask] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const navigate = useNavigate();
    
    // States cho filters
    const [statusFilter, setStatusFilter] = useState('all');
    const [endDateFilter, setEndDateFilter] = useState(null);

    // Status options
    const statusOptions = [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: '0', label: 'Chờ xác nhận' },
        { value: '1', label: 'Đã giao' },
        { value: '2', label: 'Từ chối' },
        { value: '3', label: 'Đang thực hiện' },
        { value: '4', label: 'Hoàn thành' },
        { value: '5', label: 'Thất bại' }
    ];

    const [taskDetail, setTaskDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [alertInfo, setAlertInfo] = useState({
        open: false,
        severity: 'success',
        message: ''
    });

    const [feedback, setFeedback] = useState(null);

    const handleCloseAlert = () => {
        setAlertInfo(prev => ({ ...prev, open: false }));
    };

    const fetchRecurringTasks = async () => {
        try {
            const response = await getAssignmentTasks(currentPage, pageSize);
            setAllTasks(response.tasks);
            setFilteredTasks(response.tasks);
            setTotalPages(response.totalPage);
            setTotalTasks(response.totalTasks);
        } catch (error) {
            console.error('Error fetching recurring tasks:', error);
        }
    };

    useEffect(() => {
        fetchRecurringTasks();
    }, [currentPage]);

    useEffect(() => {
        let result = [...allTasks];

        // Filter by status
        if (statusFilter !== 'all') {
            result = result.filter(task => 
                task.status === parseInt(statusFilter)
            );
        }

        // Filter by end date
        if (endDateFilter) {
            const filterDate = format(endDateFilter, 'yyyy-MM-dd');
            result = result.filter(task => {
                const taskEndDate = format(new Date(task.endDate), 'yyyy-MM-dd');
                return taskEndDate === filterDate;
            });
        }

        setFilteredTasks(result);
        // Cập nhật tổng số task đã filter
        setTotalTasks(result.length);
    }, [statusFilter, endDateFilter, allTasks]);

    // Reset về trang 1 khi thay đổi filter
    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, endDateFilter]);

    const getStatusText = (status) => {
        switch (status) {
            case 0:
                return { text: 'Chờ xác nhận', color: '#ffa726' };
            case 1:
                return { text: 'Đã giao', color: '#42a5f5' };
            case 2:
                return { text: 'Từ chối', color: '#ef5350' };
            case 3:
                return { text: 'Đang thực hiện', color: '#66bb6a' };
            case 4:
                return { text: 'Hoàn thành', color: '#26a69a' };
            case 5:
                return { text: 'Thất bại', color: '#d32f2f' };
            default:
                return { text: 'Không xác định', color: '#9e9e9e' };
        }
    };

    const getRecurringTypeText = (type) => {
        switch (type) {
            case 1:
                return 'Hàng tuần';
            case 2:
                return 'Hàng tháng';
            case 3:
                return 'Hàng năm';
            default:
                return 'Không xác định';
        }
    };

    const handleViewDetails = async (task) => {
        try {
            setIsLoading(true);
            setIsPopupOpen(true);
            setSelectedTask(task);
            const detail = await getAssignmentTaskDetail(task.assignmentTaskId);
            setTaskDetail(detail);

            // Nếu trạng thái là hoàn thành (status === 4), lấy feedback
            if (task.status === 4) {
                try {
                    const feedbackData = await getAssignmentFeedback(task.assignmentTaskId);
                    setFeedback(feedbackData);
                } catch (error) {
                    console.error('Error fetching feedback:', error);
                }
            }
        } catch (error) {
            console.error('Error fetching task detail:', error);
            setAlertInfo({
                open: true,
                severity: 'error',
                message: 'Có lỗi xảy ra khi tải thông tin chi tiết'
            });
            setIsPopupOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearFilters = () => {
        setStatusFilter('all');
        setEndDateFilter(null);
        setFilteredTasks(allTasks);
        setTotalTasks(allTasks.length);
    };
    // Add this function to convert day number to Vietnamese day name
const getDayOfWeek = (dayNumber) => {
    const days = ['Không biết',' Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']; // 1 là thứ 2, 2 là thứ 3, 3, là thứ 4 ...
    return days[dayNumber];
};

    // Function to handle acceptance
    const handleAccept = () => {
        // Redirect to the staff's work schedule page
        // Assuming you have a function or method to navigate
        navigate('/schedule-staff'); // Adjust the path as necessary
    };

    // Function to handle rejection
    const handleReject = async () => {
        try {
            if (!rejectionReason.trim()) {
                setAlertInfo({
                    open: true,
                    severity: 'warning',
                    message: 'Vui lòng nhập lý do từ chối'
                });
                return;
            }

            await rejectAssignmentTask(selectedTask.assignmentTaskId, rejectionReason);
            
            setAlertInfo({
                open: true,
                severity: 'success',
                message: 'Đã từ chối công việc thành công'
            });
            
            // Đóng các popup
            setIsRejectPopupOpen(false);
            setIsPopupOpen(false);
            setRejectionReason('');
            
            // Refresh data
            fetchRecurringTasks();
            
        } catch (error) {
            console.error('Error rejecting task:', error);
            setAlertInfo({
                open: true,
                severity: 'error',
                message: 'Có lỗi xảy ra khi từ chối công việc'
            });
        }
    };

    // Hàm hiển thị rating stars
    const renderRatingStars = (rating) => {
        return (
            <div className="recurring-tasks-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                        {star <= rating ? (
                            <StarIcon sx={{ color: '#ffd700' }} />
                        ) : (
                            <StarBorderIcon sx={{ color: '#ffd700' }} />
                        )}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div className="recurring-tasks" style={{ flex: 1, padding: '24px' }}>
                <Box sx={{ mb: 4, borderBottom: '2px solid #2196f3', width: '95%', margin: '0 auto' }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            mb: 1,
                            fontWeight: 'bold',
                            color: '#1a237e' // Màu xanh đậm cho text
                        }}
                    >
                        Danh Sách Công Việc Định Kỳ
                    </Typography>
                </Box>

                {/* Filter Section */}
                <div className="filter-container">
                    <div className="filter-controls">
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                label="Trạng thái"
                                sx={{ height: '40px' }}
                            >
                                {statusOptions.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 200 }}>
                            <DatePicker
                                selected={endDateFilter}
                                onChange={date => setEndDateFilter(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Chọn ngày kết thúc"
                                className="custom-datepicker"
                                isClearable
                            />
                        </FormControl>
                    </div>

                    <button 
                        className="clear-filter-button"
                        onClick={handleClearFilters}
                    >
                        <ClearIcon />
                        Xóa bộ lọc
                    </button>
                </div>

                {/* Table Container */}
                <TableContainer 
                    component={Paper} 
                    sx={{ 
                        width: '95%',
                        margin: '0 auto',
                        mb: 3
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên Dịch Vụ</TableCell>
                                <TableCell>Khách Hàng</TableCell>
                                <TableCell>Loại Định Kỳ</TableCell>
                                <TableCell>Ngày Kết Thúc</TableCell>
                                <TableCell>Trạng Thái</TableCell>
                                <TableCell>Thao Tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTasks.length > 0 ? (
                                filteredTasks.map((task) => (
                                    <TableRow key={task.assignmentTaskId}>
                                        <TableCell>{task.serviceName}</TableCell>
                                        <TableCell>
                                            <div>{task.customerName}</div>
                                            <div className="phone-number">{task.customerPhone}</div>
                                        </TableCell>
                                        <TableCell>
                                            {getRecurringTypeText(task.recurringType)}
                                            <div className="recurring-detail">
                                                {task.recurringType === 1 && `${getDayOfWeek(task.dayOfWeek)}`}
                                                {task.recurringType === 2 && `Ngày ${task.dayOfMonth}`}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(task.endDate), 'dd/MM/yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <span className="status-badge" style={{
                                                backgroundColor: getStatusText(task.status).color,
                                                color: 'white',
                                                padding: '6px 12px',
                                                borderRadius: '12px',
                                            }}>
                                                {getStatusText(task.status).text}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleViewDetails(task)}
                                            >
                                                Chi tiết
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="body1" sx={{ py: 2 }}>
                                            Không tìm thấy công việc nào phù hợp
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Cập nhật phần hiển thị thông tin số lượng */}
                <Box sx={{ 
                    width: '95%', 
                    margin: '0 auto', 
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="body2" color="text.secondary">
                        Trang {currentPage} / {totalPages} (Tổng số {totalTasks} công việc)
                    </Typography>
                    
                </Box>

                {/* Cập nhật phần phân trang */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <div className="pagination">
                        <Button
                            variant="outlined"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            sx={{ mx: 1 }}
                        >
                            Trang trước
                        </Button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                variant={currentPage === page ? "contained" : "outlined"}
                                sx={{ mx: 1 }}
                                disabled={page === currentPage}
                            >
                                {page}
                            </Button>
                        ))}
                        
                        <Button
                            variant="outlined"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            sx={{ mx: 1 }}
                        >
                            Trang sau
                        </Button>
                    </div>
                </Box>

                {isPopupOpen && (
                    <div className="recurring-tasks-popup-overlay">
                        <div className="recurring-tasks-popup-content">
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                mb: 2 
                            }}>
                                <Typography variant="h6">Chi Tiết Công Việc Định Kỳ</Typography>
                                <Button 
                                    onClick={() => {
                                        setIsPopupOpen(false);
                                        setTaskDetail(null);
                                    }}
                                    variant="outlined"
                                >
                                    Đóng
                                </Button>
                            </Box>

                            {isLoading ? (
                                <LoadingForSideBar text="Đang tải thông tin..." />
                            ) : taskDetail && (
                                <div className="recurring-tasks-detail-container">
                                    <Typography className="recurring-tasks-detail-item">
                                        <strong>Dịch vụ:</strong> {taskDetail.serviceName}
                                    </Typography>
                                    <Typography className="recurring-tasks-detail-item">
                                        <strong>Mô tả:</strong> {taskDetail.description}
                                    </Typography>
                                    <Typography className="recurring-tasks-detail-item">
                                        <strong>Khách hàng:</strong> {taskDetail.customerName}
                                    </Typography>
                                    <Typography className="recurring-tasks-detail-item">
                                        <strong>Số điện thoại:</strong> {taskDetail.customerPhone}
                                    </Typography>
                                    <Typography className="recurring-tasks-detail-item">
                                        <strong>Địa chỉ mộ:</strong> {taskDetail.graveLocation}
                                    </Typography>
                                    <Typography className="recurring-tasks-detail-item">
                                        <strong>Ngày bắt đầu:</strong> {formatDate(taskDetail.startDate)}
                                    </Typography>
                                    <Typography className="recurring-tasks-detail-item">
                                        <strong>Ngày kết thúc:</strong> {formatDate(taskDetail.endDate)}
                                    </Typography>
                                    <Typography className="recurring-tasks-detail-item">
                                        <strong>Loại định kỳ:</strong> {getRecurringTypeText(taskDetail.recurringType)}
                                        {taskDetail.recurringType === 1 && ` - ${getDayOfWeek(taskDetail.dayOfWeek)}`}
                                        {taskDetail.recurringType === 2 && ` - Ngày ${taskDetail.dayOfMonth}`}
                                    </Typography>
                                    <Typography className="recurring-tasks-detail-item">
                                        <strong>Ghi chú:</strong> {taskDetail.note || 'Không có'}
                                    </Typography>
                                    <Typography className="recurring-tasks-detail-item">
                                        <strong>Trạng thái: </strong> 
                                        <span style={{ color: getStatusText(taskDetail.status).color }}>
                                            {getStatusText(taskDetail.status).text}
                                        </span>
                                    </Typography>

                                    {taskDetail.status === 1 && (
                                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }} className="recurring-tasks-actions">
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                onClick={handleAccept}
                                                className="recurring-tasks-accept-btn"
                                            >
                                                Chấp nhận
                                            </Button>
                                            <Button 
                                                variant="outlined" 
                                                color="error" 
                                                onClick={() => setIsRejectPopupOpen(true)}
                                                className="recurring-tasks-reject-btn"
                                            >
                                                Từ chối
                                            </Button>
                                        </Box>
                                    )}
                                </div>
                            )}

                            {/* Hiển thị phần feedback nếu có và trạng thái là hoàn thành */}
                            {taskDetail?.status === 4 && feedback && (
                                <div className="recurring-tasks-feedback-section">
                                    <Typography variant="h6" className="recurring-tasks-feedback-title">
                                        Đánh giá từ khách hàng
                                    </Typography>
                                    <div className="recurring-tasks-feedback-content">
                                        <Typography className="recurring-tasks-feedback-customer">
                                            <strong>Khách hàng:</strong> {feedback.customerName}
                                        </Typography>
                                        <div className="recurring-tasks-feedback-rating">
                                            <strong>Đánh giá:</strong>
                                            {renderRatingStars(feedback.rating)}
                                        </div>
                                        <Typography className="recurring-tasks-feedback-text">
                                            <strong>Nội dung:</strong> {feedback.content}
                                        </Typography>
                                        <Typography className="recurring-tasks-feedback-date">
                                            <strong>Thời gian:</strong> {formatDate(feedback.createdAt)}
                                        </Typography>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {isRejectPopupOpen && (
                    <div className="recurring-tasks-popup-overlay">
                        <div className="recurring-tasks-reject-popup">
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Từ chối công việc
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                label="Lý do từ chối"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleReject}
                                >
                                    Xác nhận
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => {
                                        setIsRejectPopupOpen(false);
                                        setRejectionReason('');
                                    }}
                                >
                                    Hủy
                                </Button>
                            </Box>
                        </div>
                    </div>
                )}

                <AlertMessage
                    open={alertInfo.open}
                    handleClose={handleCloseAlert}
                    severity={alertInfo.severity}
                    message={alertInfo.message}
                />
            </div>
        </div>
    );
};

export default RecurringTasks; 