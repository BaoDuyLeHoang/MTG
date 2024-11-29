import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/sideBar';

import './accountManagement.css';
import { getAllManagers} from '../../../services/admin';
import { updateAccountStatus } from '../../../APIcontroller/API';
import { jwtDecode } from "jwt-decode";

import { ToggleLeft, ToggleRight, FileText } from 'lucide-react';
// src/pages/admin/accountManagement/mockData.js

const ManagerManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [managerData, setManagerData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [selectedArea, setSelectedArea] = useState('all');

    useEffect(() => {
        fetchManagerData();
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

    const handleCreateReport = (managerId) => {
        console.log(`Creating report for manager ID: ${managerId}`);
    };

    return (
        <div className="manager-management-container">
            <Sidebar />
            <div className="manager-management-content">
                <h1>Quản Lý Nhân Sự</h1>
                
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
