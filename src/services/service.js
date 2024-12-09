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


  
  export const getAdminServices = async (page = 1, pageSize = 10, status = 'all', categoryId = 'all') => {
      try {
        let url = `${BASE_URL}/Service/admin/services?page=${page}&pageSize=${pageSize}`;
        
        if (status !== 'all') {
          url += `&status=${status}`;
        }
        
        if (categoryId !== 'all') {
          url += `&categoryId=${categoryId}`;
        }

        const response = await axios.get(url, {
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
      
      return response;
    } catch (error) {
      throw error.response?.data || error.message || 'Failed to create service';
    }
  };
  
  export const updateService = async (serviceId, serviceData) => {
    try {
      const response = await axios.put(`${BASE_URL}/Service/services?serviceId=${serviceId}`, serviceData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message || 'Failed to update service';
    }
  };
  
  export const updateServiceStatus = async (serviceId) => {
    try {
      const response = await axios.put(`${BASE_URL}/Service/status-service?serviceId=${serviceId}`, null, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message || 'Failed to update service status';
    }
  };

  export const getServiceCategory = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ServiceCategory/categories`, {
        params: {
          
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
  