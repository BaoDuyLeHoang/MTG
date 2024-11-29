import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getOrdersByManagerArea = async (accountId, pageIndex, pageSize, date) => {
  const response = await axios.get(`${BASE_URL}/Orders/orders/area/${accountId}`, {
      params: {
          Date: date,
          pageIndex: pageIndex,
          pageSize: pageSize,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      }
  });
  return response.data;
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
  export const getOrdersByCustomer = async (accountId, params = {}) => {
    const { date, status, pageIndex = 1, pageSize = 5 } = params;
    const queryParams = new URLSearchParams({
      ...(date && { date }),
      ...(status && status !== "all" && { status }),
      pageIndex,
      pageSize
    });

    try {
      const response = await axios.get(
        `${BASE_URL}/Orders/account/${accountId}?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  };

export const createOrder = async (customerId, paymentMethod, orderData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/Orders`, 
      orderData,
      {
        params: {
          customerId,
          paymentMethod
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response;
    }
    throw error;
  }
};
