import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const fetchDashboardStats = async (year, areaId = 'all') => {
    try {
      // Sử dụng URL khác nhau dựa trên việc có chọn khu vực hay không
      const url = areaId === 'all' 
        ? `${BASE_URL}/Dashboard/stats?year=${year}`
        : `${BASE_URL}/Dashboard/getStatsByArea?year=${year}&areaId=${areaId}`;
  
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return null;
    }
  };