import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getTask = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/Tasks`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
};

export const createTask = async (taskData) => {
    try {
        const response = await axios.post(`${BASE_URL}/Task/tasks`, taskData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create task');
    }
};

export const getTasksByAccountId = async (accountId, date, pageIndex = 1, pageSize = 5) => {
    try {
        const params = new URLSearchParams({
            pageIndex: pageIndex,
            pageSize: pageSize
        });
        if (date) {
            params.append('date', date);
        }

        const response = await axios.get(
            `${BASE_URL}/Task/tasks/account/${accountId}?${params}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch tasks for account');
    }
};
