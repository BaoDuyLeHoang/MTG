import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getSlot = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Slot/GetAll`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message || 'Failed to fetch slots';
    }
};
