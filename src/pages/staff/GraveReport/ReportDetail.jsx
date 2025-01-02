import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuth } from "../../../context/AuthContext";
import { fetchReportDetail, uploadVideo } from '../../../services/reportGrave'; // Import hàm từ file api.js
import Sidebar from '../../../components/Sidebar/sideBar';
import { User, MapPin } from 'lucide-react'; // Import các icon cần thiết
import LoadingForSideBar from '../../../components/LoadingForSideBar/LoadingForSideBar';

const ReportDetails = () => {
    const { reportId } = useParams(); // Lấy reportId từ URL
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null); // State để lưu file video được chọn
    const [filePreview, setFilePreview] = useState(null); // State để lưu hình ảnh xem trước
    const { user } = useAuth();

    useEffect(() => {
        const loadReportDetails = async () => {
            setLoading(true);
            try {
                const data = await fetchReportDetail(reportId);
                setReport(data.reportDetail); // Cập nhật để lấy đúng dữ liệu
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết báo cáo:', error);
            } finally {
                setLoading(false);
            }
        };
        loadReportDetails();
    }, [reportId]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('video/')) {
            setFile(selectedFile); // Lưu file video được chọn vào state
            setFilePreview(URL.createObjectURL(selectedFile)); // Tạo URL cho video xem trước
        } else {
            alert('Vui lòng chọn file video.');
            setFile(null);
            setFilePreview(null);
        }
    };

    const handleFileUpload = async () => {
        if (file) {
            const response = await uploadVideo(file, user.accountId, reportId); // Gọi hàm uploadVideo
            if (response) {
                console.log('Video đã được tải lên thành công.');
                setFile(null);
                setFilePreview(null);
                window.location.reload();
            } else {
                console.error('Lỗi khi tải video.');
            }
        } else {
            console.error('Chưa chọn file nào.');
        }
    };

    

    if (loading) {
        return (
            <div className="td-page-layout">
                <Sidebar />
                <div className="td-main-content">
                    <LoadingForSideBar text="Đang tải chi tiết báo cáo..." />
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    return (
        <div className="td-page-layout">
            <Sidebar />
            <div className="td-main-content">
                <div className="td-container">
                    <div className="td-header">
                        <div className="td-header-content">
                            <div className="td-task-id">#{reportId}</div>
                            <h1 className="td-title">{report.description}</h1>
                            <span className={`td-status-badge td-status-${report.status}`}>
                                {getStatusText(report.status)}
                            </span>
                        </div>
                    </div>

                    <div className="td-grid">
                        <div className="td-card">
                            <div className="td-card-header">
                                <User size={20} />
                                <h2 className="td-card-title">Thông tin báo cáo</h2>
                            </div>
                            <div className="td-card-content">
                                <div className="td-info-row">
                                    <div className="td-info-label">Khách hàng</div>
                                    <div className="td-info-value">{report.customerName}</div>
                                </div>
                                <div className="td-info-row">
                                    <div className="td-info-label">Số điện thoại</div>
                                    <div className="td-info-value">{report.customerPhone}</div>
                                </div>
                                <div className="td-info-row">
                                    <div className="td-info-label">Ngày tạo</div>
                                    <div className="td-info-value">{formatDate(report.createAt)}</div>
                                </div>
                            </div>
                        </div>

                        {report.videoFile && (
                            <div className="td-card">
                                <div className="td-card-header">
                                    <h2 className="td-card-title">Video Tình Trạng Mộ</h2>
                                </div>
                                <div className="td-card-content">
                                <iframe src={report.videoFile} width="100%" height="480" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                                </div>
                            </div>
                        )}

                        <div className="td-card">
                            <div className="td-card-header">
                                <MapPin size={20} />
                                <h2 className="td-card-title">Thông tin mộ</h2>
                            </div>
                            <div className="td-card-content">
                                <div className="td-info-row">
                                    <div className="td-info-label">Mã liệt sĩ</div>
                                    <div className="td-info-value">{report.martyrCode}</div>
                                </div>
                                <div className="td-info-row">
                                    <div className="td-info-label">Ngày kết thúc</div>
                                    <div className="td-info-value">{formatDate(report.endDate)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="td-description-card">
                        <h3>Ghi chú của khách hàng</h3>
                        <p>{report.description || "Không có ghi chú."}</p>
                    </div>

                    {report.status === 1 && (
                        <div className="td-completion-section">
                            <h3>Chọn video để tải lên</h3>
                            {filePreview && (
                                <div className="td-video-preview">
                                    <video width="100%" controls>
                                        <source src={filePreview} type="video/mp4" />
                                        Trình duyệt của bạn không hỗ trợ video.
                                    </video>
                                    <Button onClick={() => { setFile(null); setFilePreview(null); }}>Xóa</Button>
                                </div>
                            )}
                            <div className="td-file-upload">
                                <input type="file" accept="video/*" onChange={handleFileChange} />
                                <Button variant="contained" color="primary" onClick={handleFileUpload}>
                                    Tải lên
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const getStatusText = (status) => {
    switch (status) {
        case 1:
            return "Đã giao";
        case 2:
            return "Từ chối";
        case 3:
            return "Đang thực hiện";
        case 4:
            return "Hoàn thành";
        case 5:
            return "Thất bại";
        default:
            return "Không xác định";
    }
};

export default ReportDetails;
