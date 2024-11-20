import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
} from "@mui/material";
import Sidebar from "../../../components/Sidebar/sideBar"; // Import Sidebar
import AlertMessage from '../../../components/AlertMessage/AlertMessage';
import { fetchAttendances, checkAttendancesForManager } from '../../../services/attendance';
import { useAuth } from '../../../context/AuthContext';
import '../AttendanceList/AttendanceList.css';

const AttendanceList = () => {
    const { user } = useAuth();
    const { slotId, date } = useParams();
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: ''
    });

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                setLoading(true);
                const response = await fetchAttendances(slotId, date, user.accountId);
                const updatedAttendances = response.map(attendance => ({
                    ...attendance,
                    status: attendance.status || 0 // Default to 0 if status is not set
                }));
                setAttendances(updatedAttendances);
            } catch (error) {
                console.error('Error fetching attendances:', error);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Không thể tải danh sách tham dự'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAttendanceData();
    }, [slotId, date]);

    const handleCloseAlert = () => {
        setAlert(prev => ({
            ...prev,
            open: false
        }));
    };

    const handleSave = async () => {
        const attendanceStatuses = attendances.map(attendance => ({
            attendanceId: attendance.attendanceId,
            statusAttendance: attendance.status // Use the updated status
        }));

        try {
            await checkAttendancesForManager(user.accountId, attendanceStatuses);
            setAlert({
                open: true,
                severity: 'success',
                message: 'Trạng thái đã được lưu!'
            });
        } catch (error) {
            console.error('Error saving attendance:', error);
            const errorMessage = error.response?.data?.message?.join(', ') || 'Không thể lưu trạng thái tham dự';
            setAlert({
                open: true,
                severity: 'error',
                message: errorMessage
            });
        }
    };

    return (
        <div className="layout-container-attendanceList">
            <Sidebar /> {/* Include Sidebar */}
            <div className="main-content-attendance-list">
                <Typography variant="h4" className="attendance-title-attendanceList">Danh Sách Điểm Danh</Typography>
                <div className="date-time-container-attendanceList">
                    <Typography variant="h6" className="date-time-text-attendanceList">
                        Ngày: {date}
                    </Typography>
                    <Typography variant="h6" className="date-time-text-attendanceList">
                        Thời gian: {attendances.length > 0 ? `${attendances[0].startTime.substring(0, 5)} - ${attendances[0].endTime.substring(0, 5)}` : ''}
                    </Typography>
                </div>

                {loading ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography>Đang tải danh sách tham dự...</Typography>
                    </Box>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã Tham Dự</TableCell>
                                    <TableCell>Tên Nhân Viên</TableCell>
                                    <TableCell>Số Điện Thoại</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Trạng Thái</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {attendances.map((attendance) => (
                                    <TableRow
                                        key={attendance.attendanceId}
                                        onClick={() => {
                                            // Navigate to the detail page when the row is clicked
                                            window.location.href = `/attendance-detail/${attendance.attendanceId}`;
                                        }}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <TableCell>{attendance.attendanceId}</TableCell>
                                        <TableCell>{attendance.staffName}</TableCell>
                                        <TableCell>{attendance.phoneNumber}</TableCell>
                                        <TableCell>{attendance.email}</TableCell>
                                        <TableCell
                                            onClick={(e) => {
                                                // Prevent row click when interacting with radio buttons
                                                e.stopPropagation();
                                            }}
                                        >
                                            <FormControl component="fieldset">
                                                <RadioGroup
                                                    value={
                                                        attendance.status === 1
                                                            ? "present"
                                                            : attendance.status === 2
                                                                ? "absent"
                                                                : ""
                                                    }
                                                    onChange={(e) => {
                                                        const newStatus =
                                                            e.target.value === "present" ? 1 : 2;
                                                        setAttendances((prevAttendances) =>
                                                            prevAttendances.map((a) =>
                                                                a.attendanceId === attendance.attendanceId
                                                                    ? { ...a, status: newStatus }
                                                                    : a
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        value="present"
                                                        control={<Radio />}
                                                        label="Có mặt"
                                                    />
                                                    <FormControlLabel
                                                        value="absent"
                                                        control={<Radio />}
                                                        label="Vắng mặt"
                                                    />
                                                </RadioGroup>
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>


                        </Table>
                    </TableContainer>
                )}

                <Box className="buttons-container-attendanceList">
                    <Button variant="contained" color="primary" class="save-button-attendanceList" onClick={handleSave} sx={{ marginTop: 2 }}>
                        Lưu
                    </Button>
                    <Button variant="contained" class="back-button-attendanceList" onClick={() => window.history.back()}>Trở lại</Button>
                </Box>
                <AlertMessage
                    open={alert.open}
                    handleClose={handleCloseAlert}
                    severity={alert.severity}
                    message={alert.message}
                />
            </div>
        </div>
    );
};

export default AttendanceList;