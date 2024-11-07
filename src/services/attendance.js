import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const checkAttendanceForStaff = async (staffId, attendanceData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/Attendance/CheckAttendanceForStaff?staffId=${staffId}`,
      attendanceData,
      {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
