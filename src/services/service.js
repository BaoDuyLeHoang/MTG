import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAvailableServices = async () => {
    const response = await fetch(`${BASE_URL}/Service/services`);
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    return await response.json();
  };