import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getOrdersByManagerArea = async (managerId) => {
    try {
      const response = await axios.get(`${BASE_URL}/Orders/orders/area/${managerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  };
  export const getOrderDetails = async (detailId, managerId) => {
    try {
      const response = await axios.get(`${BASE_URL}/Orders/order-detail/${detailId}?managerId=${managerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order details');
    }
  };
