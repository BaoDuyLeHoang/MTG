import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Button,
    Paper,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    Badge,
    IconButton,
} from '@mui/material';
import { CheckCircle, Cancel, ArrowBack, Save } from '@mui/icons-material'; // Import icons
import { fetchAttendanceById, updateAttendanceStatus } from '../../../services/attendance';
import Sidebar from '../../../components/Sidebar/sideBar';
import './AttendanceDetail.css';
import { useAuth } from '../../../context/AuthContext';

const defaultImage = require('../../../assets/images/image3.jpg'); // Use require for image import

const AttendanceDetail = () => {
    const { attendanceId } = useParams();
    const [attendanceDetail, setAttendanceDetail] = useState(null);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(1); // Default to Present
    const [note, setNote] = useState('');

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await fetchAttendanceById(attendanceId);
                setAttendanceDetail(data);
                setStatus(data.status);
                setNote(data.note || '');
            } catch (err) {
                setError('Could not fetch attendance details.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [attendanceId]);

    const handleUpdateStatus = async () => {
        try {
            const managerId = user.accountId;
            await updateAttendanceStatus(attendanceId, status, note, managerId);
            alert('Attendance status updated successfully!');
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <div className="layout-container-attendanceDetail">
            <Sidebar />
            <div className="main-content-attendanceDetail">
                <Paper elevation={3} className="attendance-detail-paper-attendanceDetail">
                    <Box sx={{ padding: 3 }}>
                        <Typography variant="h4" className="attendance-title-attendanceDetail">
                            Yêu Cầu Check-in
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 3, marginTop: 3, gap: 4}}>
                            <Typography variant="h6" sx={{ marginRight: 2 }}>Tên nhân viên: {attendanceDetail.staffName}</Typography>
                            <Badge
                                badgeContent={status === 1 ? 'Present' : 'Absent'}
                                color={status === 1 ? 'success' : 'error'}
                                sx={{
                                    transform: 'scale(1.2)', // Increase the scale for better visibilityly
                                }}
                            />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center', // Horizontally center
                                alignItems: 'center', // Vertically center
                                padding: 4, // Padding for responsiveness
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'auto auto', // Auto width for both columns
                                    gap: 2, // Space between rows
                                    backgroundColor: '#ffffff', // White background for contrast
                                    padding: 3, // Padding around the content
                                    borderRadius: '12px', // Rounded corners for modern look
                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                                    textAlign: 'left', // Align text to the left for readability
                                }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Ngày điểm danh:</Typography>
                                <Typography variant="body1">{attendanceDetail.date}</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Bắt đầu:</Typography>
                                <Typography variant="body1">{attendanceDetail.startTime.substring(0, 5)}</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Kết thúc:</Typography>
                                <Typography variant="body1">{attendanceDetail.endTime.substring(0, 5)}</Typography>
                            </Box>
                        </Box>



                        <Box className="image-container-attendanceDetail">
                            {[attendanceDetail.imagePath1, attendanceDetail.imagePath2, attendanceDetail.imagePath3].map((img, index) => (
                                <img
                                    key={index}
                                    src={img || defaultImage}
                                    alt={`Attendance Image ${index + 1}`}
                                    className="attendance-image-attendanceDetail"
                                />
                            ))}
                        </Box>

                        <RadioGroup
                            row
                            value={status}
                            onChange={(e) => setStatus(Number(e.target.value))}
                            sx={{ justifyContent: 'center', marginTop: 2 }}
                        >
                            <FormControlLabel value={1} control={<Radio />} label="Điểm danh" />
                            <FormControlLabel value={2} control={<Radio />} label="Vắng mặt" />
                        </RadioGroup>

                        <TextField
                            label="Note"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            sx={{ marginTop: 2 }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: 2 }}>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<Save />}
                                onClick={handleUpdateStatus}
                                className="update-button-attendanceDetail"
                            >
                                Cập nhật
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<ArrowBack />}
                                onClick={() => window.history.back()}
                                className="back-button-attendanceDetail"
                            >
                                Trở lại
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </div>
        </div>
    );
};

export default AttendanceDetail;
