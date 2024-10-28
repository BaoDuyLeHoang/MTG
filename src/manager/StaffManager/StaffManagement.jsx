import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/sideBar';
import StaffFilter from '../../components/StaffFilter/staffFilter';
import SearchBar from '../../components/SearchBar/searchBar';
import './StaffManagement.css';
import { getAllStaff, updateAccountStatus } from '../../APIcontroller/API';

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

    return (
        <div className="staff-management-container">
            <Sidebar />
            <div className="staff-table-container">
                <h1 className="page-title">Danh sách nhân viên</h1>
                <div className="filter-search-container">
                    <StaffFilter 
                        onFilterChange={handleFilterChange} 
                        staffData={staffData} // Pass the staff data to the filter
                    />
                    <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                </div>
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <table className="staff-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên nhân viên</th>
                                <th>Thời gian bắt đầu làm</th>
                                <th>Tình trạng</th>
                                <th>Khu Vực</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStaff.map((staff) => (
                                <tr key={staff.accountId}>
                                    <td>{staff.accountId}</td>
                                    <td>{staff.fullName}</td>
                                    <td>{new Date(staff.createAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge ${staff.status ? 'active' : 'inactive'}`}>
                                            {staff.status ? 'Hoạt động' : 'Không hoạt động'}
                                        </span>
                                    </td>
                                    <td>{staff.areaId}</td>
                                    <td>{staff.email}</td>
                                    <td>
                                        <button 
                                            className={`status-action-btn ${staff.status ? 'deactivate' : 'activate'}`}
                                            onClick={() => handleAction(staff.accountId, staff.status)}
                                        >
                                            {staff.status ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default StaffManagement;
