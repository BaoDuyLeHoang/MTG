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

export const getNotSchedulingTasksByAccountId = async (accountId, pageIndex = 1, pageSize = 5) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/Task/tasksNotScheduling/account/${accountId}`,
            {
                params: {
                    pageIndex,
                    pageSize
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTasksByAccountId = async (accountId, pageIndex, pageSize) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/Task/tasks/account/${accountId}?pageIndex=${pageIndex}&pageSize=${pageSize}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error in getTasksByAccountId:', error);
        throw error;
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


export const updateTaskImage = async (taskId, imageData) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/Task/tasks/${taskId}/images`,
            {
                imageWorkSpace: imageData.imageWorkSpace,
                urlImages: imageData.urlImages
            },
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

export const getTasksByManagerId = async (managerId, fromDate, toDate, pageIndex = 1, pageSize = 5) => {
    try {
        // Format dates to dd-MM-yyyy
        const formattedFromDate = fromDate.split('-').reverse().join('-');
        const formattedToDate = toDate.split('-').reverse().join('-');
        
        const params = new URLSearchParams({
            pageIndex: pageIndex.toString(),
            pageSize: pageSize.toString(),
            fromDate: formattedFromDate,
            toDate: formattedToDate
        });

        const url = `${BASE_URL}/Task/tasks/manager/${managerId}`;
        console.log('Request URL:', `${url}?${params.toString()}`);

        const response = await axios.get(
            url,
            {
                params: params,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
            }
        );
        
        return response.data;
    } catch (error) {
        console.error('API Error Details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw new Error(error.response?.data?.message || 'Failed to fetch tasks for manager');
    }
};
export const reassignTask = async (detailId, accountId) => {
    try {
        const response = await axios.put(`${BASE_URL}/Task/tasks/${detailId}/reassign/${accountId}`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to reassign task');
    }
};