import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Function to add item to cart
export const addToCart = async (cartItems) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/CartItems`,
      cartItems,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to add items to anonymous cart
export const addToAnonymousCart = async (items) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/CartItems/service-martyrGrave/anonymous/cart`,
      items,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
