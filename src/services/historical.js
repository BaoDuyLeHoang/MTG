import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Get all historical events
export const getAllHistoricalEvents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/HistoricalEvent/GetAllHistoricalEvents`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch historical events');
  }
};