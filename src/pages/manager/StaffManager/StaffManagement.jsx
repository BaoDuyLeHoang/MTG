import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/sideBar';
import { useAuth } from "../../../context/AuthContext";
import './StaffManagement.css';
import { getAllStaff, updateAccountStatus } from '../../../APIcontroller/API';
import { createStaff } from '../../../services/staff';
import { ToggleLeft, ToggleRight, FileText, UserPlus } from 'lucide-react';
import axios from 'axios';

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
    const handleAction = async (id, currentStatus) => {
        try {
            await updateAccountStatus(id);
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
                                <input
                                    type="text"
                                    placeholder="Số điện thoại"
                                    value={newStaff.phoneNumber}
                                    onChange={(e) => setNewStaff({ ...newStaff, phoneNumber: e.target.value })}
                                />
                                <input
                                    type="password"
                                    placeholder="Mật khẩu"
                                    value={newStaff.password}
                                    onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                                />
                                <input
                                    type="password"
                                    placeholder="Xác nhận mật khẩu"
                                    value={newStaff.confirmPassword}
                                    onChange={(e) => setNewStaff({ ...newStaff, confirmPassword: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Họ và tên"
                                    value={newStaff.fullName}
                                    onChange={(e) => setNewStaff({ ...newStaff, fullName: e.target.value })}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newStaff.emailAddress}
                                    onChange={(e) => setNewStaff({ ...newStaff, emailAddress: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Địa chỉ"
                                    value={newStaff.address}
                                    onChange={(e) => setNewStaff({ ...newStaff, address: e.target.value })}
                                />
                                <input
                                    type="date"
                                    value={newStaff.dateOfBirth}
                                    onChange={(e) => setNewStaff({ ...newStaff, dateOfBirth: e.target.value })}
                                />
                                <div className="modal-buttons">
                                    <button type="submit" onClick={handleCreateStaff}>Tạo</button>
                                    <button type="button" onClick={() => setShowModal(false)}>Hủy</button>
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
                                    <th>ID</th>
                                    <th>Tên nhân viên</th>
                                    <th>Thời gian bắt đầu làm</th>
                                    <th>Tình trạng</th>
                                    <th>Khu Vực</th>
                                    <th>Email</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStaff.map((staff) => (
                                    <tr key={staff.accountId}>
                                        <td>#{staff.accountId}</td>
                                        <td>{staff.fullName}</td>
                                        <td>{new Date(staff.createAt).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit'
                                        })}</td>
                                        <td>
                                            <span className={`status ${staff.status ? 'status-green' : 'status-red'}`}>
                                                {staff.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>{staff.areaId}</td>
                                        <td>{staff.emailAddress}</td>
                                        <td>
                                            <button
                                                className="icon-button"
                                                onClick={() => handleAction(staff.accountId, staff.status)}
                                                title={staff.status ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                            >
                                                {staff.status ? (
                                                    <ToggleRight className="toggle-active" size={28} />
                                                ) : (
                                                    <ToggleLeft className="toggle-inactive" size={28} />
                                                )}
                                            </button>
                                            <button
                                                className="clipboard-pen"
                                                onClick={() => handleCreateReport(staff.accountId)}
                                                title="Tạo báo cáo"
                                            >
                                                <FileText size={28} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffManagement;
