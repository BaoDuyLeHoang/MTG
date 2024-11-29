import React, { useState, useEffect } from "react";
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Fade,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
  Pagination,
  Tabs,
  Tab,
} from "@mui/material";
import Sidebar from "../../../components/Sidebar/sideBar";
import "./ScheduleManager.css";
import { useAuth } from '../../../context/AuthContext';
import { getNotSchedulingTasksByAccountId } from '../../../services/task';
import CloseIcon from '@mui/icons-material/Close';
import { createScheduleDetailForStaff, getSchedulesForStaffFilterDate, createScheduleDetailRecurringService } from '../../../services/scheduleDetail';
import AlertMessage from '../../../components/AlertMessage/AlertMessage';
import { useNavigate } from 'react-router-dom';
import { deleteScheduleDetail } from '../../../services/scheduleDetail';
import { AlignVerticalJustifyEndIcon } from "lucide-react";
import { getRecurringTasks } from '../../../services/assignmentTask';
import axios from 'axios';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  }
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '16px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  '&:last-child': {
    borderBottom: 'none',
  }
}));

const TaskInfo = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  width: '100%',
});

const TaskLocation = styled(Typography)({
  color: '#666',
  fontSize: '0.875rem',
});

const TaskDate = styled(Typography)({
  color: '#666',
  fontSize: '0.875rem',
});

// Helper function để lấy ngày đầu tuần
const getStartOfWeek = (date) => {
  const newDate = new Date(date);
  const day = newDate.getDay();
  // Nếu là Chủ Nhật (0), đặt về -6 để lấy ngày đầu tuần trước đó
  const diff = newDate.getDate() - (day === 0 ? 6 : day - 1);
  newDate.setDate(diff);
  return newDate;
};

// Thêm hàm helper để lấy tên thứ trong tuần
const getDayOfWeek = (date) => {
  const days = [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba', 
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy'
  ];
  return days[date.getDay()];
};

const ScheduleManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orderError, setOrderError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getStartOfWeek(new Date()));
  const [selectedTaskDate, setSelectedTaskDate] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, task: null });
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });
  const [orderLoading, setOrderLoading] = useState(false);
  const [schedule, setSchedule] = useState({});
  const [schedules, setSchedules] = useState([]);
  const [page, setPage] = useState(1);
  const [recurringPage, setRecurringPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recurringTotalPages, setRecurringTotalPages] = useState(1);
  const pageSize = 5; // Số lượng items trên mỗi trang

  // Thêm state cho dialog xác nhận xóa
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    scheduleId: null,
    serviceName: ''
  });

  const [nonSchedulingTasks, setNonSchedulingTasks] = useState([]); // State mới
  const [selectedTab, setSelectedTab] = useState(0);
  const [recurringTasks, setRecurringTasks] = useState([]); // Tasks định kỳ

  // Hàm mới để lấy task không định kỳ
  const fetchNonSchedulingTasks = async (pageIndex) => {
    try {
      const response = await getNotSchedulingTasksByAccountId(
        user.accountId,
        pageIndex,
        pageSize
      );
      if (response) {
        setNonSchedulingTasks(response.tasks);
      }
    } catch (err) {
      console.error('Error fetching non-scheduling tasks:', err);
    }
  };

  // Thêm hàm fetch recurring tasks
  const fetchRecurringTasks = async (pageIndex) => {
    try {
      setOrderLoading(true);
      const response = await getRecurringTasks(pageIndex, pageSize);
      if (response) {
        setRecurringTasks(response.tasks);
        setRecurringTotalPages(response.totalPage);
      }
    } catch (err) {
      console.error('Error fetching recurring tasks:', err);
    } finally {
      setOrderLoading(false);
    }
  };

  // Fetch tasks when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user?.accountId) return;

      try {
        const response = await getNotSchedulingTasksByAccountId(user.accountId);
        if (response && response.tasks) {
          setOrders(response.tasks);
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    fetchTasks();
  }, [user?.accountId]);

  // Thêm useEffect để fetch schedules khi selectedDate thay đổi
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!user?.accountId) return;

      try {
        // Tính toán FromDate (ngày đầu tuần) và ToDate (ngày cuối tuần)
        const fromDate = new Date(selectedDate);
        const toDate = new Date(selectedDate);
        toDate.setDate(toDate.getDate() + 6);

        // Format dates to ISO string
        const fromDateStr = format(fromDate, 'yyyy-MM-dd');
        const toDateStr = format(toDate, 'yyyy-MM-dd');

        const response = await getSchedulesForStaffFilterDate(
          user.accountId,
          fromDateStr,
          toDateStr
        );

        if (response) {
          setSchedules(response);
        }
      } catch (err) {
        console.error('Error fetching schedules:', err);
        setAlert({
          open: true,
          severity: 'error',
          message: 'Không thể tải lịch làm việc. Vui lòng thử lại sau.'
        });
      }
    };

    fetchSchedules();
  }, [user?.accountId, selectedDate]);

  // Helper function để lọc schedules theo ngày và trạng thái
  const getSchedulesByDateAndStatus = (date, status) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return schedules.filter(schedule => 
      schedule.date === dateStr && 
      schedule.status === status
    );
  };

  // Cập nhật hàm để loại bỏ tham số timeSlot
  const handleOpenOrderDialog = async (date) => {
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);
    setSelectedTaskDate(localDate);
    setOpenOrderDialog(true);
    setPage(1);
    setRecurringPage(1);
    setSelectedTab(0);

    if (!user?.accountId) {
      setOrderError('Không tìm thấy thông tin quản lý');
      return;
    }

    await Promise.all([
      fetchTasksPage(1),
      fetchRecurringTasks(1)
    ]);
  };

  // Tách logic fetch tasks thành hàm riêng
  const fetchTasksPage = async (pageIndex) => {
    try {
      setOrderLoading(true);
      const response = await getNotSchedulingTasksByAccountId(
        user.accountId,
        pageIndex,
        pageSize
      );
      
      if (response) {
        const filteredTasks = response.tasks.filter(task => {
          const taskEndDate = new Date(task.endDate);
          taskEndDate.setHours(0, 0, 0, 0);
          
          const isValidStatus = (task.status === 1 || task.status === 3);
          const isValidDate = taskEndDate >= selectedTaskDate;
          return isValidStatus && isValidDate;
        });

        setOrders(filteredTasks);
        setTotalPages(response.totalPage);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setOrderError('Không thể tải danh sách công việc');
    } finally {
      setOrderLoading(false);
    }
  };

  // Thêm hàm xử lý phân trang cho recurring tasks
  const handleRecurringPageChange = async (event, newPage) => {
    try {
      setRecurringPage(newPage);
      await fetchRecurringTasks(newPage);
    } catch (error) {
      console.error('Error changing recurring page:', error);
      setAlert({
        open: true,
        severity: 'error',
        message: 'Không thể tải trang. Vui lòng thử lại.'
      });
    }
  };

  // Thêm hàm xử lý thay đổi trang
  const handlePageChange = async (event, newPage) => {
    try {
      setPage(newPage);
      await fetchTasksPage(newPage);
    } catch (error) {
      console.error('Error changing page:', error);
      setAlert({
        open: true,
        severity: 'error',
        message: 'Không thể tải trang. Vui lòng thử lại.'
      });
    }
  };

  const handleSelectOrder = (task) => {
    setConfirmDialog({ open: true, task });
  };


  // Cập nhật hàm handleConfirmSelect
  const handleConfirmSelect = async () => {
    try {
        const task = confirmDialog.task;
        const formattedDate = format(selectedTaskDate, 'yyyy-MM-dd');

        const scheduleDetails = [{
            taskId: selectedTab === 0 ? task.taskId : task.assignmentTaskId, // Sử dụng ID phù hợp theo loại task
            date: formattedDate,
            description: task.serviceName
        }];

        if (selectedTab === 0) {
            // Tạo lịch cho công việc thường
            await createScheduleDetailForStaff(user.accountId, scheduleDetails);
        } else {
            // Tạo lịch cho công việc định kỳ
            await createScheduleDetailRecurringService(user.accountId, scheduleDetails);
        }

        // Refresh schedules cho tuần hiện tại
        const fromDate = new Date(selectedDate);
        const toDate = new Date(selectedDate);
        toDate.setDate(toDate.getDate() + 6);
        
        const response = await getSchedulesForStaffFilterDate(
            user.accountId,
            format(fromDate, 'yyyy-MM-dd'),
            format(toDate, 'yyyy-MM-dd')
        );

        if (response) {
            setSchedules(response);
        }

        setAlert({ 
            open: true, 
            severity: 'success', 
            message: `Tạo lịch ${selectedTab === 0 ? 'thường' : 'định kỳ'} thành công!` 
        });
        setConfirmDialog({ open: false, task: null });
        setOpenOrderDialog(false);
        setSelectedTaskDate(null);
    } catch (error) {
        console.error('Failed to create schedule detail:', error);
        setAlert({ 
            open: true, 
            severity: 'error', 
            message: 'Không thể thêm công việc. Vui lòng thử lại sau.' 
        });
    }
  };

  // Cập nhật hàm handleRemoveTask
  const handleRemoveTask = (schedule) => {
    console.log('Removing schedule:', schedule); // Thêm log để debug
    setDeleteConfirm({
      open: true,
      scheduleId: schedule.id, // scheduleDetailId đã được truyền từ component
      serviceName: schedule.serviceName
    });
  };

  // Cập nhật hàm handleConfirmDelete
  const handleConfirmDelete = async () => {
    try {
      console.log('Deleting schedule:', deleteConfirm.scheduleId); // Thêm log để debug
      await deleteScheduleDetail(deleteConfirm.scheduleId, user.accountId);
      
      // Refresh lại dữ liệu lịch sau khi xóa
      const fromDate = new Date(selectedDate);
      const toDate = new Date(selectedDate);
      toDate.setDate(toDate.getDate() + 6);
      
      const scheduleResponse = await getSchedulesForStaffFilterDate(
        user.accountId,
        format(fromDate, 'yyyy-MM-dd'),
        format(toDate, 'yyyy-MM-dd')
      );

      if (scheduleResponse) {
        setSchedules(scheduleResponse);
        setAlert({
          open: true,
          severity: 'success',
          message: 'Đã xóa công việc thành công!'
        });
      }
    } catch (error) {
      console.error('Error deleting schedule detail:', error);
      setAlert({
        open: true,
        severity: 'error',
        message: 'Không thể xóa công việc. Vui lòng thử lại sau.'
      });
    } finally {
      setDeleteConfirm({ open: false, scheduleId: null, serviceName: '' });
    }
  };

  // Thêm hàm đóng dialog xác nhận xóa
  const handleCloseDeleteConfirm = () => {
    setDeleteConfirm({ open: false, scheduleId: null, serviceName: '' });
  };

  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  // Hàm để thay đổi tuần
  const changeWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedDate(getStartOfWeek(newDate));
  };

  // Cập nhật nút "Tuần Hiện Tại"
  const handleCurrentWeek = () => {
    setSelectedDate(getStartOfWeek(new Date()));
  };

  // Cập nhật hàm đóng dialog
  const handleCloseOrderDialog = () => {
    setOpenOrderDialog(false);
    setSelectedTaskDate(null);
  };

  // Cập nhật hàm handleTaskClick
  const handleTaskClick = (scheduleDetailId) => {
    navigate(`/task-detail/${user.accountId}/${scheduleDetailId}`);
  };

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content" style={{ width: '100%', padding: '24px' }}>
        <div className="mgmt-dashboard">
          <h1 className="mgmt-dashboard__title">Bảng Quản Lý Lịch Trình</h1>

          <div className="mgmt-dashboard__header" style={{ width: '95%', margin: '0 auto 24px' }}>
            <div className="mgmt-dashboard__controls">
              <div className="mgmt-dashboard__week-nav">
                <Button variant="contained" onClick={() => changeWeek('prev')}>
                  Tuần Trước
                </Button>
                <Button variant="contained" onClick={handleCurrentWeek}>
                  Tuần Hiện Tại
                </Button>
                <Button variant="contained" onClick={() => changeWeek('next')}>
                  Tuần Sau
                </Button>
              </div>
            </div>
          </div>

          <TableContainer 
            component={Paper} 
            sx={{ 
              width: '95%',
              margin: '0 auto',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '& .MuiTable-root': {
                borderCollapse: 'separate',
                borderSpacing: 0,
              },
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            <Table 
              className="schedule-table" 
              sx={{ 
                width: '100%',
                tableLayout: 'fixed',
                '& .MuiTableCell-root': {
                  padding: '12px 16px',
                  borderRight: '1px solid #e0e0e0',
                  borderBottom: '1px solid #e0e0e0',
                  '&:first-of-type': {
                    width: '15%',
                    backgroundColor: '#f8f9fa',
                    '& .MuiTypography-subtitle1': {
                      marginBottom: '4px',
                      color: '#1976d2', // Màu chữ cho thứ
                    },
                    '& .MuiTypography-body2': {
                      color: '#666' // Màu chữ cho ngày
                    }
                  },
                  '&:not(:first-of-type)': {
                    width: '28.33%',
                  },
                  '&:last-child': {
                    borderRight: 'none'
                  }
                },
                '& .MuiTableHead-root .MuiTableCell-root': {
                  backgroundColor: '#f5f5f5',
                  fontWeight: 600,
                  borderBottom: '2px solid #e0e0e0'
                }
              }} 
              aria-label="schedule table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Công Việc Đang Làm</TableCell>
                  <TableCell>Công Việc Đã Hoàn Thành</TableCell>
                  <TableCell>Công Việc Đã Hủy</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: 7 }).map((_, index) => {
                  const date = new Date(selectedDate);
                  date.setDate(date.getDate() + index);
                  date.setHours(0, 0, 0, 0); // Đảm bảo giờ luôn là 00:00:00
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {getDayOfWeek(date)}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {format(date, 'dd/MM/yyyy')}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      {/* Công Việc Đang Làm (Status: 3) */}
                      <TableCell>
                        <div className="mgmt-task-list">
                          {getSchedulesByDateAndStatus(date, 3).map((schedule) => (
                            <div 
                              key={schedule.scheduleDetailId} 
                              className="mgmt-task-list__item"
                              onClick={() => handleTaskClick(schedule.scheduleDetailId)}
                              sx={{ width: '100%' }}
                            >
                              <div className="mgmt-task-list__item-info">
                                <Typography variant="subtitle2" noWrap>
                                  {schedule.serviceName}
                                </Typography>
                                <Typography variant="caption" color="textSecondary" noWrap>
                                  Mã liệt sĩ: {schedule.martyrCode}
                                </Typography>
                                {schedule.description && (
                                  <Typography variant="caption" color="textSecondary" noWrap>
                                    {schedule.description}
                                  </Typography>
                                )}
                              </div>
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveTask({
                                    id: schedule.scheduleDetailId,
                                    serviceName: schedule.serviceName
                                  });
                                }}
                                sx={{ 
                                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                                  zIndex: 2
                                }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenOrderDialog(date)}
                          sx={{ width: '100%' }}
                        >
                          + Thêm Công Việc
                        </Button>
                      </TableCell>

                      {/* Công Việc Đã Hoàn Thành (Status: 4) */}
                      <TableCell>
                        <div className="mgmt-task-list">
                          {getSchedulesByDateAndStatus(date, 4).map((schedule) => (
                            <div 
                              key={schedule.scheduleDetailId} 
                              className="mgmt-task-list__item"
                              onClick={() => handleTaskClick(schedule.scheduleDetailId)}
                              sx={{ 
                                cursor: 'pointer',
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                  transition: 'background-color 0.3s'
                                }
                              }}
                            >
                              <div className="mgmt-task-list__item-info">
                                <Typography variant="subtitle2">
                                  {schedule.serviceName}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  Mã liệt sĩ: {schedule.martyrCode}
                                </Typography>
                                {schedule.description && (
                                  <Typography variant="caption" color="textSecondary">
                                    {schedule.description}
                                  </Typography>
                                )}
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: '#4caf50',
                                    display: 'block',
                                    marginTop: '4px'
                                  }}
                                >
                                  ✓ Đã hoàn thành
                                </Typography>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>

                      {/* Công Việc Đã Hủy (Status: 5) */}
                      <TableCell>
                        <div className="mgmt-task-list">
                          {getSchedulesByDateAndStatus(date, 5).map((schedule) => (
                            <div key={schedule.id} className="mgmt-task-list__item">
                              <div className="mgmt-task-list__item-info">
                                <Typography variant="subtitle2">
                                  {schedule.serviceName}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  Mã liệt sĩ: {schedule.martyrCode}
                                </Typography>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <StyledDialog
        open={openOrderDialog}
        onClose={handleCloseOrderDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 600, pb: 1 }}>
          Chọn Công Việc
        </DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
              <Tab label="Công việc thường" />
              <Tab label="Công việc định kỳ" />
            </Tabs>
          </Box>

          {orderLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {selectedTab === 0 && (
                <>
                  {orders.length > 0 ? (
                    <>
                      <List>
                        {orders.map((task) => (
                          <Fade in key={task.taskId} timeout={500}>
                            <StyledListItem button onClick={() => handleSelectOrder(task)}>
                              <TaskInfo>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  {task.serviceName}
                                </Typography>
                                <TaskLocation>
                                  Địa điểm: {task.graveLocation || 'Chưa có thông tin'}
                                </TaskLocation>
                                <TaskDate>
                                  Ngày hết hạn: {format(new Date(task.endDate), 'dd/MM/yyyy')}
                                </TaskDate>
                              </TaskInfo>
                            </StyledListItem>
                          </Fade>
                        ))}
                      </List>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: 2,
                        pt: 2 
                      }}>
                        <Typography variant="body2">
                          Trang {page} / {totalPages}
                        </Typography>
                        <Pagination 
                          count={totalPages}
                          page={page}
                          onChange={handlePageChange}
                          color="primary"
                          showFirstButton 
                          showLastButton
                        />
                      </Box>
                    </>
                  ) : (
                    <Typography sx={{ textAlign: 'center', py: 2 }}>
                      Không có công việc thường nào khả dụng
                    </Typography>
                  )}
                </>
              )}

              {selectedTab === 1 && (
                <>
                  {recurringTasks.length > 0 ? (
                    <>
                      <List>
                        {recurringTasks.map((task) => (
                          <Fade in key={task.taskId} timeout={500}>
                            <StyledListItem button onClick={() => handleSelectOrder(task)}>
                              <TaskInfo>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  {task.serviceName}
                                </Typography>
                                <TaskLocation>
                                  Địa điểm: {task.graveLocation || 'Chưa có thông tin'}
                                </TaskLocation>
                                <TaskDate>
                                  Ngày hết hạn: {format(new Date(task.endDate), 'dd/MM/yyyy')}
                                </TaskDate>
                              </TaskInfo>
                            </StyledListItem>
                          </Fade>
                        ))}
                      </List>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: 2,
                        pt: 2 
                      }}>
                        <Typography variant="body2">
                          Trang {recurringPage} / {recurringTotalPages}
                        </Typography>
                        <Pagination 
                          count={recurringTotalPages}
                          page={recurringPage}
                          onChange={handleRecurringPageChange}
                          color="primary"
                          showFirstButton 
                          showLastButton
                        />
                      </Box>
                    </>
                  ) : (
                    <Typography sx={{ textAlign: 'center', py: 2 }}>
                      Không có công việc định kỳ nào khả dụng
                    </Typography>
                  )}
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOrderDialog}>Đóng</Button>
        </DialogActions>
      </StyledDialog>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, task: null })}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác nhận thêm công việc</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có muốn thực hiện công việc <strong>{confirmDialog.task?.serviceName}</strong> không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, task: null })} color="inherit">Không</Button>
          <Button onClick={handleConfirmSelect} autoFocus variant="contained">Có</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteConfirm.open}
        onClose={handleCloseDeleteConfirm}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Xác nhận xóa công việc
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa công việc <strong>{deleteConfirm.serviceName}</strong> không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} color="inherit">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <AlertMessage
        open={alert.open}
        handleClose={handleCloseAlert}
        severity={alert.severity}
        message={alert.message}
      />
    </div>
  );
};

export default ScheduleManager;