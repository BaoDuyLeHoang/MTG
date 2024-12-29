import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Hàm để lấy báo cáo mộ
export const fetchGraveReports = async (pageIndex = 1, pageSize = 5) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${BASE_URL}/ReportGrave/GetReports/staff?pageIndex=${pageIndex}&pageSize=${pageSize}`, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return {
            reports: response.data.reports || [],
            totalPage: response.data.totalPage || 1,
        };
    } catch (error) {
        console.error('Error fetching grave reports:', error);
        return { reports: [], totalPage: 1 };
    }
};

// Hàm để lấy chi tiết báo cáo
export const fetchReportDetail = async (reportId) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${BASE_URL}/ReportGrave/GetReportByReportId/${reportId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data; // Giả sử API trả về thông tin báo cáo
    } catch (error) {
        console.error('Error fetching report detail:', error);
        return null;
    }
};

// Hàm để tải video lên
export const uploadVideo = async (file, staffId, reportId) => {
    try {
        const token = localStorage.getItem('accessToken');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('staffId', staffId);
        formData.append('reportId', reportId);

        const response = await axios.put(`${BASE_URL}/ReportGrave/staff/update-video`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data; // Giả sử API trả về thông tin phản hồi
    } catch (error) {
        console.error('Error uploading video:', error);
        return null;
    }
};