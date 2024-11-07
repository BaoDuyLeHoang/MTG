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
