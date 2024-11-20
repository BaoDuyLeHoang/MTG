import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getBlogByAccountId = async (accountId) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${BASE_URL}/Blog/GetBlogByAccountId/${accountId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    throw error;
  }
};

export const createBlog = async (blogData) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(`${BASE_URL}/Blog/CreateBlog`, blogData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    throw error;
  }
};

export const getAllBlogsManager = async (managerId, pageIndex, pageSize) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${BASE_URL}/Blog/blogs/manager/${managerId}?pageIndex=${pageIndex}&pageSize=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    throw error;
  }
};

export const updateBlogStatus = async (blogId, status) => {
  try {
      const token = localStorage.getItem("accessToken");
      
      const response = await axios.patch(
          `${BASE_URL}/Blog/UpdateBlogStatus/${blogId}?status=${status}`,
          null,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
          }
      );

      console.log("Status update response:", response.data);
      return response.data;
  } catch (error) {
      console.error(
          "Error updating account status:",
          error.response ? error.response.data : error.message
      );
      throw error;
  }
};

export const getBlogById = async (blogId) => {
  try {
    const response = await axios.get(`${BASE_URL}/Blog/GetBlogById/${blogId}`);
    return response.data.data; // Return the blog data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin bài viết');
  }
};
