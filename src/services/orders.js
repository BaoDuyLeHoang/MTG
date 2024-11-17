import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getOrdersByManagerArea = async (managerId, page) => {
    try {
      const response = await axios.get(`${BASE_URL}/Orders/orders/area/${managerId}?pageIndex=${page}`, {
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
      const response = await axios.get(`${BASE_URL}/Orders/order-detail/${detailId}?myAccountId=${managerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order details');
    }
  };
  export const getOrdersByCustomer = async (customerId, date = null, pageIndex = 1, pageSize = 5) => {
    try {
      let url = `${BASE_URL}/Orders/account/${customerId}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
      
      // Add date parameter if provided
      if (date) {
        url += `&date=${date}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch customer orders');
    }
  };
