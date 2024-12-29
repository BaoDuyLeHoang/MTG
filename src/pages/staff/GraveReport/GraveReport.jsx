import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Pagination } from '@mui/material';
import Sidebar from '../../../components/Sidebar/sideBar';
import { fetchGraveReports } from '../../../services/reportGrave';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

const GraveReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'customerName', headerName: 'Tên khách hàng', width: 200 },
        { field: 'phone', headerName: 'Số điện thoại', width: 150 },
        { field: 'description', headerName: 'Mô tả dịch vụ', flex: 1 },
        { field: 'graveLocation', headerName: 'Vị trí mộ', width: 200 },
        { field: 'endDate', headerName: 'Ngày kết thúc', width: 200 },
    ];

    useEffect(() => {
        const loadReports = async () => {
            setLoading(true);
            const { reports, totalPage } = await fetchGraveReports(pageIndex);
            const formattedReports = reports.map((report) => ({
                ...report,
                id: report.reportId, // Đảm bảo mỗi hàng có trường id
                customerName: report.customerName || 'Không rõ',
                phone: report.customerPhone || 'N/A',
                description: report.description,
                graveLocation: report.martyrCode || 'Chưa cập nhật',
                endDate: report.endDate
            }));
            setReports(formattedReports);
            setTotalPages(totalPage);
            setLoading(false);
        };
        loadReports();
    }, [pageIndex]);

    const handleRowClick = (params) => {
        navigate(`/report-detail/${params.row.reportId}`); // Điều hướng đến trang chi tiết
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <Box sx={{ padding: 2, flexGrow: 1, backgroundColor: '#f5f5f5', overflowY: 'auto' }}>
                <Typography variant="h4" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
                    Danh Sách Báo Cáo Mộ Cần Làm
                </Typography>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {reports.length > 0 ? (
                            <Box sx={{ height: 400, width: '100%', bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
                                <DataGrid
                                    rows={reports}
                                    columns={columns}
                                    pageSize={10}
                                    rowsPerPageOptions={[10]}
                                    disableSelectionOnClick
                                    getRowId={(row) => row.reportId} // Sử dụng reportId làm id
                                    onRowClick={handleRowClick} // Nhấn vào hàng
                                />

                            </Box>
                        ) : (
                            <Typography sx={{ color: '#888', textAlign: 'center', marginTop: 2 }}>
                                Không có báo cáo nào.
                            </Typography>
                        )}
                        <Pagination
                            count={totalPages}
                            page={pageIndex}
                            onChange={(event, value) => setPageIndex(value)}
                            color="primary"
                            showFirstButton
                            showLastButton
                            sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
                        />
                    </>
                )}
            </Box>
        </Box>
    );
};

export default GraveReports;
