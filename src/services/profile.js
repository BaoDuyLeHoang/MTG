import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getProfile = async (accountId) => {
    try {
      console.log("Calling API with URL:", `${BASE_URL}/Account/getProfile/${accountId}`); // Add this log
      const response = await axios.get(
        `${BASE_URL}/Account/getProfile/${accountId}`,
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

  export const updateProfile = async (accountId, profileData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/Account/update-profile-staff-or-manager/${accountId}`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };
