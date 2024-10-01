import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import './TaskList.css'; // We'll define the CSS below
import Sidebar from '../../components/Sidebar/sideBar'; // Import Sidebar

const TaskList = () => {
  const [startDate, setStartDate] = useState('21/09/2024');
  const [endDate, setEndDate] = useState('21/09/2024');
  
  const tasks = [
    {
      task: "Thay hoá ơ mỡ",
      position: "MTG-K20D16-6",
      startTime: "20/9/2024",
      endTime: "25/9/2024",
      staff: "Lý Văn B",
      status: "Đang làm"
    },
  ].concat(Array(7).fill({
    task: "Thay hoá ơ mỡ",
    position: "MTG-K20D16-6",
    startTime: "20/9/2024",
    endTime: "25/9/2024",
    staff: "Lý Văn B",
    status: "Đang làm"
  }));

  return (
    <div className="task-list-container">
      <Sidebar /> {/* Add Sidebar component here */}
      <div className="task-content"> {/* Wrap task content in a new div */}
        <h1>Danh sách công việc</h1>
        
        
    
        
        <div className="date-filter-container">
          <div className="date-inputs">
            <div className="date-input-group">
              <span>Từ ngày:</span>
              <div className="input-with-icon">
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                
              </div>
            </div>
            <div className="date-input-group">
              <span>Đến ngày:</span>
              <div className="input-with-icon">
                <input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
               
              </div>
            </div>
          </div>
          
          <button className="create-task-btn">Tạo công việc</button>
        </div>
        
        <table className="task-table">
          <thead>
            <tr>
              <th>Công việc</th>
              <th>Vị trí</th>
              <th>Thời gian bắt đầu</th>
              <th>Thời gian kết thúc</th>
              <th>Nhân viên</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td>{task.task}</td>
                <td>{task.position}</td>
                <td>{task.startTime}</td>
                <td>{task.endTime}</td>
                <td>{task.staff}</td>
                <td className="status">{task.status}</td>
                <td>
                  <button className="detail-btn">Chi tiết</button>
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