import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getRequestTasks, getRequestTaskDetail, updateRequestTaskStatus } from '../../../APIcontroller/API';
import LoadingForSideBar from '../../../components/LoadingForSideBar/LoadingForSideBar';
import Sidebar from '../../../components/Sidebar/sideBar';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Pagination } from '@mui/material';
import DatePicker from 'react-datepicker';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import "react-datepicker/dist/react-datepicker.css";
import './RequestTasks.css';

const statusOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: '1', label: 'Đang chờ' },
  { value: '2', label: 'Từ chối' },
  { value: '3', label: 'Đang thực hiện' },
  { value: '4', label: 'Hoàn thành' },
];

const getStatusText = (status) => {
  switch (status) {
    case 1:
      return { text: 'Đang chờ', color: '#ffa726' };
    case 2:
      return { text: 'Từ chối', color: '#ef5350' };
    case 3:
      return { text: 'Đang thực hiện', color: '#66bb6a' };
    case 4:
      return { text: 'Hoàn thành', color: '#26a69a' };
    default:
      return { text: 'Không xác định', color: '#9e9e9e' };
  }
};

const RequestTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [endDateFilter, setEndDateFilter] = useState(null);
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState(null);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await getRequestTasks(
          user.accountId,
          page,
          pageSize,
          endDateFilter ? new Date(endDateFilter).toISOString().split('T')[0] : null
        );
        setTasks(response.tasks || []);
        setFilteredTasks(response.tasks || []);
        setTotalPages(response.totalPage);
      } catch (err) {
        setError('Không thể tải danh sách công việc. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.accountId) {
      fetchTasks();
    }
  }, [user?.accountId, page, endDateFilter]);

  useEffect(() => {
    let result = [...tasks];

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(task => 
        task.status === parseInt(statusFilter)
      );
    }

    setFilteredTasks(result);
  }, [statusFilter, tasks]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setEndDateFilter(null);
    setPage(1);
  };

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setSelectedTask(null);
    setIsPopupOpen(false);
  };

  const handleViewTaskDetail = async (taskId) => {
    setIsLoading(true);
    try {
      const response = await getRequestTaskDetail(taskId);
      setSelectedTaskDetail(response);
      setIsDetailPopupOpen(true);
    } catch (error) {
      console.error('Error fetching task detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTask = () => {
    navigate('/schedule-staff');
  };

  const handleRejectClick = (taskId) => {
    setSelectedTaskId(taskId);
    setIsRejectPopupOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      await updateRequestTaskStatus(selectedTaskId, {
        status: 2, // Trạng thái từ chối
        reason: rejectionReason
      });
      
      // Refresh task list
      const response = await getRequestTasks(user.accountId);
      setTasks(response.tasks || []);
      setFilteredTasks(response.tasks || []);
      
      // Close popups and reset states
      setIsRejectPopupOpen(false);
      setRejectionReason('');
      setSelectedTaskId(null);
      setIsDetailPopupOpen(false);
    } catch (error) {
      console.error('Error rejecting task:', error);
      alert('Có lỗi xảy ra khi từ chối công việc');
    }
  };

  const renderTaskDetailsPopup = () => {
    if (!isPopupOpen || !selectedTask) return null;

    return (
      <div className="request-tasks__popup-overlay" onClick={handleClosePopup}>
        <div className="request-tasks__popup-content" onClick={e => e.stopPropagation()}>
          <div className="request-tasks__popup-header">
            <h2>Mô tả chi tiết</h2>
            <button className="request-tasks__popup-close" onClick={handleClosePopup}>
              <CloseIcon />
            </button>
          </div>
          <div className="request-tasks__popup-body">
            <div className="request-tasks__detail-item">
              <p>{selectedTask.description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTaskDetailPopup = () => {
    if (!isDetailPopupOpen || !selectedTaskDetail) return null;

    return (
      <div className="request-tasks__popup-overlay" onClick={() => setIsDetailPopupOpen(false)}>
        <div className="request-tasks__popup-content" onClick={e => e.stopPropagation()}>
          <div className="request-tasks__popup-header">
            <h2>Chi tiết công việc</h2>
            <button className="request-tasks__popup-close" onClick={() => setIsDetailPopupOpen(false)}>
              <CloseIcon />
            </button>
          </div>
          <div className="request-tasks__popup-body">
            <div className="request-tasks__detail-section">
              
              <div className="request-tasks__detail-item">
                <strong>Tên dịch vụ:</strong>
                <p>{selectedTaskDetail.serviceName}</p>
              </div>
              <div className="request-tasks__detail-item">
                <strong>Mô tả dịch vụ:</strong>
                <p>{selectedTaskDetail.serviceDescription}</p>
              </div>
              <div className="request-tasks__detail-item">
                <strong>Vị trí mộ:</strong>
                <p>{selectedTaskDetail.graveLocation}</p>
              </div>
              <div className="request-tasks__detail-item">
                <strong>Thời gian:</strong>
                <p>Từ {new Date(selectedTaskDetail.startDate).toLocaleDateString('vi-VN')} đến {new Date(selectedTaskDetail.endDate).toLocaleDateString('vi-VN')}</p>
              </div>
              <div className="request-tasks__detail-item">
                <strong>Mô tả chi tiết:</strong>
                <p>{selectedTaskDetail.description}</p>
              </div>
            </div>

            {selectedTaskDetail.materials && selectedTaskDetail.materials.length > 0 && (
              <div className="request-tasks__detail-section">
                <h3>Vật liệu sử dụng</h3>
                <div className="request-tasks__materials-list">
                  {selectedTaskDetail.materials.map((material) => (
                    <div key={material.requestMaterialId} className="request-tasks__material-item">
                      <strong>{material.materialName}</strong>
                      <p>{material.description}</p>
                      <span className="request-tasks__material-price">
                        {material.price.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedTaskDetail.status === 1 && (
              <div className="request-tasks__popup-actions">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAcceptTask}
                >
                  Xác nhận
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleRejectClick(selectedTaskDetail.requestTaskId)}
                >
                  Từ chối
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderRejectPopup = () => {
    if (!isRejectPopupOpen) return null;

    return (
      <div className="request-tasks__popup-overlay" onClick={() => setIsRejectPopupOpen(false)}>
        <div className="request-tasks__popup-content request-tasks__reject-popup" onClick={e => e.stopPropagation()}>
          <div className="request-tasks__popup-header">
            <h2>Lý do từ chối</h2>
            <button className="request-tasks__popup-close" onClick={() => setIsRejectPopupOpen(false)}>
              <CloseIcon />
            </button>
          </div>
          <div className="request-tasks__popup-body">
            <textarea
              className="request-tasks__reject-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Nhập lý do từ chối..."
            />
            <div className="request-tasks__popup-actions">
              <Button
                variant="contained"
                color="error"
                onClick={handleRejectSubmit}
              >
                Xác nhận từ chối
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsRejectPopupOpen(false)}
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingForSideBar text="Đang tải danh sách công việc..." />;
    }

    if (error) {
      return <div className="request-tasks__error">{error}</div>;
    }

    return (
      <div className="request-tasks__content">
        <Box sx={{ mb: 4, borderBottom: '2px solid #2196f3', width: '95%', margin: '0 auto' }}>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 1,
              fontWeight: 'bold',
              color: '#1a237e'
            }}
          >
            Danh Sách Công Việc Theo Yêu Cầu
          </Typography>
        </Box>

        {/* Filter Section */}
        <div className="filter-container">
          <div className="filter-controls">
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Trạng thái"
                sx={{ height: '40px' }}
              >
                {statusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            
          </div>

          <button 
            className="clear-filter-button"
            onClick={handleClearFilters}
          >
            <ClearIcon />
            Xóa bộ lọc
          </button>
        </div>

        {/* Table Section */}
        {filteredTasks.length === 0 ? (
          <div className="no-results">Không có công việc nào</div>
        ) : (
          <>
            <div className="request-tasks__table-wrapper">
              <table className="request-tasks__table">
                <thead>
                  <tr>
                    <th className="column-service">Tên dịch vụ</th>
                    <th className="column-location">Vị trí mộ</th>
                    <th className="column-start-date">Ngày bắt đầu</th>
                    <th className="column-end-date">Ngày kết thúc</th>
                    <th className="column-status">Trạng thái</th>
                    <th className="column-actions">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.requestTaskId}>
                      <td className="column-service">{task.serviceName}</td>
                      <td className="column-location">{task.graveLocation}</td>
                      <td className="column-start-date">{new Date(task.startDate).toLocaleDateString('vi-VN')}</td>
                      <td className="column-end-date">{new Date(task.endDate).toLocaleDateString('vi-VN')}</td>
                      <td className="column-status">
                        <span className="status-badge" style={{ 
                          backgroundColor: `${getStatusText(task.status).color}20`,
                          color: getStatusText(task.status).color 
                        }}>
                          {getStatusText(task.status).text}
                        </span>
                      </td>
                      <td className="column-actions">
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleViewTaskDetail(task.requestTaskId)}
                          className="request-tasks__view-detail-button"
                        >
                          Chi tiết
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="request-tasks__pagination">
              <Pagination 
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </div>
          </>
        )}
        {renderTaskDetailsPopup()}
        {renderTaskDetailPopup()}
        {renderRejectPopup()}
        {isLoading && <div className="request-tasks__loading">Đang tải...</div>}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      {renderContent()}
    </div>
  );
};

export default RequestTasks; 