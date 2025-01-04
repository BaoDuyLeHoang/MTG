import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getMartyrGraveByCustomerId = async (customerId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/MartyrGrave/getMartyrGraveByCustomerId/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching martyr graves:", error);
    throw error;
  }
};

export const getMartyrGraveById = async (martyrId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/MartyrGraveInformation/${martyrId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching martyr graves:", error);
    throw error;
  }
};

export const getAllGravesForManager = async (page, pageSize, managerId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/MartyrGrave/GetAllForManager?managerId=${managerId}&page=${page}&pageSize=${pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateGraveDetail = async (graveId, updateData) => {
  const token = localStorage.getItem('accessToken');

  const response = await axios.put(
    `${BASE_URL}/MartyrGrave/update-grave-v2/${graveId}`,
    updateData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
};

export const getGraveServices = async (martyrId) => {
  const response = await axios.get(`${BASE_URL}/GraveService/grave-services?martyrId=${martyrId}`);
  return response.data;
};

export const createGraveService = async (managerId, data) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${BASE_URL}/GraveService?managerId=${managerId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });


    return await response.data; // Return the response data
  } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create graveService');
  }

};

export const deleteGraveService = async (managerId, graveServiceId) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${BASE_URL}/GraveService?graveServiceId=${graveServiceId}&managerId=${managerId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });


    return await response.data; // Return the response data
  } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete graveService');
  }

};

export const getGraveOrders = async (martyrGraveId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/Orders/martyr-grave/${martyrGraveId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching grave orders:", error);
    throw error;
  }
};

export const getTasksByMartyrGrave = async (martyrGraveId, taskType, pageIndex = 1, pageSize = 5) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/MartyrGrave/getTasks-martyr-grave/${martyrGraveId}`,
      {
        params: {
          taskType,
          pageIndex,
          pageSize
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching martyr grave tasks:', error);
    throw error;
  }
};
