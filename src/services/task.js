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
            `${BASE_URL}/Task/tasksNotScheduling/account/${accountId}?${params}`,
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

export const addTaskImages = async (scheduleDetailId, urlImages) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/Task/tasks/${scheduleDetailId}/images`,
            { urlImages },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to add images to task');
    }
};
export const getBlogComment = async (blogId) => {
    try {
        const response = await axios.get(`${BASE_URL}/Comment/${blogId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
};

export const updateCommentStatus = async (commentId, status) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/Comment/status/${commentId}/${status}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update comment status');
    }
};


export const updateTaskImage = async (taskId, urlImages) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/Task/tasks/${taskId}/images`,
            { urlImages },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update task image');
    }
};

export const getTasksByManagerId = async (managerId, date, pageIndex, pageSize = 5) => {
    try {
        const params = new URLSearchParams({
            pageIndex: pageIndex,
            pageSize: pageSize
        });
        if (date) {
            params.append('date', date);
        }

        const response = await axios.get(
            `${BASE_URL}/Task/tasks/manager/${managerId}?${params}`,

            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            }
        );
        return response.data;
    } catch (error) {

        throw new Error(error.response?.data?.message || 'Failed to add images to task');

        throw new Error(error.response?.data?.message || 'Failed to fetch tasks for account');

    }
};