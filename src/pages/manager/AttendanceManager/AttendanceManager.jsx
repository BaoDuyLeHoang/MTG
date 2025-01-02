import React, { useState, useEffect, useMemo } from 'react';
import {
  Assignment,
  CheckCircle,
  Person
} from '@mui/icons-material';
import './AttendanceManager.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Sidebar from '../../../components/Sidebar/sideBar';
import SearchIcon from '@mui/icons-material/Search';
import { format } from 'date-fns';
import viLocale from 'date-fns/locale/vi'; // For Vietnamese localization
import { getAssignmentTasksForManager, reassignTaskToStaff } from '../../../services/assignmentTask'; // Cập nhật import
import { getTasksByManagerId } from '../../../services/task'; // Cập nhật import
import { useAuth } from "../../../context/AuthContext";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import LoadingForSideBar from '../../../components/LoadingForSideBar/LoadingForSideBar';

const AttendanceManager = () => {
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  });
  const [toDate, setToDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [taskAssignments, setTaskAssignments] = useState([]); // State to hold tasks
  const { user } = useAuth();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set the number of items per page

  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedAssignTask, setSelectedAssignTask] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [recurringTasks, setRecurringTasks] = useState([]); // State để lưu trữ công việc định kỳ
  const [activeTab, setActiveTab] = useState(0); // State để theo dõi tab hiện tại
  const [selectedStaff, setSelectedStaff] = useState(null); // State để lưu trữ nhân viên được chọn
  const [loading, setLoading] = useState(false);

  // Hàm để lấy công việc định kỳ
  const fetchRecurringTasks = async () => {
    try {
      //const fromDateFormatted = format(fromDate, 'yyyy-MM-dd');
      //const toDateFormatted = format(toDate, 'yyyy-MM-dd');
      const tasks = await getAssignmentTasksForManager(
        currentPage,
        itemsPerPage
      ); // Gọi API để lấy công việc định kỳ
      setRecurringTasks(tasks.tasks || []); // Đảm bảo rằng tasks là mảng, nếu không thì gán là mảng rỗng
    } catch (error) {
      console.error('Error fetching recurring tasks:', error);
      setRecurringTasks([]); // Đặt lại thành mảng rỗng nếu có lỗi
    }
  };

  // Hàm để xử lý giao lại công việc
  const handleReassignTask = async (taskId) => {
    try {
      // Gọi API để giao lại công việc cho nhân viên được chọn
      await reassignTaskToStaff(taskId, selectedStaff); // Giả sử bạn có hàm này
      // Cập nhật lại danh sách công việc định kỳ sau khi giao lại
      setOpenDialog(false);
      fetchRecurringTasks();
      setSelectedStaff(null); // Reset nhân viên được chọn
    } catch (error) {
      console.error('Error reassigning task:', error);
    }
  };

  // Gọi hàm fetchRecurringTasks khi component mount
  useEffect(() => {
    fetchRecurringTasks();
  }, []);

  // Fetch tasks when the component mounts or when the selected date changes
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!user?.accountId) {
          console.error('No accountId found');
          return;
        }
        
        setLoading(true);
        
        const fromDateFormatted = format(fromDate, 'yyyy-MM-dd');
        const toDateFormatted = format(toDate, 'yyyy-MM-dd');

        console.log('Fetching tasks with params:', {
          managerId: user.accountId,
          fromDate: fromDateFormatted,
          toDate: toDateFormatted,
          pageIndex: currentPage,
          pageSize: itemsPerPage
        });

        const response = await getTasksByManagerId(
          user.accountId,
          fromDateFormatted,
          toDateFormatted,
          currentPage,
          itemsPerPage
        );

        if (response && response.tasks) {
          setTaskAssignments(response.tasks);
        } else {
          setTaskAssignments([]);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTaskAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [fromDate, toDate, currentPage, user?.accountId, itemsPerPage]);

  const getStatusColor = (status) => {
    switch (status) {
      case 4:
        return 'success';
      case 3:
        return 'primary';
      case 1:
        return 'warning';
      case 2:
      case 5:
        return 'error'; // Red for rejected and failed
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 4:
        return 'Hoàn thành';
      case 3:
        return 'Đang thực hiện';
      case 1:
        return 'Chờ xử lý';
      case 5:
        return 'Thất bại';
      case 2:
        return 'Đã từ chối công việc';
      default:
        return 'Không xác định';
    }
  };

  // Filter tasks based on all criteria
  const filteredTasks = useMemo(() => {
    return taskAssignments.filter(task => {
      // Search filter - check task name, location, and assignedTo
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        task.serviceName.toLowerCase().includes(searchLower) ||
        task.graveLocation.toLowerCase().includes(searchLower) ||
        task.fullname.toLowerCase().includes(searchLower);

      // Date filter - check if task date is within range
      const taskDate = new Date(task.startDate);
      const matchesDate = taskDate >= fromDate && taskDate <= toDate;

      // Status filter
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;

      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [taskAssignments, searchQuery, fromDate, toDate, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const currentTasks = filteredTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleOpenDetails = (task) => {
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const handleOpenDetailsAssignTask = (task) => {
    setSelectedAssignTask(task);
    setOpenDialog(true);
    setSelectedStaff(null); // Reset nhân viên được chọn khi mở dialog
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  return (
    <div className="attendance-manager-wrapper">
      <Sidebar />
      <div className="attendance-manager-main">
        {loading ? (
          <LoadingForSideBar text="Đang tải danh sách công việc..." />
        ) : (
          <div className="attendance-manager-container">
            <div className="attendance-manager-header">
              <h1 className="attendance-manager-title">Công việc của nhân viên</h1>
            </div>

            <div className="attendance-manager-tabs">
              <button 
                className={`attendance-manager-tab ${activeTab === 0 ? 'active' : ''}`}
                onClick={() => setActiveTab(0)}
              >
                Công việc
              </button>
              <button 
                className={`attendance-manager-tab ${activeTab === 1 ? 'active' : ''}`}
                onClick={() => setActiveTab(1)}
              >
                Công việc định kỳ
              </button>
            </div>

            {activeTab === 0 && (
              <div className="attendance-manager-content">
                <div className="attendance-manager-filters">
                  <div className="attendance-manager-search">
                    <SearchIcon className="attendance-manager-search-icon" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên, địa điểm hoặc nhân viên..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="attendance-manager-search-input"
                    />
                  </div>

                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
                    <div className="attendance-manager-date-filters">
                      <DatePicker
                        label="Từ ngày"
                        value={fromDate}
                        onChange={(newValue) => {
                          setFromDate(newValue);
                          if (newValue > toDate) {
                            setToDate(newValue);
                          }
                        }}
                        format="dd/MM/yyyy"
                        className="attendance-manager-date-picker"
                      />
                      <DatePicker
                        label="Đến ngày"
                        value={toDate}
                        onChange={(newValue) => setToDate(newValue)}
                        minDate={fromDate}
                        format="dd/MM/yyyy"
                        className="attendance-manager-date-picker"
                      />
                    </div>
                  </LocalizationProvider>

                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="attendance-manager-status-select"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value={4}>Hoàn thành</option>
                    <option value={3}>Đang thực hiện</option>
                    <option value={1}>Chờ xử lý</option>
                    <option value={2}>Từ chối</option>
                    <option value={5}>Thất bại</option>
                  </select>
                </div>

                <div className="attendance-manager-tasks-card">
                  <div className="attendance-manager-tasks-header">
                    <span className="attendance-manager-tasks-icon">
                      <Assignment />
                    </span>
                    <h2 className="attendance-manager-tasks-title">Danh sách Công việc</h2>
                  </div>

                  <div className="attendance-manager-tasks-list">
                    {currentTasks.map((task) => (
                      <div key={task.taskId} className="attendance-manager-task-item">
                        <img 
                          src={task.serviceImage} 
                          alt={task.serviceName}
                          className="attendance-manager-task-image"
                        />
                        <div className="attendance-manager-task-content">
                          <div className="attendance-manager-task-header">
                            <h3 className="attendance-manager-task-name">{task.serviceName}</h3>
                            <span className="attendance-manager-task-category">{task.categoryName}</span>
                          </div>
                          <div className="attendance-manager-task-details">
                            <span className="attendance-manager-task-location">📍 {task.graveLocation}</span>
                            <span className="attendance-manager-task-dates">
                              📅 {format(new Date(task.startDate), 'dd/MM/yyyy')} - {format(new Date(task.endDate), 'dd/MM/yyyy')}
                            </span>
                          </div>
                          <div className="attendance-manager-task-footer">
                            <span className="attendance-manager-task-staff">
                              <Person className="attendance-manager-staff-icon" />
                              {task.fullname}
                            </span>
                            <span className={`attendance-manager-task-status status-${task.status}`}>
                              {getStatusText(task.status)}
                            </span>
                          </div>
                        </div>
                        <button 
                          className="attendance-manager-detail-btn"
                          onClick={() => handleOpenDetails(task)}
                        >
                          Chi tiết
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="attendance-manager-pagination">
                  <button 
                    className="attendance-manager-prev-btn"
                    onClick={handlePreviousPage} 
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="attendance-manager-page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button 
                    className="attendance-manager-next-btn"
                    onClick={handleNextPage} 
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="attendance-manager-content">
                <div className="attendance-manager-filters">
                  <div className="attendance-manager-search">
                    <SearchIcon className="attendance-manager-search-icon" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên, địa điểm hoặc nhân viên..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="attendance-manager-search-input"
                    />
                  </div>

                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
                    <div className="attendance-manager-date-filters">
                      <DatePicker
                        label="Từ ngày"
                        value={fromDate}
                        onChange={(newValue) => {
                          setFromDate(newValue);
                          if (newValue > toDate) {
                            setToDate(newValue);
                          }
                        }}
                        format="dd/MM/yyyy"
                        className="attendance-manager-date-picker"
                      />
                      <DatePicker
                        label="Đến ngày"
                        value={toDate}
                        onChange={(newValue) => setToDate(newValue)}
                        minDate={fromDate}
                        format="dd/MM/yyyy"
                        className="attendance-manager-date-picker"
                      />
                    </div>
                  </LocalizationProvider>

                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="attendance-manager-status-select"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value={4}>Hoàn thành</option>
                    <option value={3}>Đang thực hiện</option>
                    <option value={1}>Chờ xử lý</option>
                    <option value={2}>Từ chối</option>
                    <option value={5}>Thất bại</option>
                  </select>
                </div>

                <div className="attendance-manager-tasks-card">
                  <div className="attendance-manager-tasks-header">
                    <i className="attendance-manager-tasks-icon">📋</i>
                    <h2 className="attendance-manager-tasks-title">Danh sách công việc định kì</h2>
                  </div>

                  <div className="attendance-manager-tasks-list">
                    {recurringTasks.map((task) => (
                      <div key={task.assignmentTaskId} className="attendance-manager-task-item">
                        <img 
                          src={task.serviceImage} 
                          alt={task.serviceName}
                          className="attendance-manager-task-image"
                        />
                        <div className="attendance-manager-task-content">
                          <div className="attendance-manager-task-header">
                            <h3 className="attendance-manager-task-name">{task.serviceName}</h3>
                            <span className="attendance-manager-task-category">{task.categoryName}</span>
                          </div>
                          <div className="attendance-manager-task-details">
                            <span className="attendance-manager-task-location">📍 {task.graveLocation}</span>
                            <span className="attendance-manager-task-dates">
                              📅 {format(new Date(task.createAt), 'dd/MM/yyyy')} - {format(new Date(task.endDate), 'dd/MM/yyyy')}
                            </span>
                          </div>
                          <div className="attendance-manager-task-footer">
                            <span className="attendance-manager-task-staff">
                              <i className="attendance-manager-staff-icon">👤</i>
                              {task.staffName}
                            </span>
                            <span className={`attendance-manager-task-status status-${task.status}`}>
                              {getStatusText(task.status)}
                            </span>
                          </div>
                        </div>
                        <button 
                          className="attendance-manager-detail-btn"
                          onClick={() => handleOpenDetailsAssignTask(task)}
                        >
                          Chi tiết
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dialog component */}
      {openDialog && (selectedTask || selectedAssignTask) && (
        <div className="attendance-manager-dialog-overlay" onClick={handleCloseDialog}>
          <div className="attendance-manager-dialog" onClick={e => e.stopPropagation()}>
            <div className="attendance-manager-dialog-header">
              <h2 className="attendance-manager-dialog-title">
                Chi tiết công việc
              </h2>
              <button 
                className="attendance-manager-dialog-close"
                onClick={handleCloseDialog}
              >
                ✕
              </button>
            </div>
            
            <div className="attendance-manager-dialog-content">
              {selectedTask ? (
                <>
                  <div className="attendance-manager-dialog-section">
                    <h3>Thông tin công việc</h3>
                    <p><strong>Tên dịch vụ:</strong> {selectedTask.serviceName}</p>
                    <p><strong>Vị trí:</strong> {selectedTask.graveLocation}</p>
                    <p><strong>Thời gian:</strong> {format(new Date(selectedTask.startDate), 'dd/MM/yyyy')} - {format(new Date(selectedTask.endDate), 'dd/MM/yyyy')}</p>
                    <p><strong>Trạng thái:</strong> <span className={`attendance-manager-task-status status-${selectedTask.status}`}>{getStatusText(selectedTask.status)}</span></p>
                  </div>

                  {selectedTask.images && selectedTask.images.length > 0 && (
                    <div className="attendance-manager-dialog-section">
                      <h3>Hình ảnh</h3>
                      <div className="attendance-manager-dialog-images">
                        {selectedTask.images.map((image, index) => (
                          <img 
                            key={index}
                            src={image}
                            alt={`Task image ${index + 1}`}
                            className="attendance-manager-dialog-image"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : selectedAssignTask && (
                <>
                  <div className="attendance-manager-dialog-section">
                    <h3>Thông tin công việc định kỳ</h3>
                    <p><strong>Tên dịch vụ:</strong> {selectedAssignTask.serviceName}</p>
                    <p><strong>Vị trí:</strong> {selectedAssignTask.graveLocation}</p>
                    <p><strong>Thời gian:</strong> {format(new Date(selectedAssignTask.createAt), 'dd/MM/yyyy')} - {format(new Date(selectedAssignTask.endDate), 'dd/MM/yyyy')}</p>
                    <p><strong>Trạng thái:</strong> <span className={`attendance-manager-task-status status-${selectedAssignTask.status}`}>{getStatusText(selectedAssignTask.status)}</span></p>
                  </div>

                  {selectedAssignTask.images && selectedAssignTask.images.length > 0 && (
                    <div className="attendance-manager-dialog-section">
                      <h3>Hình ảnh</h3>
                      <div className="attendance-manager-dialog-images">
                        {selectedAssignTask.images.map((image, index) => (
                          <img 
                            key={index}
                            src={image}
                            alt={`Task image ${index + 1}`}
                            className="attendance-manager-dialog-image"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="attendance-manager-dialog-actions">
              <button 
                className="attendance-manager-dialog-button"
                onClick={handleCloseDialog}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManager;