import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/sideBar';
import { fetchGraveReports } from '../../../services/reportGrave';
import { useNavigate } from 'react-router-dom';
import LoadingForSideBar from '../../../components/LoadingForSideBar/LoadingForSideBar';
import './GraveReport.css';

const GraveReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const loadReports = async () => {
            try {
                setLoading(true);
                const { reports, totalPage } = await fetchGraveReports(pageIndex);
                const formattedReports = reports.map((report) => ({
                    ...report,
                    id: report.reportId,
                    customerName: report.customerName || 'Không rõ',
                    phone: report.customerPhone || 'N/A',
                    description: report.description,
                    graveLocation: report.martyrCode || 'Chưa cập nhật',
                    endDate: report.endDate,
                    status: report.status === 1 ? 'Đã giao' :
                        report.status === 4 ? 'Hoàn thành' :
                            report.status === 5 ? 'Thất bại' :
                                'Không xác định'
                }));
                setReports(formattedReports);
                setTotalPages(totalPage);
            } catch (error) {
                console.error('Error loading reports:', error);
            } finally {
                setLoading(false);
            }
        };
        loadReports();
    }, [pageIndex]);

    const handleRowClick = (reportId) => {
        navigate(`/report-detail/${reportId}`);
    };

    const getStatusClassName = (status) => {
        switch (status) {
            case 'Đã giao':
                return 'status-delivered';
            case 'Hoàn thành':
                return 'status-completed';
            case 'Thất bại':
                return 'status-failed';
            default:
                return '';
        }
    };

    return (
        <div className="gr-container">
            <Sidebar />
            <div className="gr-content">
                {loading ? (
                    <LoadingForSideBar text="Đang tải danh sách báo cáo..." />
                ) : (
                    <>
                        <div className="gr-title">
                            <h1>Danh Sách Báo Cáo Mộ Cần Làm</h1>
                        </div>
                        <div className="gr-grid-container">
                            {reports.length > 0 ? (
                                <div className="gr-table-container">
                                    <table className="gr-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Tên khách hàng</th>
                                                <th>Số điện thoại</th>
                                                <th>Mô tả dịch vụ</th>
                                                <th>Vị trí mộ</th>
                                                <th>Ngày kết thúc</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reports.map((report) => (
                                                <tr
                                                    key={report.reportId}
                                                    onClick={() => handleRowClick(report.reportId)}
                                                    className="gr-table-row"
                                                >
                                                    <td>{report.id}</td>
                                                    <td>{report.customerName}</td>
                                                    <td>{report.phone}</td>
                                                    <td>{report.description}</td>
                                                    <td>{report.graveLocation}</td>
                                                    <td>{report.endDate}</td>
                                                    <td>
                                                        <span className={`gr-status-chip gr-status-${getStatusClassName(report.status)}`}>
                                                            {report.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="gr-empty-state">
                                    <span>Không có báo cáo nào.</span>
                                </div>
                            )}
                        </div>
                        <div className="gr-pagination-container">
                            <button
                                className="gr-pagination-button"
                                onClick={() => setPageIndex(prev => Math.max(prev - 1, 1))}
                                disabled={pageIndex === 1}
                            >
                                Trước
                            </button>
                            <span className="gr-pagination-info">
                                Trang {pageIndex} / {totalPages}
                            </span>
                            <button
                                className="gr-pagination-button"
                                onClick={() => setPageIndex(prev => Math.min(prev + 1, totalPages))}
                                disabled={pageIndex === totalPages}
                            >
                                Sau
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default GraveReports;
