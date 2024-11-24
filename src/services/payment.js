import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getPayments = async (startDate, endDate) => {
    try {
      const response = await axios.get(`${BASE_URL}/Payment/get-payments`, {
        params: {
          startDate: startDate,
          endDate: endDate,
        },
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data; // Return the JSON response
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error; // Rethrow the error for handling in the calling function
    }
  };