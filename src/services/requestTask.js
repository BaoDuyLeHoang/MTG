import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const updateRequestTaskImage = async (requestTaskId, imageData) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/RequestTask/requestTasks/images/${requestTaskId}`,
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

export const getNotSchedulingRequestTasksByAccountId = async (accountId, pageIndex = 1, pageSize = 5) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/RequestTask/requestTasksNotScheduling/account/${accountId}`,
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

export const getRequestTasksByManagerId = async (managerId, pageIndex = 1, pageSize = 5) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/RequestTask/requestTasks/manager/${managerId}`,
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

export const reassignRequestTask = async (requestTaskId, staffId) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/RequestTask/requestTasks/${requestTaskId}/reassign/${staffId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to reassign request task');
    }
};