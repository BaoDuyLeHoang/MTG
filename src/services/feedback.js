import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const createFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/Feedback/Create-Feedback`,
      {
        accountId: feedbackData.accountId,
        detailId: feedbackData.detailId,
        content: feedbackData.content,
        rating: feedbackData.rating
      },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createFeedbackResponse = async (feedbackData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/Feedback/Create-Feedback-Response`,
      {
        feedbackId: feedbackData.feedbackId,
        staffId: feedbackData.staffId,
        responseContent: feedbackData.responseContent,
      },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllFeedback = async (page = 1, pageSize = 10) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/Feedback/Get-all-feedback`, {
        params: {
          page,
          pageSize
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getFeedbackWithDetailId = async (detailId) => {
  try {
    const response = await axios.get(`${BASE_URL}/Feedback/getFeedbackWithDetailId/${detailId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return null;
  }
};
