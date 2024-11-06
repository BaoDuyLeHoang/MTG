import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getStaffByManagerArea = async (areaId) => {
    try {
      console.log('BASE_URL:', BASE_URL);
      
      const response = await axios.get(`${BASE_URL}/staffs?areaId=${areaId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch staff');
    }
};
