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
import { getTasksByManagerId, reassignTask } from '../../../services/task'; // Cập nhật import
import { useAuth } from "../../../context/AuthContext";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import LoadingForSideBar from '../../../components/LoadingForSideBar/LoadingForSideBar';
import { getRequestTasksByManagerId, reassignRequestTask } from '../../../services/requestTask'; // Import hàm mới

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

  // Thêm state cho phân trang công việc định kỳ
  const [currentRecurringPage, setCurrentRecurringPage] = useState(1);
  const recurringItemsPerPage = 5; // Số lượng công việc định kỳ trên mỗi trang

  const [totalRecurringPages, setTotalRecurringPages] = useState(1); // State để lưu tổng số trang cho công việc định kỳ

  const [requestTasks, setRequestTasks] = useState([]); // State để lưu trữ công việc theo yêu cầu
  const [currentRequestPage, setCurrentRequestPage] = useState(1); // State cho phân trang công việc theo yêu cầu
  const [totalRequestPages, setTotalRequestPages] = useState(1); // State để lưu tổng số trang cho công việc theo yêu cầu

  const [selectedRequestTask, setSelectedRequestTask] = useState(null); // State để lưu công việc yêu cầu được chọn
  const [selectedStaffForRequest, setSelectedStaffForRequest] = useState(''); // State để lưu nhân viên được chọn cho công việc yêu cầu
  const [openReassignDialog, setOpenReassignDialog] = useState(false); // State để mở dialog giao lại

  const [errorMessage, setErrorMessage] = useState(''); // State để lưu thông báo lỗi

  // Hàm để lấy công việc định kỳ
  const fetchRecurringTasks = async () => {
    try {
      const tasks = await getAssignmentTasksForManager(
        currentRecurringPage,
        recurringItemsPerPage
      ); // Gọi API để lấy công việc định kỳ
      setRecurringTasks(tasks.tasks || []); // Đảm bảo rằng tasks là mảng, nếu không thì gán là mảng rỗng
      setTotalRecurringPages(tasks.totalPage || 1); // Cập nhật tổng số trang từ phản hồi API
    } catch (error) {
      console.error('Error fetching recurring tasks:', error);
      setRecurringTasks([]); // Đặt lại thành mảng rỗng nếu có lỗi
    }
  };

  // Tách hàm fetchTasks ra ngoài useEffect để có thể gọi lại
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

  // Gọi hàm fetchTasks khi component mount hoặc khi các giá trị thay đổi
  useEffect(() => {
    fetchTasks();
  }, [fromDate, toDate, currentPage, user?.accountId, itemsPerPage]);

  // Cập nhật hàm để xử lý giao lại công việc
  const handleReassignTask = async (taskId, isRecurring = false) => {
    try {
      if (isRecurring) {
        // Gọi API để giao lại công việc định kỳ cho nhân viên được chọn
        await reassignTaskToStaff(taskId, selectedStaff); // Sử dụng hàm reassignTaskToStaff từ assignmentTask.js
        fetchRecurringTasks(); // Gọi hàm fetchRecurringTasks để làm mới danh sách công việc định kỳ
      } else {
        // Gọi API để giao lại công việc thông thường cho nhân viên được chọn
        await reassignTask(taskId, selectedStaff); // Sử dụng hàm reassignTask từ task.js
        fetchTasks(); // Gọi hàm fetchTasks để làm mới danh sách công việc
      }
      setOpenDialog(false); // Đóng dialog
      setSelectedStaff(null); // Reset nhân viên được chọn
    } catch (error) {
      console.error('Error reassigning task:', error);
    }
  };

  // Gọi hàm fetchRecurringTasks khi component mount
  useEffect(() => {
    fetchRecurringTasks();
  }, []);

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
    setSelectedStaff(null); // Reset nhân viên được chọn khi mở dialog
  }

  const handleOpenDetailsAssignTask = (task) => {
    setSelectedAssignTask(task);
    setOpenDialog(true);
    setSelectedStaff(null); // Reset nhân viên được chọn khi mở dialog
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  // Filter tasks based on all criteria for recurring tasks
  const filteredRecurringTasks = useMemo(() => {
    return recurringTasks.filter(task => {
      // Search filter - check task name, location, and assignedTo
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        task.serviceName.toLowerCase().includes(searchLower) ||
        task.graveLocation.toLowerCase().includes(searchLower) ||
        task.staffName.toLowerCase().includes(searchLower); // Assuming staffName is available

      // Status filter
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [recurringTasks, searchQuery, statusFilter]);

  // Logic phân trang cho công việc định kỳ
  const totalFilteredRecurringPages = Math.ceil(filteredRecurringTasks.length / recurringItemsPerPage);
  const currentFilteredRecurringTasks = filteredRecurringTasks.slice((currentRecurringPage - 1) * recurringItemsPerPage, currentRecurringPage * recurringItemsPerPage);

  // Hàm để xử lý chuyển trang cho công việc định kỳ
  const handleNextRecurringPage = () => {
    if (currentRecurringPage < totalRecurringPages) {
      setCurrentRecurringPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousRecurringPage = () => {
    if (currentRecurringPage > 1) {
      setCurrentRecurringPage(prevPage => prevPage - 1);
    }
  };

  // Hàm để lấy công việc theo yêu cầu
  const fetchRequestTasks = async () => {
    try {
      const tasks = await getRequestTasksByManagerId(2, currentRequestPage); // Gọi API với managerId là 2
      setRequestTasks(tasks.tasks || []); // Đảm bảo rằng tasks là mảng
      setTotalRequestPages(tasks.totalPage || 1); // Cập nhật tổng số trang từ phản hồi API
    } catch (error) {
      console.error('Error fetching request tasks:', error);
      setRequestTasks([]); // Đặt lại thành mảng rỗng nếu có lỗi
    }
  };

  // Gọi hàm fetchRequestTasks khi component mount hoặc khi currentRequestPage thay đổi
  useEffect(() => {
    if (activeTab === 2) { // Chỉ gọi khi tab "Công việc theo yêu cầu" được chọn
      fetchRequestTasks();
    }
  }, [currentRequestPage, activeTab]);

  // Logic phân trang cho công việc theo yêu cầu
  const currentRequestTasks = requestTasks.slice((currentRequestPage - 1) * 5, currentRequestPage * 5); // Giả sử mỗi trang có 5 công việc

  const handleOpenReassignDialog = (task) => {
    setSelectedRequestTask(task);
    setOpenReassignDialog(true);
    setSelectedStaffForRequest(''); // Reset nhân viên được chọn khi mở dialog
  };

  const handleReassignRequestTask = async () => {
    if (!selectedRequestTask || !selectedStaffForRequest) {
      console.error('No task or staff selected'); // Thông báo lỗi nếu không có công việc hoặc nhân viên được chọn
      return; 
    }

    const { requestTaskId, staffId } = selectedRequestTask; // Lấy requestTaskId và staffId từ selectedRequestTask
    if (!requestTaskId) {
      console.error('Request Task ID is undefined'); // Thông báo lỗi nếu requestTaskId là undefined
      return;
    }

    if (parseInt(staffId) === parseInt(selectedStaffForRequest)) {
      setErrorMessage('Nhân viên mới được giao phải khác với người nhân viên cũ.'); // Thông báo lỗi nếu nhân viên mới giống nhân viên cũ
      return;
    }

    try {
      await reassignRequestTask(requestTaskId, selectedStaffForRequest); // Gọi API để giao lại công việc
      fetchRequestTasks(); // Gọi lại hàm fetchRequestTasks để cập nhật danh sách công việc
      setOpenReassignDialog(false); // Đóng dialog
      setSelectedRequestTask(null); // Reset công việc được chọn
      setSelectedStaffForRequest(''); // Reset nhân viên được chọn
      setErrorMessage(''); // Reset thông báo lỗi nếu giao lại thành công
    } catch (error) {
      console.error('Error reassigning request task:', error);
      setErrorMessage(error.response ? error.response.data.message : 'Đã xảy ra lỗi khi giao lại công việc.'); // Lưu thông báo lỗi vào state
    }
  };

  return (
    <div className="attendance-manager-wrapper">
      <Sidebar />
      <div className="attendance-manager-main">
        {errorMessage && ( // Hiển thị thông báo lỗi nếu có
          <div className="error-message">
            {errorMessage}
          </div>
        )}
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
          <button 
            className={`attendance-manager-tab ${activeTab === 2 ? 'active' : ''}`}
            onClick={() => setActiveTab(2)}
          >
            Công việc theo yêu cầu
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
                <h2 className="attendance-manager-tasks-title">Danh sách công việc định kỳ</h2>
              </div>

              <div className="attendance-manager-tasks-list">
                {currentFilteredRecurringTasks.map((task) => (
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

            <div className="attendance-manager-pagination">
              <button
                className="attendance-manager-prev-btn"
                onClick={handlePreviousRecurringPage}
                disabled={currentRecurringPage === 1}
              >
                Previous
              </button>
              <span className="attendance-manager-page-info">
                Page {currentRecurringPage} of {totalFilteredRecurringPages}
              </span>
              <button
                className="attendance-manager-next-btn"
                onClick={handleNextRecurringPage}
                disabled={currentRecurringPage === totalFilteredRecurringPages}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div className="attendance-manager-content">
            <div className="attendance-manager-tasks-card">
              <div className="attendance-manager-tasks-header">
                <i className="attendance-manager-tasks-icon">📋</i>
                <h2 className="attendance-manager-tasks-title">Danh sách công việc theo yêu cầu</h2>
              </div>

              <div className="attendance-manager-tasks-list">
                {currentRequestTasks.map((task) => (
                  <div key={task.requestTaskId} className="attendance-manager-task-item">
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
                          <i className="attendance-manager-staff-icon">👤</i>
                          {task.fullname}
                        </span>
                        <span className={`attendance-manager-task-status status-${task.status}`}>
                          {getStatusText(task.status)}
                        </span>
                      </div>
                    </div>
                    {task.status === 2 ? (
                      <button 
                        className="attendance-manager-detail-btn"
                        onClick={() => handleOpenReassignDialog(task)}
                      >
                        Giao lại
                      </button>
                    ) : (
                      <button 
                        className="attendance-manager-detail-btn"
                        onClick={() => handleOpenDetailsAssignTask(task)}
                      >
                        Chi tiết
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="attendance-manager-pagination">
              <button 
                className="attendance-manager-prev-btn"
                onClick={() => setCurrentRequestPage(prev => Math.max(prev - 1, 1))}
                disabled={currentRequestPage === 1}
              >
                Previous
              </button>
              <span className="attendance-manager-page-info">
                Page {currentRequestPage} of {totalRequestPages}
              </span>
              <button 
                className="attendance-manager-next-btn"
                onClick={() => setCurrentRequestPage(prev => Math.min(prev + 1, totalRequestPages))}
                disabled={currentRequestPage === totalRequestPages}
              >
                Next
              </button>
            </div>
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
                    {selectedTask.status === 2 && selectedTask.reason && (
                      <p><strong>Lý do từ chối:</strong> {selectedTask.reason}</p>
                    )}
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

                  {selectedTask.status === 2 && selectedTask.staffs.length > 0 && (
                    <div className="attendance-manager-dialog-section">
                      <h3>Chọn nhân viên bàn giao</h3>
                      <select
                        value={selectedStaff}
                        onChange={(e) => setSelectedStaff(e.target.value)}
                        className="attendance-manager-staff-select"
                      >
                        <option value="">Chọn nhân viên</option>
                        {selectedTask.staffs.map(staff => (
                          <option key={staff.accountId} value={staff.accountId}>
                            {staff.staffFullName}
                          </option>
                        ))}
                      </select>
                      <button
                        className="attendance-manager-dialog-button"
                        onClick={() => handleReassignTask(selectedTask.taskId)}
                      >
                        Bàn giao
                      </button>
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
                    {selectedAssignTask.status === 2 && selectedAssignTask.reason && (
                      <p><strong>Lý do từ chối:</strong> {selectedAssignTask.reason}</p>
                    )}
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

                  {selectedAssignTask.staffs.length > 0 && (
                    <div className="attendance-manager-dialog-section">
                      <h3>Chọn nhân viên bàn giao</h3>
                      <select
                        value={selectedStaff}
                        onChange={(e) => setSelectedStaff(e.target.value)}
                        className="attendance-manager-staff-select"
                      >
                        <option value="">Chọn nhân viên</option>
                        {selectedAssignTask.staffs.map(staff => (
                          <option key={staff.accountId} value={staff.accountId}>
                            {staff.staffFullName}
                          </option>
                        ))}
                      </select>
                      <button
                        className="attendance-manager-dialog-button"
                        onClick={() => handleReassignTask(selectedAssignTask.assignmentTaskId, true)}
                      >
                        Bàn giao
                      </button>
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

      {/* Dialog giao lại công việc */}
      {openReassignDialog && selectedRequestTask && (
        <div className="attendance-manager-dialog-overlay" onClick={() => setOpenReassignDialog(false)}>
          <div className="attendance-manager-dialog" onClick={e => e.stopPropagation()}>
            <div className="attendance-manager-dialog-header">
              <h2 className="attendance-manager-dialog-title">Giao lại công việc</h2>
              <button className="attendance-manager-dialog-close" onClick={() => setOpenReassignDialog(false)}>✕</button>
            </div>
            <div className="attendance-manager-dialog-content">
              <p><strong>Tên dịch vụ:</strong> {selectedRequestTask.serviceName}</p>
              <p><strong>Vị trí:</strong> {selectedRequestTask.graveLocation}</p>
              <p><strong>Thời gian:</strong> {format(new Date(selectedRequestTask.startDate), 'dd/MM/yyyy')} - {format(new Date(selectedRequestTask.endDate), 'dd/MM/yyyy')}</p>
              <p><strong>Trạng thái:</strong> {getStatusText(selectedRequestTask.status)}</p>
              <select 
                value={selectedStaffForRequest}
                onChange={(e) => setSelectedStaffForRequest(e.target.value)}
                className="attendance-manager-staff-select"
              >
                <option value="">Chọn nhân viên bàn giao</option>
                {selectedRequestTask.staffs.map(staff => (
                  <option key={staff.accountId} value={staff.accountId}>
                    {staff.staffFullName}
                  </option>
                ))}
              </select>
            </div>
            <div className="attendance-manager-dialog-actions">
              <button className="attendance-manager-dialog-button" onClick={handleReassignRequestTask}>
                Giao lại
              </button>
              <button className="attendance-manager-dialog-button" onClick={() => setOpenReassignDialog(false)}>
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