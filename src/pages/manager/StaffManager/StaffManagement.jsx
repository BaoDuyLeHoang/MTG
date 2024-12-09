import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/sideBar';
import { useAuth } from "../../../context/AuthContext";
import './StaffManagement.css';
import { getAllStaff, updateAccountStatus } from '../../../APIcontroller/API';
import { createStaff } from '../../../services/staff';
import { ToggleLeft, ToggleRight, FileText, UserPlus } from 'lucide-react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const StaffManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [staffData, setStaffData] = useState([]);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        fetchStaffData();
    }, [currentPage]); // Re-fetch when page changes

    const fetchStaffData = async () => {
        try {
            const data = await getAllStaff(currentPage, pageSize, user.areaId);
            setStaffData(data.staffList);
        } catch (error) {
            console.error('Error fetching staff data:', error);
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
            </div>
        </div>
    );
};

export default StaffManagement;
