import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Function to add item to cart
export const addToCart = async (accountId, serviceId, martyrId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/CartItems`,
      {
        accountId,
        serviceId,
        martyrId
      },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};