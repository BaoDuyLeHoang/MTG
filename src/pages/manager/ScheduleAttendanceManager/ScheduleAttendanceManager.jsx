import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
} from "@mui/material";
import Sidebar from "../../../components/Sidebar/sideBar";
import "./ScheduleAttendanceManager.css";
import { useAuth } from '../../../context/AuthContext';
import AlertMessage from '../../../components/AlertMessage/AlertMessage';
import { fetchWeeklySlots } from '../../../services/attendance';

const ScheduleManager = () => {
  const [weeklySlots, setWeeklySlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [weekOffset, setWeekOffset] = useState(0);
  const [alert, setAlert] = useState({
    open: false,
    severity: 'success',
    message: ''
  });

  // Fetch weekly slots
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        const now = new Date();
        const startDate = new Date(now.setDate(now.getDate() - now.getDay() + weekOffset * 7)).toISOString().split('T')[0];
        const endDate = new Date(now.setDate(now.getDate() - now.getDay() + weekOffset * 7 + 6)).toISOString().split('T')[0];
        const slots = await fetchWeeklySlots(startDate, endDate, user.accountId);
        setWeeklySlots(slots);
      } catch (error) {
        console.error('Error:', error);
        setAlert({
          open: true,
          severity: 'error',
          message: 'Không thể tải lịch làm việc'
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?.accountId) {
      fetchSlots();
    }
  }, [weekOffset, user?.accountId]);

  const handleCloseAlert = () => {
    setAlert(prev => ({
      ...prev,
      open: false
    }));
  };

  const handleWeekChange = (offset) => {
    setWeekOffset(prev => prev + offset);
  };

  // Organize slots by date
  const organizedSlots = {};
  weeklySlots.forEach(slot => {
    if (!organizedSlots[slot.date]) {
      organizedSlots[slot.date] = [];
    }
    organizedSlots[slot.date].push(slot);
  });

  // Get the current week's dates
  const getWeekDates = () => {
    const dates = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(now.setDate(now.getDate() - now.getDay() + weekOffset * 7 + i));
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates();


  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        <div className="mgmt-dashboard">
          <h1 className="mgmt-dashboard__title">Bảng Quản Lý Lịch Điểm Danh</h1>

          {/* Week Navigation */}
          <div className="mgmt-dashboard__header">
            <div className="mgmt-dashboard__controls">
              <Button
                variant="contained"
                onClick={() => handleWeekChange(-1)}
              >
                Tuần Trước
              </Button>
              <Button
                variant="contained"
                onClick={() => setWeekOffset(0)}
              >
                Tuần Hiện Tại
              </Button>
              <Button
                variant="contained"
                onClick={() => handleWeekChange(1)}
              >
                Tuần Sau
              </Button>
            </div>
          </div>

          {/* Schedule Table */}
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            {loading ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography>Đang tải lịch làm việc...</Typography>
              </Box>
            ) : (
              <Table sx={{ minWidth: 650 }} aria-label="schedule table">
                <TableHead>
                  <TableRow>
                    <TableCell>Thời Gian</TableCell>
                    {weekDates.map(date => (
                      <TableCell key={date} align="center">
                        {new Date(date).toLocaleDateString('vi-VN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from({ length: 6 }, (_, index) => {
                    const timeSlot = `Slot ${index + 1}`; // Adjust as needed
                    return (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {timeSlot}
                        </TableCell>
                        {weekDates.map(date => {
                          const slotsForDate = organizedSlots[date]?.filter(slot => slot.slotName === timeSlot) || [];
                          return (
                            <TableCell key={date} align="center">
                              {slotsForDate.length > 0 ? (
                                <Link
                                  to={`/attendance-list/${slotsForDate[0].slotId}/${slotsForDate[0].date}`}
                                  style={{ textDecoration: 'none' }} // Optional: Remove underline
                                >
                                  <div className="square">
                                    {slotsForDate.map(slot => (
                                      <Typography key={slot.slotId} className="square-content">
                                        {`Thời gian: ${slot.startTime.substring(0, 5)} - ${slot.endTime.substring(0, 5)}`}
                                      </Typography>
                                    ))}
                                  </div>
                                </Link>
                              ) : (
                                <Typography variant="body2" color="blue">
                                  Không có lịch
                                </Typography>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </div>
      </div>

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