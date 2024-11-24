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

  export const getAllService = async (categoryId = 1, page = 1, pageSize = 5) => {
    try {
      console.log('BASE_URL:', BASE_URL);
      
      const response = await axios.get(`${BASE_URL}/Service/admin/services?categoryId=${categoryId}&page=${page}&pageSize=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch services');
    }
};

export const getServicesByCategory = async (categoryId=1, page = 1, pageSize = 5) => {
  try {
    console.log('BASE_URL:', BASE_URL);
    
    const response = await axios.get(`${BASE_URL}/Service/admin/services?categoryId=${categoryId}&page=${page}&pageSize=${pageSize}`, {
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

export const getMaterial = async () => {
  try {
    console.log('BASE_URL:', BASE_URL);
    
    const response = await axios.get(`${BASE_URL}/Material/admin`, {
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


export const updateStatusMaterial = async (materialId) => {
  try {
    console.log('BASE_URL:', BASE_URL);
    
    const response = await axios.put(
      `${BASE_URL}/Material/updateStatus/${materialId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch material');
  }
};


export const updateMaterial = async (materialId, materialData) => {
  try {
    console.log('BASE_URL:', BASE_URL);
    
    const response = await axios.put(
      `${BASE_URL}/Material/${materialId}`,
      materialData,  // Send the updated data
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update material');
  }
};


export const createMaterial = async (materialData) => {
  try {
    console.log('BASE_URL:', BASE_URL);
    
    const response = await axios.post(
      `${BASE_URL}/Material/`,
      materialData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to create material');
  }
};



