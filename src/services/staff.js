import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getStaffByManagerArea = async (areaId) => {
    try {
      console.log('BASE_URL:', BASE_URL);
      
      const response = await axios.get(`${BASE_URL}/staffs?areaId=${areaId}`, {
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

// Add new function for creating staff
export const createStaff = async (staffData, accountId) => {
  try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
          `${BASE_URL}/Auth/register-account-martyrGrave?accountId=${accountId}`,
          staffData,
          {
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              }
          }
      );
      return response.data;
  } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create staff');
  }
};

export const banAccountCustomer = async (customerAccountId, userAccountId) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(
      `${BASE_URL}/updateStatus/${customerAccountId}`,
      null,
      {
        params: { userAccountId }, 
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update account status');
  }
};
