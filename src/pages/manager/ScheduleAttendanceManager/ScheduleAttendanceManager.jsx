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
import Sidebar from "../../../components/Sidebar/sideBar"; // Keep Sidebar styles as-is
import "./ScheduleAttendanceManager.css"; // Keep your CSS intact
import { useAuth } from "../../../context/AuthContext";
import AlertMessage from "../../../components/AlertMessage/AlertMessage";
import { fetchWeeklySlots } from '../../../services/attendance'; // Updated API import

const ScheduleManager = () => {
  const [weeklySlots, setWeeklySlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [weekOffset, setWeekOffset] = useState(0);
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // Fetch weekly slots
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);

        const { startDate, endDate } = calculateWeekDates(weekOffset);
        const slots = await fetchWeeklySlots(startDate, endDate, user.accountId);

        setWeeklySlots(slots);
      } catch (error) {
        console.error("Error:", error);
        setAlert({
          open: true,
          severity: "error",
          message: "Không thể tải lịch làm việc",
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
    setAlert((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleWeekChange = (offset) => {
    setWeekOffset((prev) => prev + offset);
  };

  // Organize slots by date
  const organizedSlots = {};
  weeklySlots.forEach((slot) => {
    if (!organizedSlots[slot.date]) {
      organizedSlots[slot.date] = [];
    }
    organizedSlots[slot.date].push(slot);
  });

  const calculateWeekDates = (offset) => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const firstDayOfWeek = new Date(
      today.setDate(today.getDate() - dayOfWeek + offset * 7)
    );
    const lastDayOfWeek = new Date(
      firstDayOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000
    );

    return {
      startDate: firstDayOfWeek.toISOString().split("T")[0],
      endDate: lastDayOfWeek.toISOString().split("T")[0],
    };
  };


  // Get the current week's dates
  const getWeekDates = () => {
    const { startDate } = calculateWeekDates(weekOffset);
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(new Date(startDate).getTime() + i * 24 * 60 * 60 * 1000);
      dates.push(date.toISOString().split("T")[0]);
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
              <div className="mgmt-dashboard__week-nav">
                <Button variant="contained" onClick={() => handleWeekChange(-1)}>
                  Tuần Trước
                </Button>
                <Button variant="contained" onClick={() => setWeekOffset(0)}>
                  Tuần Hiện Tại
                </Button>
                <Button variant="contained" onClick={() => handleWeekChange(1)}>
                  Tuần Sau
                </Button>
              </div>
            </div>
          </div>

          {/* Schedule Table */}
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            {loading ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography>Đang tải lịch làm việc...</Typography>
              </Box>
            ) : (
              <Table sx={{ minWidth: 650 }} aria-label="schedule table">
                <TableHead>
                  <TableRow>
                    <TableCell>Thời Gian</TableCell>
                    {weekDates.map((date) => (
                      <TableCell key={date} align="center">
                        {new Date(date).toLocaleDateString("vi-VN", {
                          day: "2-digit",   // Display day with two digits (e.g., "17")
                          month: "2-digit", // Display month with two digits (e.g., "11")
                          year: "numeric",  // Include the full year (e.g., "2024")
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
                        {weekDates.map((date) => {
                          const slotsForDate =
                            organizedSlots[date]?.filter(
                              (slot) => slot.slotName === timeSlot
                            ) || [];
                          return (
                            <TableCell key={date} align="center">
                              {slotsForDate.length > 0 ? (
                                <Link
                                  to={`/attendance-list/${slotsForDate[0].slotId}/${slotsForDate[0].date}`}
                                  style={{ textDecoration: "none" }}
                                >
                                  <div className="square">
                                    {slotsForDate.map((slot) => (
                                      <Typography
                                        key={slot.slotId}
                                        className="square-content"
                                      >
                                        {`${slot.startTime.substring(
                                          0,
                                          5
                                        )} - ${slot.endTime.substring(0, 5)}`}
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
