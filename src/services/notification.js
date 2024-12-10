import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const getMyNotifications = async (pageIndex = 1, pageSize = 5) => {
    try {
        const token = localStorage.getItem("accessToken");
        console.log(`Fetching notifications - Page ${pageIndex}, Size ${pageSize}`);

        const response = await axios.get(
            `${BASE_URL}/Notification/my-notifications?pageIndex=${pageIndex}&pageSize=${pageSize}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("Notifications API Response:", response.data);
        return response.data; // Trả về { notifications: [...], totalPage: number }
    } catch (error) {
        console.error(
            "Error fetching notifications:",
            error.response ? error.response.data : error.message
        );
        throw error;
    }
};

export const getNotificationDetail = async (notificationId) => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${BASE_URL}/Notification/detail-for-staff/${notificationId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data; // Trả về dữ liệu chi tiết thông báo
    } catch (error) {
        console.error("Error fetching notification detail:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi
    }
};

export const getNotificationDetailForManager = async (notificationId) => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${BASE_URL}/Notification/detail-for-manager/${notificationId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data; // Trả về dữ liệu chi tiết thông báo
    } catch (error) {
        console.error("Error fetching notification detail:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi
    }
};