import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/sideBar';
import StaffFilter from '../../components/StaffFilter/staffFilter';
import SearchBar from '../../components/SearchBar/searchBar';
import './StaffManagement.css';

const StaffManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [staffData, setStaffData] = useState([
        { id: 1, name: 'John Doe', startTime: '2023-01-01', status: 'Active', area: 'IT', performance: 'Excellent' },
        { id: 2, name: 'Jane Smith', startTime: '2023-02-01', status: 'Inactive', area: 'HR', performance: 'Good' },
        // Add more staff data as needed
    ]);

    const filteredStaff = staffData.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFilterChange = (filter) => {
      
    };  

    return (
        <div className="staff-management-container">
            <Sidebar />
            <div className="staff-table-container">
                <h1 className="page-title">Danh sách nhân viên</h1>
                <div className="filter-search-container">
                    <StaffFilter onFilterChange={handleFilterChange} />
                    <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                </div>
                <table className="staff-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên nhân viên</th>
                            <th>Thời gian bắt đầu làm</th>
                            <th>Tình trạng</th>
                            <th>Khu Vực</th>
                            <th>Hiệu Suất Công Việc</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStaff.map((staff) => (
                            <tr key={staff.id}>
                                <td>{staff.id}</td>
                                <td>{staff.name}</td>
                                <td>{staff.startTime}</td>
                                <td>{staff.status}</td>
                                <td>{staff.area}</td>
                                <td>{staff.performance}</td>
                                <td>
                                    <button onClick={() => handleAction(staff.id)}>Action</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const handleAction = (id) => {
    console.log(`Action for staff ID: ${id}`);
};

export default StaffManagement;
