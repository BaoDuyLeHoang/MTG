import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const createScheduleDetailForStaff = async (accountId, scheduleDetails) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/ScheduleDetail/CreateScheduleDetailForStaff`, 
        scheduleDetails,
        {
          params: { accountId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
export const getScheduleDetailForStaff = async (accountId, slotId, date) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/ScheduleDetail/GetScheduleDetailForStaff`,
      {
        params: {
          accountId,
          slotId,
          date
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
  
export const getByScheduleDetailId = async (accountId, scheduleDetailId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/ScheduleDetail/GetByScheduleDetailId`,
      {
        params: {
          accountId,
          scheduleDetailId
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
  
export const getSchedulesForStaffFilterDate = async (accountId, FromDate, ToDate) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/ScheduleDetail/GetSchedulesForStaffFiltterDate`,
      {
        params: {
          accountId,
          FromDate,
          ToDate
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
  
export const deleteScheduleDetail = async (scheduleDetailId, accountId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/ScheduleDetail/DeleteScheduleDetail/${scheduleDetailId}`,
      {
        params: { accountId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
  