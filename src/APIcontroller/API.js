import axios from 'axios';

const BASE_URL = 'https://localhost:7006/api'; // Replace with your actual API base URL

export const API_ENDPOINTS = {
  GET_SERVICES: '/ServiceCategory/categories',
  GET_SERVICES_BY_CATEGORY: '/Service/services',
  GET_SERVICE_DETAILS: '/Service/service-detail', // Add this new endpoint
  // Add other endpoints as needed
};

export const getServices = async () => {
  try {
    const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.GET_SERVICES}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const getServicesByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.GET_SERVICES_BY_CATEGORY}?categoryId=${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching services by category:', error);
    throw error;
  }
};

export const getServiceDetails = async (serviceId) => {
  try {
    const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.GET_SERVICE_DETAILS}?serviceId=${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service details:', error);
    throw error;
  }
};

// You can add more API functions here as needed
