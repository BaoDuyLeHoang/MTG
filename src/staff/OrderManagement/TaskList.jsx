import React, { useState, useEffect } from 'react';
import { getTasksByAccountId, updateTaskStatus } from '../../APIcontroller/API';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/auth';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TaskList.css'; // You'll need to create this CSS file
import Sidebar from '../../components/Sidebar/sideBar';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [filter, setFilter] = useState('all'); // 'all', 'completed', 'pending'
    const { user } = useAuth();

    useEffect(() => {
        fetchTasks();
    }, [user]);

    const fetchTasks = async () => {
        if (user && user.accountId && user.role === ROLES.STAFF) {
            try {
                const tasksData = await getTasksByAccountId(user.accountId);
                setTasks(tasksData);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
                // Handle the error (e.g., show an error message to the user)
            }
        } else {
            console.log('User is not logged in or is not a staff member');
            // Handle accordingly (e.g., redirect to login page)
        }
    };

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
            // Handle the error (e.g., show an error message to the user)
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 0: return 'Chờ xác nhận';
            case 1: return 'Đã giao, chờ xác nhận';
            case 2: return 'Từ chối';
            case 3: return 'Đang thực hiện';
            case 4: return 'Hoàn thành';
            case 5: return 'Thất bại';
            default: return 'Không xác định';
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'completed') return task.status === 4;
        if (filter === 'pending') return task.status === 0 || task.status === 1 || task.status === 3;
        return true;
    });

    return (
        <div className="task-list-container">
            <Sidebar />
            <div className="task-list-content">
                <div className="filter-section">
                    <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>Tất cả</button>
                    <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Đã hoàn thành</button>
                    <button onClick={() => setFilter('pending')} className={filter === 'pending' ? 'active' : ''}>Chưa hoàn thành</button>
                </div>
                <div className="date-range">
                    <span>Công việc:</span>
                    <div>
                        <span>Từ ngày:</span>
                        <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                    </div>
                    <div>
                        <span>Đến ngày:</span>
                        <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
                    </div>
                </div>
                <table className="task-table">
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
                                <td>{getStatusText(task.status)}</td>
                                <td>
                                    {task.status === 1 && (
                                        <>
                                            <button className="confirm-button" onClick={() => handleConfirm(task.taskId)}>XÁC NHẬN</button>
                                            <button className="reject-button" onClick={() => handleReject(task.taskId)}>Từ chối</button>
                                        </>
                                    )}
                                    {task.status === 3 && (
                                        <button className="complete-button" onClick={() => handleComplete(task.taskId)}>Hoàn thành</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskList;
