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
} from "@mui/material";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/Sidebar/sideBar';
import { getAssignmentTasks, rejectAssignmentTask } from '../../../services/assignmentTask';
import './RecurringTasks.css';
import ClearIcon from '@mui/icons-material/Clear';

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

    const handleViewDetails = (task) => {
        setSelectedTask(task);
        setIsPopupOpen(true);
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
        await rejectAssignmentTask(selectedTask.assignmentTaskId, rejectionReason);
        console.log('Task rejected successfully');
        setIsRejectPopupOpen(false);
        setIsPopupOpen(false); // Close the main popup
        setRejectionReason(''); // Optionally reset the rejection reason
        window.location.reload(); // Reload the page
    } catch (error) {
        console.error('Error rejecting task:', error);
        // Handle error (e.g., show a notification to the user)
    }
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
                    
                    {(statusFilter !== 'all' || endDateFilter) && (
                        <Button 
                            variant="outlined"
                            size="small"
                            onClick={handleClearFilters}
                            startIcon={<ClearIcon />}
                        >
                            Xóa bộ lọc
                        </Button>
                    )}
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

                {isPopupOpen && selectedTask && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                mb: 2 
                            }}>
                                <Typography variant="h6">Chi Tiết Công Việc Định Kỳ</Typography>
                                <Button 
                                    onClick={() => setIsPopupOpen(false)}
                                    variant="outlined"
                                >
                                    Đóng
                                </Button>
                            </Box>
                            <div className="task-details">
                                <Typography><strong>Dịch vụ:</strong> {selectedTask.serviceName}</Typography>
                                <Typography><strong>Mô tả:</strong> {selectedTask.serviceDescription}</Typography>
                                <Typography><strong>Vị trí mộ:</strong> {selectedTask.graveLocation}</Typography>
                                <Typography><strong>Khách hàng:</strong> {selectedTask.customerName}</Typography>
                                <Typography><strong>Số điện thoại:</strong> {selectedTask.customerPhone}</Typography>
                                <Typography>
                                    <strong>Loại định kỳ:</strong> {getRecurringTypeText(selectedTask.recurringType)}
                                </Typography>
                                <Typography><strong>Ghi chú:</strong> {selectedTask.note || 'Không có'}</Typography>
                                <Typography>
                                    <strong>Trạng thái công việc: </strong> 
                                    <span style={{ color: getStatusText(selectedTask.status).color }}>
                                        {getStatusText(selectedTask.status).text}
                                    </span>
                                </Typography>
                            </div>
                            {selectedTask.status === 1 && (
                                <>
                                    <Button variant="contained" onClick={handleAccept}>Chấp nhận</Button>
                                    <Button variant="outlined" onClick={() => setIsRejectPopupOpen(true)}>Từ chối</Button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {isRejectPopupOpen && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6">Lý do từ chối</Typography>
                                <textarea 
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Nhập lý do tại đây"
                                    rows={4}
                                    style={{ width: '100%' }}
                                />
                            </Box>
                            <Button 
                                className="reject-button" 
                                onClick={handleReject}
                            >
                                Xác nhận từ chối
                            </Button>
                            <Button 
                                className="cancel-button" 
                                onClick={() => setIsRejectPopupOpen(false)}
                            >
                                Hủy
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecurringTasks; 