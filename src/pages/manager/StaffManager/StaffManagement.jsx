import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/sideBar';

import './StaffManagement.css';
import { getAllStaff, updateAccountStatus } from '../../../APIcontroller/API';
import { ToggleLeft, ToggleRight, FileText } from 'lucide-react';

const StaffManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [staffData, setStaffData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [selectedArea, setSelectedArea] = useState('all');

    useEffect(() => {
        fetchStaffData();
    }, [currentPage]); // Re-fetch when page changes

    const fetchStaffData = async () => {
        try {
            const data = await getAllStaff(currentPage, pageSize);
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

    return (
        <div className="staff-management-container">
            <Sidebar />
            <div className="staff-management-content">
                <h1>Quản Lý Nhân Viên</h1>
                
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
                                                {staff.status ? 'Hoạt động' : 'Không hoạt động'}
                                            </span>
                                        </td>
                                        <td>{staff.areaId}</td>
                                        <td>{staff.email}</td>
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
