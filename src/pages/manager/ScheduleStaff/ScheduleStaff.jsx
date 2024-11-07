import React, { useState } from "react";
import Sidebar from "../../../components/Sidebar/sideBar";
import "./ScheduleStaff.css";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Typography,
  Button
} from '@mui/material';

const ScheduleStaff = () => {
  const [weekOffset, setWeekOffset] = useState(0);

  // Helper function to get week dates
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

  // Vietnamese day names
  const vnDayNames = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];

  // Generate array of 6 slots
  const slots = Array.from({ length: 6 }, (_, i) => i + 1);

  // Sample task data - modified to show multiple tasks per cell
  const tasks = [
    { day: 3, slot: 2, name: 'Chuẩn bị báo cáo tuần' },
    { day: 3, slot: 2, name: 'Họp nhóm dự án A' },
    { day: 4, slot: 4, name: 'Cuộc họp team' },
    { day: 6, slot: 1, name: 'Hoàn thành thiết kế' },
  ];

  // Helper function to get tasks for a specific date and slot
  const getTasksForCell = (date, slot) => {
    return tasks.filter(
      (t) => t.day === date.getDate() && t.slot === slot
    ).slice(0, 2); // Limit to maximum 2 tasks
  };

  const formatDate = (date) => {
    return `${vnDayNames[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}`;
  };

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        <div className="weekly-task-schedule">
          <div className="weekly-task-schedule__header">
            <h1 className="weekly-task-schedule__title">
              Lịch Công Việc Trong Tuần
            </h1>
          </div>
          <div className="weekly-task-schedule__nav-buttons">
            <Button 
              variant="contained" 
              onClick={() => setWeekOffset(prev => prev - 1)}
              className="weekly-task-schedule__nav-button"
            >
              Tuần Trước
            </Button>
            <Button 
              variant="contained" 
              onClick={() => setWeekOffset(0)}
              className="weekly-task-schedule__nav-button"
            >
              Tuần Hiện Tại
            </Button>
            <Button 
              variant="contained" 
              onClick={() => setWeekOffset(prev => prev + 1)}
              className="weekly-task-schedule__nav-button"
            >
              Tuần Sau
            </Button>
          </div>

          <TableContainer component={Paper} className="weekly-task-schedule__content">
            <Table className="weekly-task-schedule__table">
              <TableHead>
                <TableRow>
                  <TableCell className="weekly-task-schedule__table-header">
                    Thời Gian
                  </TableCell>
                  {getWeekDates(weekOffset).map((date, index) => (
                    <TableCell 
                      key={index} 
                      align="center"
                      className="weekly-task-schedule__table-header weekly-task-schedule__table-header--center"
                    >
                      {formatDate(date)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {slots.map((slot) => (
                  <TableRow key={slot}>
                    <TableCell className="weekly-task-schedule__table-cell weekly-task-schedule__table-cell--font-medium">
                      Ca {slot}
                    </TableCell>
                    {getWeekDates(weekOffset).map((date, dayIndex) => {
                      const cellTasks = getTasksForCell(date, slot);
                      
                      return (
                        <TableCell 
                          key={`${slot}-${dayIndex}`}
                          className="weekly-task-schedule__table-cell weekly-task-schedule__table-cell--relative"
                        >
                          <div className="weekly-task-schedule__task-container">
                            {cellTasks.map((task, index) => (
                              <div 
                                key={index}
                                className="weekly-task-schedule__task"
                              >
                                <span className="weekly-task-schedule__task-content">
                                  {task.name}
                                </span>
                              </div>
                            ))}
                            {cellTasks.length === 0 && (
                              <span className="weekly-task-schedule__empty-slot">
                                Trống
                              </span>
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default ScheduleStaff;
