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

export const fetchWeeklySlots = async (startDate, endDate, managerId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/Attendance/get-list-slots-dates?startDate=${startDate}&endDate=${endDate}&managerId=${managerId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    return response.data.data; // Ensure this returns the correct data structure
  } catch (error) {
    console.error('Error fetching weekly slots:', error);
    throw error; // Rethrow the error for handling in the component
  }
};

export const fetchAttendances = async (slotId, date, managerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/Attendance/GetAttendancesWithSlotAndDateForManager`, {
      params: {
        slotId: slotId,
        Date: date,
        managerId: managerId // Replace with the actual manager ID as needed
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response.data; // Return the data array
  } catch (error) {
    console.error('Error fetching attendances:', error);
    throw error; // Rethrow the error for handling in the component
  }
};

// Function to check attendances for manager
export const checkAttendancesForManager = async (managerId, attendanceData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/Attendance/CheckAttendancesForManager?managerId=${managerId}`,
      attendanceData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error checking attendances for manager:', error);
    throw error; // Rethrow the error for handling in the component
  }
};

// Function to fetch attendance details by attendance ID
export const fetchAttendanceById = async (attendanceId) => {
  try {
    const response = await axios.get(`${BASE_URL}/Attendance/GetAttendanceByAttendanceId/${attendanceId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data; // Return the attendance details
  } catch (error) {
    console.error('Error fetching attendance by ID:', error);
    throw error; // Rethrow the error for handling in the component
  }
};

export const updateAttendanceStatus = async (attendanceId, status, note, managerId) => {
  try {
      await axios.put(`https://localhost:7006/api/Attendance/UpdateSingleAttendanceStatus`, null, {
          params: {
              attendanceId: attendanceId,
              status: status,
              Note: note,
              managerId: managerId
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            'Content-Type': 'application/json'
          }
      });
      return true; // Indicate success
  } catch (err) {
      console.error('Error updating attendance status:', err);
      throw new Error('Failed to update attendance status.'); // Throw error for handling in the component
  }
};