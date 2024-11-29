import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getMaterialAdmin = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Material/admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMaterialByServiceId = async (serviceId) => {
  try {
    const response = await axios.get(`${BASE_URL}/Material/admin/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        });
    return response.data;
  } catch (error) {
    throw error;
  }
};