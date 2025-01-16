import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/sideBar';
import { useAuth } from "../../../context/AuthContext";
import './accountManagement.css';
import { getAllManagers} from '../../../services/admin';
import { updateAccountStatus } from '../../../APIcontroller/API';
import { fetchAreas } from '../../../services/area'; // Import fetchAreas from area.js
import { createStaff } from '../../../services/staff';
import { jwtDecode } from "jwt-decode";

import { ToggleLeft, ToggleRight, FileText, UserPlus } from 'lucide-react';
// src/pages/admin/accountManagement/mockData.js

const ManagerManagement = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [managerData, setManagerData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [selectedArea, setSelectedArea] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [newManager, setNewManager] = useState({
        fullName: '',
        emailAddress: '',
        phoneNumber: '',
        areaId: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        roleId: 2
    });
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        fetchManagerData();
        fetchAreasData();
    }, [currentPage]); // Re-fetch when page changes

    const fetchManagerData = async () => {
        try {
            const data = await getAllManagers(currentPage, pageSize); // API call to fetch managers
            setManagerData(data.managerList); // Update state with fetched data
        } catch (error) {
            console.error('Error fetching manager data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAreasData = async () => {
        try {
            const data = await fetchAreas();
            setAreas(data);
        } catch (error) {
            console.error('Error fetching areas:', error);
        }
    };

    const handleFilterChange = (areaId) => {
        setSelectedArea(areaId);
    };

    const filteredManagers = managerData.filter(manager => {
        const matchesSearch = manager.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesArea = selectedArea === 'all' || manager.areaId === selectedArea;
        return matchesSearch && matchesArea;
    });

    const handleAction = async (banAccountId) => {
        try {
            // Lấy accountId từ token hoặc context/redux store
            const token = localStorage.getItem('accessToken');
            const decodedToken = jwtDecode(token);
            const accountId = decodedToken.accountId;

            // Gọi API với banAccountId (account bị chặn) và accountId (người thực hiện)
            await updateAccountStatus(banAccountId, accountId);
            
            // Sau khi update thành công, fetch lại data mới
            await fetchManagerData();
        } catch (error) {
            console.error('Error updating status:', error);
            // Thêm thông báo lỗi cho người dùng
            alert('Không thể cập nhật trạng thái tài khoản. Vui lòng thử lại!');
        }
    };

    const handleCreateManager = async (e) => {
        e.preventDefault();
        try {
            await createStaff(newManager, user.accountId);
            setShowModal(false);
            fetchManagerData();
            setNewManager({
                fullName: '',
                emailAddress: '',
                phoneNumber: '',
                areaId: '',
                password: '',
                confirmPassword: '',
                dateOfBirth: '',
                roleId: 2
            });
        } catch (error) {
            console.error('Error creating manager:', error);
            alert('Failed to create manager. Please check your input and try again.');
        }
    };

    return (
        <div className="manager-management-container">
            <Sidebar />
            <div className="manager-management-content">
                <h1>Quản Lý Nhân Sự</h1>
                <button className="create-manager-btn" onClick={() => setShowModal(true)}>
                    <UserPlus size={20} />
                    Thêm Quản Lý
                </button>
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Thêm Quản Lý Mới</h2>
                            <form onSubmit={handleCreateManager}>
                                <div className="form-group">
                                    <label>Họ và tên <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={newManager.fullName}
                                        onChange={(e) => setNewManager({ ...newManager, fullName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email <span className="required">*</span></label>
                                    <input
                                        type="email"
                                        required
                                        value={newManager.emailAddress}
                                        onChange={(e) => setNewManager({ ...newManager, emailAddress: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Số điện thoại <span className="required">*</span></label>
                                    <input
                                        type="tel"
                                        required
                                        value={newManager.phoneNumber}
                                        onChange={(e) => setNewManager({ ...newManager, phoneNumber: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Khu vực <span className="required">*</span></label>
                                    <select
                                        required
                                        value={newManager.areaId}
                                        onChange={(e) => setNewManager({ ...newManager, areaId: e.target.value })}
                                    >
                                        <option value="">Chọn khu vực</option>
                                        {areas.map(area => (
                                            <option key={area.areaId} value={area.areaId}>
                                                {area.areaName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Ngày tháng năm sinh <span className="required">*</span></label>
                                    <input
                                        type="date"
                                        required
                                        value={newManager.dateOfBirth}
                                        onChange={(e) => setNewManager({ ...newManager, dateOfBirth: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mật khẩu <span className="required">*</span></label>
                                    <input
                                        type="password"
                                        required
                                        value={newManager.password}
                                        onChange={(e) => setNewManager({ ...newManager, password: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Xác nhận mật khẩu <span className="required">*</span></label>
                                    <input
                                        type="password"
                                        required
                                        value={newManager.confirmPassword}
                                        onChange={(e) => setNewManager({ ...newManager, confirmPassword: e.target.value })}
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
                        <table className="manager-table">
                            <thead>
                                <tr>
                                    
                                    <th>Tên quản lý</th>
                                    <th>Khu vực</th>
                                    <th>Thời gian tạo</th>
                                    <th>Tình trạng</th>
                                    <th>Email</th>
                                    <th>Số điện thoại</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredManagers.map((manager) => (
                                    <tr key={manager.accountId}>
                                        
                                        <td>{manager.fullName}</td>
                                        <td>{manager.areaId}</td>
                                        <td>{new Date(manager.createAt).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit'
                                        })}</td>
                                        <td>
                                            <span className={`status ${manager.status ? 'status-green' : 'status-red'}`}>
                                                {manager.status ? 'Hoạt động' : 'Không hoạt động'}
                                            </span>
                                        </td>
                                        <td>{manager.emailAddress}</td>
                                        <td>{manager.phoneNumber}</td>
                                        <td>
                                            <button 
                                                className="icon-button"
                                                onClick={() => handleAction(manager.accountId)}
                                                title={manager.status ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                            >
                                                {manager.status ? (
                                                    <ToggleRight className="toggle-active" size={28} />
                                                ) : (
                                                    <ToggleLeft className="toggle-inactive" size={28} />
                                                )}
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

export default ManagerManagement;
