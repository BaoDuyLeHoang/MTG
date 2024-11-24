import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAvailableServices = async () => {
    const url = `${BASE_URL}/Service/services`;
    console.log('Calling API:', url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    return await response.json();
  };


  
  export const getAdminServices = async (page = 1, pageSize = 5) => {
      try {
        const response = await axios.get(`${BASE_URL}/Service/admin/services`, {
          params: {
            page,
            pageSize
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message || 'Failed to fetch admin services';
      }
  };
  
  export const createService = async (serviceData) => {
    try {
      const response = await axios.post(`${BASE_URL}/Service/services`, serviceData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message || 'Failed to create service';
    }
  };
  