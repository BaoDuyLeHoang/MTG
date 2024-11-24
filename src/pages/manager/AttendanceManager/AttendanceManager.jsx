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

const AttendanceManager = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [taskAssignments, setTaskAssignments] = useState([]); // State to hold tasks
  const { user } = useAuth();
  const managerId = user.accountId; // Replace with the actual manager ID as needed

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set the number of items per page

  // Fetch tasks when the component mounts or when the selected date changes
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const dateFormatted = format(selectedDate, 'yyyy-MM-dd'); // Format date for API
        const response = await getTasksByManagerId(managerId, dateFormatted, 1); // Fetch tasks
        // Set taskAssignments to the tasks array from the response
        setTaskAssignments(response.tasks || []); // Update state with fetched tasks
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [selectedDate, managerId]); // Fetch tasks when selectedDate changes

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

      // Date filter
      const taskStartDate = format(new Date(task.startDate), 'dd/MM/yyyy');
      const today = format(selectedDate, 'dd/MM/yyyy');
      const matchesDate = taskStartDate === today;

      // Status filter
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;

      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [taskAssignments, searchQuery, selectedDate, statusFilter]);

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
        <Container maxWidth="lg" className="dashboard-container">
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
              <DatePicker
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                format="dd/MM/yyyy"
                sx={{
                  width: '200px',
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
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#f8f9fa'
                      }
                    }}
                  >
                    <Box className="task-main-info">
                      <Avatar
                        src={task.imagePath1} // Assuming imagePath1 is the avatar
                        alt={task.fullname}
                        sx={{ width: 50, height: 50 }}
                      >
                        {task.fullname.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box className="task-details" sx={{ ml: 2 }}>
                        <Box className="task-title-row">
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {task.serviceName}
                          </Typography>
                          <Chip
                            label={task.categoryName}
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1 }}
                          />
                        </Box>
                        <Typography variant="body2" color="textSecondary" className="task-location">
                          {task.graveLocation} • {format(new Date(task.startDate), 'dd/MM/yyyy')} - {format(new Date(task.endDate), 'dd/MM/yyyy')}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="task-status">
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {task.fullname}
                      </Typography>
                      <Chip
                        label={getStatusText(task.status)}
                        size="small"
                        color={getStatusColor(task.status)}
                        sx={{ mt: 1 }}
                      />
                    </Box>
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
    </Box>
  );
};

export default AttendanceManager;