import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/sideBar';

import './accountManagement.css';
import { getAllManagers} from '../../../services/admin';
import { updateAccountStatus } from '../../../APIcontroller/API';

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

    const handleAction = async (id, currentStatus) => {
      try {
          await updateAccountStatus(id);
          // Refresh the staff list after successful update
          fetchManagerData();
      } catch (error) {
          console.error('Error updating status:', error);
          // You might want to add some error handling UI here
      }
  };

    const handleCreateReport = (managerId) => {
        console.log(`Creating report for manager ID: ${managerId}`);
    };

    return (
        <div className="manager-management-container">
            <Sidebar />
            <div className="manager-management-content">
                <h1>Quản Lý Quản</h1>
                
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
                                    <th>ID</th>
                                    <th>Tên quản lý</th>
                                    <th>Thời gian tạo</th>
                                    <th>Tình trạng</th>
                                    <th>Email</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredManagers.map((manager) => (
                                    <tr key={manager.accountId}>
                                        <td>#{manager.accountId}</td>
                                        <td>{manager.fullName}</td>
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
                                        <td>{manager.email}</td>
                                        <td>
                                            <button 
                                                className="icon-button"
                                                onClick={() => handleAction(manager.accountId, manager.status)}
                                                title={manager.status ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                            >
                                                {manager.status ? (
                                                    <ToggleRight className="toggle-active" size={28} />
                                                ) : (
                                                    <ToggleLeft className="toggle-inactive" size={28} />
                                                )}
                                            </button>
                                            <button 
                                                className="clipboard-pen"
                                                onClick={() => handleCreateReport(manager.managerId)}
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

export default ManagerManagement;
