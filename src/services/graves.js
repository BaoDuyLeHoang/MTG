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
