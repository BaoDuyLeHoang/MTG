import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAllManagers = async (page = 1, pageSize = 10) => {
    try {
        console.log('BASE_URL:', BASE_URL);
        
        const response = await axios.get(`${BASE_URL}/managers?page=${page}&pageSize=${pageSize}`, {
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

  export const updateAccountStatus = async (accountId) => {
    try {
      console.log('BASE_URL:', BASE_URL);
      
      const response = await axios.get(`${BASE_URL}/updateStatus/${accountId}`, {
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
