import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/sideBar';
import { useAuth } from "../../../context/AuthContext";
import './StaffManagement.css';
import { getAllStaff, updateAccountStatus, getStaffPerformance } from '../../../APIcontroller/API';
import { createStaff } from '../../../services/staff';
import { ToggleLeft, ToggleRight, FileText, UserPlus, BarChart, Activity, X } from 'lucide-react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import LoadingForSideBar from '../../../components/LoadingForSideBar/LoadingForSideBar';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const StaffManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [staffData, setStaffData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [selectedArea, setSelectedArea] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [newStaff, setNewStaff] = useState({
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        emailAddress: '',
        address: '',
        dateOfBirth: '',
        roleId: 3, // Default role for staff
        areaId: user.areaId
    });
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [showPerformanceModal, setShowPerformanceModal] = useState(false);
    const [performanceData, setPerformanceData] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedStaffId, setSelectedStaffId] = useState(null);

    useEffect(() => {
        fetchStaffData();
    }, [currentPage]); // Re-fetch when page changes

    const fetchStaffData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllStaff(currentPage, pageSize, user.areaId);
            setStaffData(data.staffList);
        } catch (error) {
            console.error('Error fetching staff data:', error);
            setError('Không thể tải danh sách nhân viên. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (areaId) => {
        setSelectedArea(areaId);
    };

    const filteredStaff = staffData.filter(staff => {
        const matchesSearch = staff.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesArea = selectedArea === 'all' || staff.areaId === selectedArea;
        return matchesSearch && matchesArea;
    });

    // Move handleAction inside the component
    const handleAction = async (id) => {
        try {
            await updateAccountStatus(id, user.accountId);
            // Refresh the staff list after successful update
            fetchStaffData();
        } catch (error) {
            console.error('Error updating status:', error);
            // You might want to add some error handling UI here
        }
    };

    const handleCreateReport = (staffId) => {
        // Implement the logic to create a report for the given staffId
        console.log(`Creating report for staff ID: ${staffId}`);
    };

    // Add this new function
    const handleCreateStaff = async (e) => {
        e.preventDefault();
        try {
            await createStaff(newStaff, user.accountId);
            setShowModal(false);
            fetchStaffData(); // Refresh the list
            setNewStaff({ // Reset form
                phoneNumber: '',
                password: '',
                confirmPassword: '',
                fullName: '',
                emailAddress: '',
                address: '',
                dateOfBirth: '',
                roleId: 3,
                areaId: user.areaId
            });
        } catch (error) {
            console.error('Error creating staff:', error);
            alert('Failed to create staff member. Please check your input and try again.');
        }
    };

    const handleShowDetail = (staff) => {
        setSelectedStaff(staff);
        setShowDetailModal(true);
    };

    // Add this helper function near the top of the component
    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleShowPerformance = async (staffId) => {
        try {
            setSelectedStaffId(staffId);
            const response = await getStaffPerformance(staffId, selectedMonth, selectedYear);
            setPerformanceData(response);
            setShowPerformanceModal(true);
        } catch (error) {
            console.error('Error fetching performance data:', error);
            alert('Không thể tải dữ liệu hiệu suất. Vui lòng thử lại sau.');
        }
    };

    // Sửa lại useEffect để sử dụng selectedStaffId
    useEffect(() => {
        if (showPerformanceModal && selectedStaffId) {
            handleShowPerformance(selectedStaffId);
        }
    }, [selectedMonth, selectedYear]); // Chỉ theo dõi thay đổi của tháng và năm

    if (loading) {
        return (
            <div className="staff-management-container">
                <Sidebar />
                <div className="staff-management-content">
                    <div className="header-container">
                        <h1>Quản Lý Nhân Viên</h1>
                        <button className="create-staff-btn" disabled>
                            <UserPlus size={20} />
                            Thêm Nhân Viên
                        </button>
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        minHeight: '400px' 
                    }}>
                        <LoadingForSideBar fullScreen={false} text="Đang tải danh sách nhân viên..." />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="staff-management-container">
                <Sidebar />
                <div className="staff-management-content">
                    <div className="header-container">
                        <h1>Quản Lý Nhân Viên</h1>
                        <button className="create-staff-btn" disabled>
                            <UserPlus size={20} />
                            Thêm Nhân Viên
                        </button>
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        minHeight: '400px' 
                    }}>
                        <div className="error-message">{error}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="staff-management-container">
            <Sidebar />
            <div className="staff-management-content">
                <div className="header-container">
                    <h1>Quản Lý Nhân Viên</h1>
                    <button className="create-staff-btn" onClick={() => setShowModal(true)}>
                        <UserPlus size={20} />
                        Thêm Nhân Viên
                    </button>
                </div>
                {/* Add this modal component */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Thêm Nhân Viên Mới</h2>
                            <form onSubmit={handleCreateStaff}>
                                <div className="form-group">
                                    <label>Số điện thoại <span className="required">*</span></label>
                                    <input
                                        type="tel"
                                        pattern="[0-9]{10}"
                                        required
                                        value={newStaff.phoneNumber}
                                        onChange={(e) => setNewStaff({ ...newStaff, phoneNumber: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mật khẩu <span className="required">*</span></label>
                                    <input
                                        type="password"
                                        required
                                        minLength="6"
                                        value={newStaff.password}
                                        onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Xác nhận mật khẩu <span className="required">*</span></label>
                                    <input
                                        type="password"
                                        required
                                        minLength="6"
                                        value={newStaff.confirmPassword}
                                        onChange={(e) => setNewStaff({ ...newStaff, confirmPassword: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Họ và tên <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={newStaff.fullName}
                                        onChange={(e) => setNewStaff({ ...newStaff, fullName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email <span className="required">*</span></label>
                                    <input
                                        type="email"
                                        required
                                        value={newStaff.emailAddress}
                                        onChange={(e) => setNewStaff({ ...newStaff, emailAddress: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Địa chỉ</label>
                                    <input
                                        type="text"
                                        value={newStaff.address}
                                        onChange={(e) => setNewStaff({ ...newStaff, address: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Ngày sinh</label>
                                    <DatePicker
                                        selected={newStaff.dateOfBirth ? new Date(newStaff.dateOfBirth) : null}
                                        onChange={(date) => setNewStaff({ ...newStaff, dateOfBirth: date })}
                                        dateFormat="dd/MM/yyyy"
                                        maxDate={new Date()}
                                        showYearDropdown
                                        scrollableYearDropdown
                                        yearDropdownItemNumber={100}
                                        placeholderText="Chọn ngày sinh"
                                        className="date-picker-input"
                                        isClearable
                                    />
                                </div>
                                <div className="modal-buttons">
                                    <button type="submit" className="submit-btn">Tạo</button>
                                    <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Hủy</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {loading ? (
                    <div className="centered">
                        <div className="loading-spinner"></div>
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="staff-table">
                            <thead>
                                <tr>
                                    
                                    <th>Tên nhân viên</th>
                                    
                                    <th>Số điện thoại</th>
                                    <th>Địa chỉ</th>
                                    <th>Email</th>
                                    <th>Tình trạng</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStaff.map((staff) => (
                                    <tr key={staff.accountId}>
                                        
                                        <td>{staff.fullName}</td>
                                        
                                        <td>{staff.phoneNumber}</td>
                                        <td>{staff.address}</td>
                                        <td>{staff.emailAddress}</td>
                                        <td>
                                            <span className={`status ${staff.status ? 'status-green' : 'status-red'}`}>
                                                {staff.status ? 'Hoạt động' : 'Không hoạt động'}
                                            </span>
                                        </td>
                                        <td className="action-column">
                                            <button
                                                className="icon-button"
                                                onClick={() => handleAction(staff.accountId)}
                                                title={staff.status ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                            >
                                                {staff.status ? (
                                                    <ToggleRight className="toggle-active" size={28} />
                                                ) : (
                                                    <ToggleLeft className="toggle-inactive" size={28} />
                                                )}
                                            </button>
                                            <button
                                                className="detail-link"
                                                onClick={() => handleShowDetail(staff)}
                                            >
                                                Xem chi tiết
                                            </button>
                                            <button
                                                className="performance-btn"
                                                onClick={() => handleShowPerformance(staff.accountId)}
                                                title="Xem hiệu suất"
                                            >
                                                <Activity size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {showDetailModal && selectedStaff && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Chi Tiết Nhân Viên</h2>
                            <div className="staff-details">
                            {selectedStaff.avatarPath && (
                                    <div className="staff-avatar">
                                        
                                        <img src={selectedStaff.avatarPath} alt="Avatar" />
                                    </div>
                                )}
                                <p><strong>ID:</strong> #{selectedStaff.accountId}</p>
                                <p><strong>Họ và tên:</strong> {selectedStaff.fullName}</p>
                                <p><strong>Ngày tạo:</strong> {formatDate(selectedStaff.createAt)}</p>
                                <p><strong>Trạng thái:</strong> {selectedStaff.status ? 'Hoạt động' : 'Không hoạt động'}</p>
                                <p><strong>Khu vực:</strong> {selectedStaff.areaId}</p>
                                <p><strong>Email:</strong> {selectedStaff.emailAddress || 'Chưa cập nhật'}</p>
                                <p><strong>Số điện thoại:</strong> {selectedStaff.phoneNumber}</p>
                                <p><strong>Địa chỉ:</strong> {selectedStaff.address || 'Chưa cập nhật'}</p>
                                <p><strong>Ngày sinh:</strong> {selectedStaff.dateOfBirth ? formatDate(selectedStaff.dateOfBirth) : 'Chưa cập nhật'}</p>
                                
                            </div>
                            <div className="modal-buttons">
                                <button onClick={() => setShowDetailModal(false)}>Đóng</button>
                            </div>
                        </div>
                    </div>
                )}
                {showPerformanceModal && performanceData && (
                    <div className="staff-performance-modal-overlay">
                        <div className="staff-performance-modal-content">
                            <button 
                                className="staff-performance-close-icon"
                                onClick={() => {
                                    setShowPerformanceModal(false);
                                    setSelectedStaffId(null);
                                }}
                            >
                                <X size={24} />
                            </button>
                            <h2 className="staff-performance-title">Hiệu Suất Làm Việc</h2>
                            
                            {/* Filters */}
                            <div className="staff-performance-filters">
                                <div className="staff-performance-filter-group">
                                    <label>Tìm kiếm theo tháng:</label>
                                    <select 
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                        className="staff-performance-select"
                                    >
                                        {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                                            <option key={month} value={month}>{month}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="staff-performance-filter-group">
                                    <label>Tìm kiếm theo năm:</label>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                                        className="staff-performance-select"
                                    >
                                        {Array.from({length: 5}, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            {/* Stats Cards */}
                            <div className="staff-performance-stats">
                                <div className="staff-performance-stat-card">
                                    <h3>Tổng số công việc</h3>
                                    <p>{performanceData.totalTask + performanceData.totalAssignmentTask + performanceData.totalRequestTask}</p>
                                    <div className="staff-performance-stat-details">
                                        <span>Công việc thường: {performanceData.totalTask}</span>
                                        <span>Công việc định kỳ: {performanceData.totalAssignmentTask}</span>
                                        <span>Công việc theo yêu cầu: {performanceData.totalRequestTask}</span>
                                    </div>
                                </div>
                                <div className="staff-performance-stat-card">
                                    <h3>Công việc hoàn thành</h3>
                                    <p>{performanceData.totalFinishTask + performanceData.totalFinishAssignmentTask + performanceData.totalFinishRequestTask}</p>
                                    <div className="staff-performance-stat-details">
                                        <span>Công việc thường: {performanceData.totalFinishTask}</span>
                                        <span>Công việc định kỳ: {performanceData.totalFinishAssignmentTask}</span>
                                        <span>Công việc theo yêu cầu: {performanceData.totalFinishRequestTask}</span>
                                    </div>
                                </div>
                                <div className="staff-performance-stat-card">
                                    <h3>Công việc thất bại</h3>
                                    <p>{performanceData.totalFailTask + performanceData.totalFailAssignmentTask + performanceData.totalFailRequestTask}</p>
                                    <div className="staff-performance-stat-details">
                                        <span>Công việc thường: {performanceData.totalFailTask}</span>
                                        <span>Công việc định kỳ: {performanceData.totalFailAssignmentTask}</span>
                                        <span>Công việc theo yêu cầu: {performanceData.totalFailRequestTask}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Stats */}
                            <div className="staff-performance-additional-stats">
                                <div className="staff-performance-stat-card">
                                    <h3>Đánh giá trung bình</h3>
                                    <p>{performanceData.averageAllFeedbackRate}/5</p>
                                </div>
                                <div className="staff-performance-stat-card">
                                    <h3>Tổng công việc nhân viên</h3>
                                    <p>{performanceData.totalTask + performanceData.totalAssignmentTask + performanceData.totalRequestTask}</p>
                        
                                </div>
                            </div>

                            {/* Charts */}
                            <div className="staff-performance-charts">
                                <div className="staff-performance-chart-container">
                                    <h3>Thống kê công việc theo loại</h3>
                                    <Bar
                                        data={{
                                            labels: ['Công việc thường', 'Công việc định kỳ', 'Công việc theo yêu cầu'],
                                            datasets: [
                                                {
                                                    label: 'Hoàn thành',
                                                    data: [
                                                        performanceData.totalFinishTask,
                                                        performanceData.totalFinishAssignmentTask,
                                                        performanceData.totalFinishRequestTask
                                                    ],
                                                    backgroundColor: '#4CAF50',
                                                },
                                                {
                                                    label: 'Thất bại',
                                                    data: [
                                                        performanceData.totalFailTask,
                                                        performanceData.totalFailAssignmentTask,
                                                        performanceData.totalFailRequestTask
                                                    ],
                                                    backgroundColor: '#f44336',
                                                }
                                            ]
                                        }}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    position: 'top',
                                                },
                                                title: {
                                                    display: false
                                                }
                                            }
                                        }}
                                    />
                                </div>

                                <div className="staff-performance-chart-container">
                                    <h3>Tỷ lệ hoàn thành công việc</h3>
                                    <Pie
                                        data={{
                                            labels: ['Hoàn thành', 'Thất bại'],
                                            datasets: [{
                                                data: [
                                                    performanceData.totalFinishTask,
                                                    performanceData.totalFailTask
                                                ],
                                                backgroundColor: [
                                                    '#4CAF50',
                                                    '#f44336'
                                                ],
                                                borderColor: [
                                                    '#388E3C',
                                                    '#D32F2F'
                                                ],
                                                borderWidth: 1,
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    position: 'bottom',
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Performance Summary */}
                            <div className="staff-performance-summary">
                                <div className="staff-performance-summary-item">
                                    <h3>Hiệu suất công việc</h3>
                                    <p>{performanceData.workPerformance}</p>
                                </div>
                                <div className="staff-performance-summary-item">
                                    <h3>Đánh giá chất lượng</h3>
                                    <p>{performanceData.workQuality}</p>
                                </div>
                            </div>

                            <div className="staff-performance-modal-buttons">
                                <button 
                                    className="staff-performance-close-btn"
                                    onClick={() => {
                                        setShowPerformanceModal(false);
                                        setSelectedStaffId(null);
                                    }}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffManagement;
