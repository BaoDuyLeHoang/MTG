import axios from 'axios';

// Replace these with your actual API details from Swagger
const API_BASE_URL = 'http://localhost:5244/api';
const LOGIN_ENDPOINT = '/Auth/auth';

// Function to handle login
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${LOGIN_ENDPOINT}`, 
      {
        AccountName: credentials.accountName,
        password: credentials.password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    const { data } = response;
    
    console.log('Full server response:', data); // Add this line

    // Check if the token exists in the response
    if (data.accessToken) { // Change this line if the token key is different
      return {
        success: true,
        data: {
          token: data.accessToken, // And this line
          // Include any other relevant data from the response
        }
      };
    } else {
      // If the API doesn't return a token, log the entire response and return an error
      console.error('Login response does not contain a token:', data);
      return {
        success: false,
        error: 'Login successful but no token received',
        fullResponse: data // Include the full response for debugging
      };
    }

  } catch (error) {
    // Handle error response
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        success: false,
        error: error.response.data.message || 'Login failed',
        statusCode: error.response.status
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        success: false,
        error: 'No response from server',
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        success: false,
        error: 'Error setting up request',
      };
    }
  }
};