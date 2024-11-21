import React, { useState, useEffect } from 'react';
import { updateTaskStatus } from '../../../APIcontroller/API';
import { getTasksByAccountId } from '../../../services/task';
import { useAuth } from '../../../context/AuthContext';
import { ROLES } from '../../../utils/auth';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TaskList.css'; // You'll need to create this CSS file
import Sidebar from '../../../components/Sidebar/sideBar';
import { useNavigate } from 'react-router-dom';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [filter, setFilter] = useState('all'); // 'all', 'completed', 'pending'
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.accountId) {
            fetchTasks();
        }
    }, [user?.accountId, startDate, endDate, filter]);
    

    const fetchTasks = async () => {
        if (user && user.accountId && user.role === ROLES.STAFF) {
            try {
                const response = await getTasksByAccountId(user.accountId);
                const transformed = response.data.map(tasks => ({
                    id: tasks.taskId,
                    title: tasks.blogName,
                    excerpt: tasks.blogDescription,
                    createdAt: tasks.createDate,
                    status: tasks.status ? 'published' : 'hidden',
                    author: tasks.fullName,
                    category: tasks.historyEventName,
                    image: tasks.historicalImages?.[0] || null
                  }));
                setTasks(transformed);
            
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        } else {
            console.log('User is not logged in or is not a staff member');
        }
    };
    const filteredTasks =  tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'completed') return task.status === 4;
        if (filter === 'pending') return [0, 1, 3].includes(task.status);

        return true;
    });
    

    const handleConfirm = async (taskId) => {
        try {
            await updateTaskStatus(taskId, 3); // 3 is the status for "Đang thực hiện"
            // Refresh the task list
            fetchTasks();
        } catch (error) {
            console.error('Failed to confirm task:', error);
            // Handle the error (e.g., show an error message to the user)
        }
    };

    const handleReject = async (taskId) => {
        try {
            await updateTaskStatus(taskId, 2); // 2 is the status for "Từ chối"
            // Refresh the task list
            fetchTasks();
        } catch (error) {
            console.error('Failed to reject task:', error);
            // Handle the error (e.g., show an error message to the user)
        }
    };

    const handleComplete = async (taskId) => {
        try {
            await updateTaskStatus(taskId, 4); // 4 is the status for "Hoàn thành"
            // Refresh the task list
            fetchTasks();
        } catch (error) {
            console.error('Failed to complete task:', error);
            // Handle the error (e.g., show an error message to the usser)
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 0: return { text: 'Chờ xác nhận', color: '#f39c12' }; // Orange
            case 1: return { text: 'Đã giao, chờ xác nhận', color: '#3498db' }; // Blue
            case 2: return { text: 'Từ chối', color: '#e74c3c' }; // Red
            case 3: return { text: 'Đang thực hiện', color: '#2ecc71' }; // Green
            case 4: return { text: 'Hoàn thành', color: '#27ae60' }; // Dark Green
            case 5: return { text: 'Thất bại', color: '#c0392b' }; // Dark Red
            default: return { text: 'Không xác định', color: '#95a5a6' }; // Gray
        }
    };

    

    const handleViewDetails = (taskId) => {
        navigate(`/task-detail/${taskId}`);
    };

    const handleDateChange = (date, setDate) => {
        if (date instanceof Date && !isNaN(date)) {
            setDate(date);
        } else {
            console.error('Invalid date selected');
        }
    };

    return (
        <div className="staff-task-list-container">
            <Sidebar />
            <div className="staff-task-list-content">
                <h1 className="staff-task-list-page-title">Quản Lý Công Việc</h1>
                <div className="staff-task-list-filter-section">
                    <button onClick={() => setFilter('all')} className={`staff-task-list-filter-btn ${filter === 'all' ? 'active' : ''}`}>Tất cả</button>
                    <button onClick={() => setFilter('completed')} className={`staff-task-list-filter-btn ${filter === 'completed' ? 'active' : ''}`}>Đã hoàn thành</button>
                    <button onClick={() => setFilter('pending')} className={`staff-task-list-filter-btn ${filter === 'pending' ? 'active' : ''}`}>Chưa hoàn thành</button>
                </div>
                <div className="staff-task-list-date-range">
                    <span>Công việc:</span>
                    <div className="staff-task-list-date-picker">
                        <span>Từ ngày:</span>
                        <DatePicker 
                            selected={startDate} 
                            onChange={date => handleDateChange(date, setStartDate)}
                            maxDate={endDate}
                        />
                    </div>
                    <div className="staff-task-list-date-picker">
                        <span>Đến ngày:</span>
                        <DatePicker 
                            selected={endDate} 
                            onChange={date => handleDateChange(date, setEndDate)}
                            minDate={startDate}
                        />
                    </div>
                </div>
                <table className="staff-task-list-table">
                    <thead>
                        <tr>
                            <th>Công việc</th>
                            <th>Vị trí</th>
                            <th>Thời gian</th>
                            <th>Thời hạn</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {filteredTasks.map(task => (
                            <tr key={task.taskId}>
                                <td>{task.serviceName || task.description || 'Không có mô tả'}</td>
                                <td>{task.graveLocation || `MTG-K${task.orderId}D${task.detailId}`}</td>
                                <td>{new Date(task.startDate).toLocaleDateString()}</td>
                                <td>{new Date(task.endDate).toLocaleDateString()}</td>
                                <td>
                                    <span className="status-badge" style={{
                                        backgroundColor: getStatusText(task.status).color,
                                        color: 'white',
                                        padding: '6px 12px',
                                        borderRadius: '12px',
                                        fontSize: '0.9em',
                                        fontWeight: '500'
                                    }}>
                                        {getStatusText(task.status).text}
                                    </span>
                                </td>
                                <td>
                                    <button className="staff-task-list-detail-button" onClick={() => handleViewDetails(task.taskId)}>
                                        Chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredTasks.length === 0 ? (
                    tasks.length === 0 ? (
                        <p>No tasks available.</p>
                    ) : (
                            <p>No tasks match the selected filter.</p>
                     )
                ) : (
                    <p>Number of tasks: {filteredTasks.length}</p>
                )}

            </div>
        </div>
    );
};

export default TaskList;
