import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAssignmentTasks = async (pageIndex, pageSize, endDate = null) => {
    try {
        let url = `${BASE_URL}/AssignmentTask/staff?pageIndex=${pageIndex}&pageSize=${pageSize}`;   

        const token = localStorage.getItem('accessToken');
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error in getAssignmentTasks:', error);
        throw error;
    }
}; 

export const getAssignmentTasksForManager = async (pageIndex = 1, pageSize = 5) => {
    try {
        let url = `${BASE_URL}/AssignmentTask/manager?pageIndex=${pageIndex}&pageSize=${pageSize}`;   

        const token = localStorage.getItem('accessToken');
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error in getAssignmentTasks:', error);
        throw error;
    }
}; 

export const getRecurringTasks = async (pageIndex, pageSize) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(
            `${BASE_URL}/AssignmentTask/notScheduling/staff`, {
                params: {
                    pageIndex,
                    pageSize
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error in getRecurringTasks:', error);
        throw error;
    }
};

export const updateAssignmentTaskImage = async (assignmentTaskId, imageData) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/AssignmentTask/images/${assignmentTaskId}`,
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

export const rejectAssignmentTask = async (taskId, rejectionReason) => {
    try {
        const response = await axios.put(`${BASE_URL}/AssignmentTask/status/${taskId}`, {
            status: 2,
            reason: rejectionReason
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        }
    );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to reject task');
    }
};

export const reassignTaskToStaff = async (taskId, staffId) => {
    try {
        const response = await axios.put(`${BASE_URL}/AssignmentTask/reassign/${taskId}?newStaffId=${staffId}`,{},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        }
    );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to reject task');
    }
};