// AttendanceManager.jsx
import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Card, 
  CardContent,
  Typography, 
  Avatar,
  Chip,
  Container,
  Grid,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import {
  CalendarToday,
  Yard,
  Person,
  Assignment,
  CheckCircle
} from '@mui/icons-material';
import './AttendanceManager.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Sidebar from '../../../components/Sidebar/sideBar';
import SearchIcon from '@mui/icons-material/Search';
import { format, parse, isEqual, startOfDay } from 'date-fns';
import viLocale from 'date-fns/locale/vi'; // For Vietnamese localization

const AttendanceManager = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const taskAssignments = [
    {
      id: 1,
      taskName: 'Bảo trì Vườn Tưởng niệm',
      category: 'Cảnh quan',
      location: 'Khu B, Lô 15-30',
      assignedTo: 'Hoang Vi Công',
      status: 'completed',
      startTime: '07:00',
      endTime: '10:30',
      avatar: '/path/to/avatar1.jpg',
      attendance: {
        checkIn: '06:55',
        checkOut: '10:35',
        status: 'on-time' // on-time, late, early-leave, absent
      }
    },
    {
      id: 2,
      taskName: 'Chuẩn bị Lễ Tang',
      category: 'Dịch vụ tang lễ',
      location: 'Khu A, Lô 45',
      assignedTo: 'Nguyen Van A',
      status: 'in-progress',
      startTime: '09:00',
      endTime: '-',
      avatar: '/path/to/avatar2.jpg',
      attendance: {
        checkIn: '08:50',
        checkOut: '10:30',
        status: 'late'
      }
    },
    {
      id: 3,
      taskName: 'Cài đặt đánh dấu đá',
      category: 'Cài đặt đánh dấu',
      location: 'Khu C, Lô 12',
      assignedTo: 'Nguyen Van B',
      status: 'pending',
      startTime: 'Scheduled 2:00 PM',
      endTime: '-',
      avatar: '/path/to/avatar3.jpg',
      attendance: {
        checkIn: '01:55',
        checkOut: '10:30',
        status: 'early-leave'
      }
    },
    {
      id: 4,
      taskName: 'Bảo trì đất',
      category: 'Bảo trì đất',
      location: 'Khu D, Lô 1-10',
      assignedTo: 'Nguyen Van C',
      status: 'completed',
      startTime: '06:30',
      endTime: '11:45',
      avatar: '/path/to/avatar4.jpg',
      attendance: {
        checkIn: '06:30',
        checkOut: '11:45',
        status: 'on-time'
      }
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'primary';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'in-progress':
        return 'Đang thực hiện';
      case 'pending':
        return 'Chờ xử lý';
      default:
        return status;
    }
  };

  const getAttendanceStatus = (attendance) => {
    if (!attendance) return { color: 'default', text: 'Chưa điểm danh' };
    
    switch (attendance.status) {
      case 'on-time':
        return { color: 'success', text: 'Đúng giờ' };
      case 'late':
        return { color: 'warning', text: 'Đi muộn' };
      case 'early-leave':
        return { color: 'error', text: 'Về sớm' };
      case 'absent':
        return { color: 'error', text: 'Vắng mặt' };
      default:
        return { color: 'default', text: 'Không xác định' };
    }
  };

  // Filter tasks based on all criteria
  const filteredTasks = useMemo(() => {
    return taskAssignments.filter(task => {
      // Search filter - check task name, location, and assignedTo
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        task.taskName.toLowerCase().includes(searchLower) ||
        task.location.toLowerCase().includes(searchLower) ||
        task.assignedTo.toLowerCase().includes(searchLower);

      // Date filter
      const today = format(selectedDate, 'dd/MM/yyyy');
      const taskDate = format(new Date(), 'dd/MM/yyyy'); // You'll need to add date to your task data
      const matchesDate = today === taskDate;

      // Status filter
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;

      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [taskAssignments, searchQuery, selectedDate, statusFilter]);

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
            <h1 className="blog-manager-title">Quản lý Điểm danh</h1>
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
                <MenuItem value="completed">Hoàn thành</MenuItem>
                <MenuItem value="in-progress">Đang thực hiện</MenuItem>
                <MenuItem value="pending">Chờ xử lý</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={3} className="stats-container">
            {[
              { 
                title: 'Tổng công việc',
                value: filteredTasks.length,
                icon: Assignment,
                gradient: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)'
              },
              {
                title: 'Đã hoàn thành',
                value: filteredTasks.filter(task => task.status === 'completed').length,
                icon: CheckCircle,
                gradient: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)'
              },
              {
                title: 'Đi làm đúng giờ',
                value: filteredTasks.filter(task => task.attendance?.status === 'on-time').length,
                icon: CheckCircle,
                gradient: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)'
              },
              {
                title: 'Đi muộn/Về sớm',
                value: filteredTasks.filter(task => 
                  task.attendance?.status === 'late' || task.attendance?.status === 'early-leave'
                ).length,
                icon: Person,
                gradient: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'
              }
            ].map((stat, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  className="stats-card animate-in"
                  sx={{ 
                    background: stat.gradient,
                    borderRadius: '16px',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                >
                  <CardContent className="stats-content">
                    <Box className="stats-info">
                      <Typography color="white" variant="body2">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <stat.icon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.8)' }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
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
                {filteredTasks.map((task, index) => (
                  <Box 
                    key={task.id}
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
                        src={task.avatar} 
                        alt={task.assignedTo}
                        sx={{ width: 50, height: 50 }}
                      >
                        {task.assignedTo.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box className="task-details" sx={{ ml: 2 }}>
                        <Box className="task-title-row">
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {task.taskName}
                          </Typography>
                          <Chip
                            label={task.category}
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1 }}
                          />
                        </Box>
                        <Typography variant="body2" color="textSecondary" className="task-location">
                          {task.location} • {task.startTime} - {task.endTime}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            Điểm danh: {task.attendance ? `${task.attendance.checkIn} - ${task.attendance.checkOut}` : 'N/A'}
                          </Typography>
                          <Chip
                            label={getAttendanceStatus(task.attendance).text}
                            size="small"
                            color={getAttendanceStatus(task.attendance).color}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Box className="task-status">
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {task.assignedTo}
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
        </Container>
      </Box>
    </Box>
  );
};

export default AttendanceManager;