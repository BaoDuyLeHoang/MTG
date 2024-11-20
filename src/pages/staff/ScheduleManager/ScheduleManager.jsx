import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Pagination,
  Fade,
  styled,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import Sidebar from "../../../components/Sidebar/sideBar";
import "./ScheduleManager.css";
import { useAuth } from '../../../context/AuthContext';
import { getTasksByAccountId } from '../../../services/task';
import { getSlot } from '../../../services/slot';
import CloseIcon from '@mui/icons-material/Close';
import { createScheduleDetailForStaff } from '../../../services/scheduleDetail';
import AlertMessage from '../../../components/AlertMessage/AlertMessage';
import { getScheduleDetailForStaff } from '../../../services/scheduleDetail';
import { useNavigate } from 'react-router-dom';
import { getSchedulesForStaffFilterDate } from '../../../services/scheduleDetail';
import { getByScheduleDetailId } from '../../../services/scheduleDetail';
import { deleteScheduleDetail } from '../../../services/scheduleDetail';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  }
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  margin: '8px 0',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  }
}));

const ScheduleManager = () => {
  const navigate = useNavigate();

  const getWeekDates = (weekOffset = 0) => {
    const dates = [];
    const now = new Date();
    const firstDay = new Date(now);
    firstDay.setDate(now.getDate() - now.getDay() + weekOffset * 7);

    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const [weekOffset, setWeekOffset] = useState(0);
  const [schedule, setSchedule] = useState({});
  const [summaryView, setSummaryView] = useState("staff"); // 'staff' or 'task'
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [slotLoading, setSlotLoading] = useState(false);
  const [slotError, setSlotError] = useState(null);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    task: null
  });
  const [alert, setAlert] = useState({
    open: false,
    severity: 'success',
    message: ''
  });
  const [scheduleDetails, setScheduleDetails] = useState({});
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  // Get user from context or localStorage
  const { user } = useAuth();



  // Add useEffect to fetch slots with times
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setSlotLoading(true);
        const response = await getSlot();
        if (response && Array.isArray(response)) {
          setTimeSlots(response.map(slot => ({
            slotId: slot.slotId,
            slotName: slot.slotName,
            startTime: slot.startTime,
            endTime: slot.endTime
          })));
        }
      } catch (err) {
        console.error('Error fetching slots:', err);
        setSlotError('Không thể tải danh sách khung giờ');
      } finally {
        setSlotLoading(false);
      }
    };

    fetchSlots();
  }, []);

  // Add new useEffect to fetch schedule details
  useEffect(() => {
    const fetchScheduleDetails = async () => {
      if (!user?.accountId || !timeSlots.length) return;
      
      setLoadingSchedule(true);
      try {
        const weekDates = getWeekDates(weekOffset);
        const details = {};

        // Get first and last date of the week
        const FromDate = weekDates[0].toISOString().split('T')[0];
        const ToDate = weekDates[6].toISOString().split('T')[0];

        // Single API call for the whole week
        const response = await getSchedulesForStaffFilterDate(
          user.accountId,
          FromDate,
          ToDate
        );

        // Process the response
        if (response && Array.isArray(response)) {
          response.forEach(detail => {
            const key = `${detail.date}-${detail.slotId}`;
            if (!details[key]) {
              details[key] = [];
            }
            details[key].push({
              id: detail.scheduleDetailId,
              serviceName: detail.serviceName,
              martyrCode: detail.martyrCode,
              timeRange: `${detail.startTime.substring(0, 5)} - ${detail.endTime.substring(0, 5)}`,
              date: detail.date,
              slotId: detail.slotId
            });
          });
        }

        console.log('Final details object:', details);
        setSchedule(details);
      } catch (error) {
        console.error('Error fetching schedule details:', error);
        setAlert({
          open: true,
          severity: 'error',
          message: 'Không thể tải lịch làm việc. Vui lòng thử lại sau.'
        });
      } finally {
        setLoadingSchedule(false);
      }
    };

    fetchScheduleDetails();
  }, [user?.accountId, timeSlots, weekOffset]);

  const handleOpenOrderDialog = async (date, timeSlot) => {
    setSelectedDate(date);
    setSelectedTimeSlot(timeSlot);
    setOpenOrderDialog(true);
    
    // Fetch tasks when dialog opens
    if (!user?.accountId) {
      setOrderError('Không tìm thấy thông tin quản lý');
      return;
    }

    try {
      setOrderLoading(true);
      const response = await getTasksByAccountId(user.accountId);
      if (response && response.tasks) {
        // Filter tasks based on status and date if needed
        const filteredTasks = response.tasks.filter(task => {
          const taskEndDate = new Date(task.endDate);
          const selectedDate = date;
          return (task.status === 1 || task.status === 3) && 
                 taskEndDate >= selectedDate;
        });
        setOrders(filteredTasks);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setOrderError('Không thể tải danh sách công việc');
    } finally {
      setOrderLoading(false);
    }
  };

  const handleSelectOrder = (task) => {
    setConfirmDialog({
      open: true,
      task
    });
  };

  const handleConfirmSelect = async () => {
    try {
      const task = confirmDialog.task;
      const key = `${selectedDate.toISOString().split('T')[0]}-${selectedTimeSlot.slotId}`;

      // Create schedule detail array
      const scheduleDetails = [{
        taskId: task.taskId,
        slotId: selectedTimeSlot.slotId,
        date: selectedDate.toISOString().split('T')[0],
        description: `${task.serviceName} - ${task.graveLocation}`
      }];

      // Call the API
      const response = await createScheduleDetailForStaff(user.accountId, scheduleDetails);

      // Fetch updated schedule data for the week
      const weekDates = getWeekDates(weekOffset);
      const FromDate = weekDates[0].toISOString().split('T')[0];
      const ToDate = weekDates[6].toISOString().split('T')[0];

      const updatedSchedule = await getSchedulesForStaffFilterDate(
        user.accountId,
        FromDate,
        ToDate
      );

      // Process and update the schedule state
      const details = {};
      if (updatedSchedule && Array.isArray(updatedSchedule)) {
        updatedSchedule.forEach(detail => {
          const key = `${detail.date}-${detail.slotId}`;
          if (!details[key]) {
            details[key] = [];
          }
          details[key].push({
            id: detail.scheduleDetailId,
            serviceName: detail.serviceName,
            martyrCode: detail.martyrCode,
            timeRange: `${detail.startTime.substring(0, 5)} - ${detail.endTime.substring(0, 5)}`,
            date: detail.date,
            slotId: detail.slotId
          });
        });
      }
      setSchedule(details);

      // Show success message
      setAlert({
        open: true,
        severity: 'success',
        message: response.message || 'Tạo lịch thành công!'
      });

      // Close dialogs
      setConfirmDialog({ open: false, task: null });
      setOpenOrderDialog(false);

    } catch (error) {
      console.error('Failed to create schedule detail:', error);
      setAlert({
        open: true,
        severity: 'error',
        message: error.response?.data?.message || 'Không thể thêm công việc. Vui lòng thử lại sau.'
      });
    }
  };

  const handleRemoveTask = async (key, scheduleDetailId) => {
    try {
      // Call the API to delete the schedule detail
      const response = await deleteScheduleDetail(scheduleDetailId, user.accountId);
      console.log('Delete response:', response); // Log the response

      // Update local state after successful deletion
      setSchedule((prev) => ({
        ...prev,
        [key]: prev[key].filter((task) => task.id !== scheduleDetailId),
      }));

      // Show success message from API response
      setAlert({
        open: true,
        severity: 'success',
        message: response.message || 'Đã xóa công việc thành công!' // Use API message if available
      });

    } catch (error) {
      console.error('Error deleting schedule detail:', error);
      // Show error message from API response if available
      const errorMessage = error.response?.data?.messaege || 'Không thể xóa công việc. Vui lòng thử lại sau.';
      setAlert({
        open: true,
        severity: 'error',
        message: errorMessage
      });
    }
  };

  // Calculate summary data
  const calculateSummary = () => {
    const staffSummary = {};
    const taskSummary = {};
    const weekDates = getWeekDates(weekOffset);

    Object.entries(schedule).forEach(([key, assignments]) => {
      const [dateString] = key.split("-");
      const date = new Date(dateString);

      assignments.forEach((assignment) => {
        // Staff summary
        if (!staffSummary[assignment.staff]) {
          staffSummary[assignment.staff] = {
            totalTasks: 0,
            taskTypes: {},
            dateWiseTasks: {},
          };
        }

        const formattedDate = formatDate(date);
        if (!staffSummary[assignment.staff].dateWiseTasks[formattedDate]) {
          staffSummary[assignment.staff].dateWiseTasks[formattedDate] = [];
        }

        staffSummary[assignment.staff].totalTasks++;
        staffSummary[assignment.staff].dateWiseTasks[formattedDate].push(
          assignment.task
        );
        staffSummary[assignment.staff].taskTypes[assignment.task] =
          (staffSummary[assignment.staff].taskTypes[assignment.task] || 0) + 1;

        // Task summary
        if (!taskSummary[assignment.task]) {
          taskSummary[assignment.task] = {
            total: 0,
            assignedStaff: {},
            dateWiseAssignments: {},
          };
        }

        if (!taskSummary[assignment.task].dateWiseAssignments[formattedDate]) {
          taskSummary[assignment.task].dateWiseAssignments[formattedDate] = [];
        }

        taskSummary[assignment.task].total++;
        taskSummary[assignment.task].dateWiseAssignments[formattedDate].push(
          assignment.staff
        );
        taskSummary[assignment.task].assignedStaff[assignment.staff] =
          (taskSummary[assignment.task].assignedStaff[assignment.staff] || 0) +
          1;
      });
    });

    return { staffSummary, taskSummary };
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "short",
      month: "numeric",
      day: "numeric",
    });
  };

  const summary = calculateSummary();

  const handleViewDetail = (task, data) => {
    console.log("View detail for task:", task, data);
    // Add your logic here to show detailed view
    // This could open a modal, navigate to a new page, etc.
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getPaginatedOrders = () => {
    const filteredOrders = orders.filter(order => order.status === 1 || order.status === 3);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  };

  const handleCloseAlert = () => {
    setAlert(prev => ({
      ...prev,
      open: false
    }));
  };

  const handleTaskClick = async (scheduleDetailId) => {
    try {
      // Navigate directly with both parameters
      navigate(`/task-detail/${user.accountId}/${scheduleDetailId}`);
    } catch (error) {
      console.error('Error navigating to task detail:', error);
      setAlert({
        open: true,
        severity: 'error',
        message: 'Không thể chuyển trang. Vui lòng thử lại sau.'
      });
    }
  };

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        <div className="mgmt-dashboard">
          <h1 className="mgmt-dashboard__title">Bảng Quản Lý Lịch Trình</h1>
          <div className="mgmt-dashboard__header">
            <div className="mgmt-dashboard__controls">
              <div className="mgmt-dashboard__week-nav">
                <Button
                  variant="contained"
                  onClick={() => setWeekOffset((prev) => prev - 1)}
                >
                  Tuần Trước
                </Button>
                <Button variant="contained" onClick={() => setWeekOffset(0)}>
                  Tuần Hiện Tại
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setWeekOffset((prev) => prev + 1)}
                >
                  Tuần Sau
                </Button>
              </div>
            </div>
          </div>

          <div className="mgmt-dashboard__content">
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              {loadingSchedule ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography>Đang tải lịch làm việc...</Typography>
                </Box>
              ) : (
                <Table className="schedule-table" sx={{ minWidth: 650 }} aria-label="schedule table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Thời Gian</TableCell>
                      {getWeekDates(weekOffset).map((date) => (
                        <TableCell key={date.toISOString()} align="center">
                          {formatDate(date)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {timeSlots.map((timeSlot) => (
                      <TableRow key={timeSlot.slotId}>
                        <TableCell component="th" scope="row">
                          {`${timeSlot.slotName} (${timeSlot.startTime} - ${timeSlot.endTime})`}
                        </TableCell>
                        {getWeekDates(weekOffset).map((date) => {
                          const formattedDate = date.toISOString().split('T')[0];
                          const key = `${formattedDate}-${timeSlot.slotId}`;
                          const assignments = schedule[key] || [];
                          
                      
                          
                          return (
                            <TableCell
                              key={key}
                              align="center"
                              sx={{
                                minWidth: 200,
                                "&:hover": { backgroundColor: "#f5f5f5" },
                                position: 'relative',
                                p: 2
                              }}
                            >
                              {assignments && assignments.length > 0 ? (
                                <div className="mgmt-task-list">
                                  {assignments.map((assignment) => (
                                    <div
                                      key={assignment.id}
                                      className="mgmt-task-list__item"
                                      onClick={(e) => {
                                        if (!e.defaultPrevented) {
                                          handleTaskClick(assignment.id);
                                        }
                                      }}
                                      sx={{
                                        position: 'relative',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        p: 1,
                                        mb: 1,
                                        border: '1px solid #dee2e6',
                                        cursor: 'pointer',
                                        '&:hover': {
                                          backgroundColor: '#f5f5f5',
                                          transform: 'translateY(-2px)',
                                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                        }
                                      }}
                                    >
                                      <div className="task-details">
                                        <Typography 
                                          variant="subtitle2" 
                                          sx={{ fontWeight: 600, mb: 0.5 }}
                                        >
                                          {assignment.serviceName}
                                        </Typography>
                                        <Typography 
                                          variant="caption" 
                                          color="text.secondary"
                                          display="block"
                                        >
                                          Mã liệt sĩ: {assignment.martyrCode}
                                        </Typography>
                                        <Typography 
                                          variant="caption" 
                                          color="text.secondary"
                                          display="block"
                                        >
                                          Thời gian: {assignment.timeRange}
                                        </Typography>
                                      </div>
                                      <IconButton
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveTask(key, assignment.id);
                                        }}
                                        sx={{
                                          position: 'absolute',
                                          right: 8,
                                          top: 8,
                                          '&:hover': {
                                            color: 'error.main',
                                          },
                                          zIndex: 2
                                        }}
                                      >
                                        <CloseIcon fontSize="small" />
                                      </IconButton>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleOpenOrderDialog(date, timeSlot)}
                                >
                                  + Thêm Công Việc
                                </Button>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </div>
        </div>
      </div>
      <StyledDialog 
        open={openOrderDialog} 
        onClose={() => setOpenOrderDialog(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={300}
      >
        <Box sx={{ position: 'relative', p: 2 }}>
          <DialogTitle sx={{ 
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 600,
            pb: 1
          }}>
            Chọn Công Việc
          </DialogTitle>
          
          <Box sx={{ 
            textAlign: 'center', 
            mb: 2,
            color: 'text.secondary',
            '& > *': { mx: 1 }
          }}>
            <Typography component="span" sx={{ fontWeight: 500 }}>
              Ngày: {selectedDate?.toLocaleDateString('vi-VN')}
            </Typography>
            <Typography component="span" sx={{ fontWeight: 500 }}>
              |
            </Typography>
            <Typography component="span" sx={{ fontWeight: 500 }}>
              Khung giờ: {selectedTimeSlot?.slotName} ({selectedTimeSlot?.startTime} - {selectedTimeSlot?.endTime})
            </Typography>
          </Box>

          <IconButton
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: 'grey.500',
            }}
            onClick={() => setOpenOrderDialog(false)}
          >
            <CloseIcon />
          </IconButton>
          
          <DialogContent>
            {orderLoading ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                p: 3 
              }}>
                <Typography>Đang tải...</Typography>
              </Box>
            ) : orderError ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                p: 3 
              }}>
                <Typography color="error">{orderError}</Typography>
              </Box>
            ) : (
              <>
                <List sx={{ py: 2 }}>
                  {getPaginatedOrders().map((task) => (
                    <Fade in key={task.taskId} timeout={500}>
                      <StyledListItem 
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          display: 'flex',
                          justifyContent: 'space-between',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                          }
                        }}
                      >
                        <Box sx={{ flex: 1, p: 1 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontSize: '1.1rem',
                              fontWeight: 500,
                              mb: 0.5
                            }}
                          >
                            {task.serviceName} - {task.graveLocation}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              gap: 1
                            }}
                          >
                            <span>Hạn:</span>
                            <span style={{ fontWeight: 500 }}>
                              {new Date(task.endDate).toLocaleDateString('vi-VN')}
                            </span>
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleSelectOrder(task)}
                          sx={{ minWidth: '100px' }}
                        >
                          Thêm Công Việc
                        </Button>
                      </StyledListItem>
                    </Fade>
                  ))}
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination 
                    count={Math.ceil(orders.filter(task => task.status === 1 || task.status === 3).length / itemsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              </>
            )}
          </DialogContent>
        </Box>
      </StyledDialog>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, task: null })}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px',
            padding: '16px',
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ 
          fontSize: '1.2rem',
          fontWeight: 600,
          pb: 1
        }}>
          Xác nhận thêm công việc
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ 
            color: 'text.primary',
            fontSize: '1rem'
          }}>
            Bạn có muốn thực hiện công việc{' '}
            <span style={{ fontWeight: 600 }}>
              {confirmDialog.task?.serviceName}
            </span>{' '}
            vào {selectedTimeSlot?.slotName} ({selectedTimeSlot?.startTime} - {selectedTimeSlot?.endTime}), ngày{' '}
            {selectedDate?.toLocaleDateString('vi-VN')} không?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pt: 2, pb: 1 }}>
          <Button
            onClick={() => setConfirmDialog({ open: false, task: null })}
            color="inherit"
            variant="outlined"
            sx={{ 
              minWidth: '80px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Không
          </Button>
          <Button
            onClick={handleConfirmSelect}
            variant="contained"
            autoFocus
            sx={{ 
              minWidth: '80px',
              textTransform: 'none',
              fontWeight: 500
            }}im
          >
            Có
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
