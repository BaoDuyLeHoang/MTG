import React, { useState } from 'react';
import Sidebar from "../../components/Sidebar/sideBar";
import './AddTask.css';
import DateFilter from '../../components/DateFilter/dateFilter';

export default function AddTask() {
    const handleDateFilterChange = (startDate, endDate) => {
        console.log('Start Date:', startDate);
        console.log('End Date:', endDate);
    };
    const [task, setTask] = useState({
        name: '',
        description: '',
        location: '',
        staffName: ''
    });

    // Example staff list - replace with your actual data
    const staffList = [
        { id: 1, name: 'Nguyễn Văn A' },
        { id: 2, name: 'Trần Thị B' },
        { id: 3, name: 'Lê Văn C' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTask(prevTask => ({
            ...prevTask,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Công việc mới:', task);
        // Here you would typically send the data to your backend
    };

    return (
        <div className="add-task">
            <Sidebar />
            <div className="add-task-list">
                <div className="header">
                    <h1>BẢNG TẠO CÔNG VIỆC</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="task-fillers">
                        <div className="task-fillers-item1">
                        <p><b>Tên công việc:</b> 
                            <input type="text" name="name" value={task.name} onChange={handleInputChange} required />
                        </p>
                        <p><b>Mô tả công việc:</b> 
                            <textarea name="description" value={task.description} onChange={handleInputChange} required />
                        </p>
                        </div>
                        <div className="task-fillers-item2">
                        <p><b>Vị trí thực hiện:</b> 
                            <input type="text" name="location" value={task.location} onChange={handleInputChange} required />
                        </p>
                        <p><b>Tên nhân viên:</b> 
                            <select name="staffName" value={task.staffName} onChange={handleInputChange} required>
                                <option value="">Chọn nhân viên</option>
                                {staffList.map(staff => (
                                    <option key={staff.id} value={staff.name}>{staff.name}</option>
                                ))}
                            </select>
                        </p>
                        <DateFilter onFilterChange={handleDateFilterChange} className="date-filter" />
                        </div>
                        
                    </div>
                    <button id="create-task-btn" type="submit">Tạo</button>
                </form>
            </div>
        </div>
    );
}