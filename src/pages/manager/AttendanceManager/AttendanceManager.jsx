import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Container,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button
} from '@mui/material';
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
import { getTasksByManagerId } from '../../../services/task'; // Import the API function
import { useAuth } from "../../../context/AuthContext";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

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
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch tasks when the component mounts or when the selected date changes
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!user?.accountId) {
          console.error('No accountId found');
          return;
        }

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
        // Có thể thêm state để hiển thị thông báo lỗi cho người dùng
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

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        className="dashboard-main"
        sx={{
          flexGrow: 1,
          p: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
          minHeight: '100vh'
        }}
      >
        <Container maxWidth="lg" className="attendance-manager-container">
          <div className="blog-manager-header">
            <h1 className="blog-manager-title">Công việc của nhân viên</h1>
          </div>
          <Box className="dashboard-header"
            sx={{
              mb: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '15px',
              p: 2,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
              display: 'flex',
              gap: 2,
              alignItems: 'center'
            }}
          >
            <TextField
              placeholder="Tìm kiếm theo tên, địa điểm hoặc nhân viên..."
              variant="outlined"
              size="small"
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                  sx={{
                    width: '160px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                    },
                  }}
                />
                <DatePicker
                  label="Đến ngày"
                  value={toDate}
                  onChange={(newValue) => setToDate(newValue)}
                  minDate={fromDate}
                  format="dd/MM/yyyy"
                  sx={{
                    width: '160px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>

            <FormControl size="small" sx={{ width: '200px' }}>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                displayEmpty
                sx={{
                  borderRadius: '8px',
                  height: '40px' // Match height with other components
                }}
              >
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                <MenuItem value={4}>Hoàn thành</MenuItem>
                <MenuItem value={3}>Đang thực hiện</MenuItem>
                <MenuItem value={1}>Chờ xử lý</MenuItem>
                <MenuItem value={2}>Từ chối</MenuItem>
                <MenuItem value={5}>Thất bại</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={3} className="stats-container">
            {/* Your stats rendering logic remains unchanged */}
          </Grid>

          <Card
            className="tasks-card"
            sx={{
              mt: 4,
              borderRadius: '16px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 'bold',
                  color: '#1a237e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Assignment sx={{ color: '#1e88e5' }} />
                Danh sách Công việc
              </Typography>
              <Box className="tasks-list">
                {currentTasks.map((task, index) => (
                  <Box
                    key={task.taskId}
                    className="task-item animate-in"
                    sx={{
                      p: 2.5,
                      mb: 2,
                      borderRadius: '12px',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#f8f9fa'
                      }
                    }}
                  >
                    <Avatar
                      src={task.serviceImage}
                      alt={task.serviceName}
                      sx={{ 
                        width: 56, 
                        height: 56,
                        border: '2px solid #e0e0e0',
                        flexShrink: 0
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {task.serviceName}
                        </Typography>
                        <Chip
                          label={task.categoryName}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2, flexWrap: 'wrap' }}>
                        <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                          📍 {task.graveLocation}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          📅 {format(new Date(task.startDate), 'dd/MM/yyyy')} - {format(new Date(task.endDate), 'dd/MM/yyyy')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                          <Person sx={{ fontSize: 16, mr: 0.5 }} />
                          {task.fullname}
                        </Typography>
                        <Chip
                          label={getStatusText(task.status)}
                          size="small"
                          color={getStatusColor(task.status)}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenDetails(task)}
                      sx={{ ml: 2 }}
                    >
                      Chi tiết
                    </Button>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Pagination Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <Typography>
              Page {currentPage} of {totalPages}
            </Typography>
            <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Dialog for task details */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedTask && (
          <>
            <DialogTitle>Chi tiết công việc</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="h6">{selectedTask.serviceName}</Typography>
                  <Chip label={selectedTask.categoryName} sx={{ mt: 1 }} />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Nhân viên thực hiện</Typography>
                  <Typography>{selectedTask.fullname}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Vị trí</Typography>
                  <Typography>{selectedTask.graveLocation}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Ngày bắt đầu</Typography>
                  <Typography>{format(new Date(selectedTask.startDate), 'dd/MM/yyyy')}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Ngày kết thúc</Typography>
                  <Typography>{format(new Date(selectedTask.endDate), 'dd/MM/yyyy')}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Trạng thái</Typography>
                  <Chip
                    label={getStatusText(selectedTask.status)}
                    color={getStatusColor(selectedTask.status)}
                    sx={{ mt: 1 }}
                  />
                </Grid>

                {selectedTask.images && selectedTask.images.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>Hình ảnh</Typography>
                    <ImageList sx={{ width: '100%', height: 300 }} cols={3} rowHeight={164}>
                      {selectedTask.images.map((image, index) => (
                        <ImageListItem key={index}>
                          <img
                            src={image}
                            alt={`Task image ${index + 1}`}
                            loading="lazy"
                            style={{ objectFit: 'cover' }}
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Đóng</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AttendanceManager;