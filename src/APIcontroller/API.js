import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "https://localhost:7006/api"; // Replace with your actual API base URL

export const API_ENDPOINTS = {
  GET_SERVICES: "/ServiceCategory/categories",
  GET_SERVICES_BY_CATEGORY: "/Service/services",
  GET_SERVICE_DETAILS: "/Service/service-detail", // Add this new endpoint
  GET_GRAVES_BY_CUSTOMER_CODE: "/MartyrGrave/getMartyrGraveByCustomerCode", // Add this new endpoint
  ADD_TO_CART: "/CartItems", // Add this new endpoint
  GET_CHECKOUT_ITEMS: "/CartItems/checkout",
  GET_CART_ITEMS_BY_CUSTOMER_ID: "/CartItems/cart", // Add this new endpoint
  CREATE_ORDER: "/Orders", // Add this new endpoint
  GET_ALL_ORDERS: "/Orders",
  GET_ALL_ORDERS_BY_ACCOUNT_ID: "/Orders/account",
  GET_ORDER_BY_ID: "/Orders", // Add this new endpoint
  UPDATE_ITEM_STATUS: "/updateItemStatus", // Make sure this is correct
  DELETE_CART_ITEM: "/CartItems", // Add this new endpoint
  CREATE_TASK: "/Task/tasks", // Add this new endpoint
  GET_TASKS_BY_ACCOUNT: "/Task/tasks/account", // Add this new endpoint
  UPDATE_TASK_STATUS: "/Task/tasks", // Update this line
  GET_ALL_SERVICES: "/Service/services", // Add this new endpoint
  GET_ORDER_DETAILS: "/Orders/GetOrderByIdForCustomer", // Add this line
  // Add other endpoints as needed
  GET_ALL_STAFF: "/staffs",
  UPDATE_ACCOUNT_STATUS: "/updateStatus", // Add this line
  GET_ALL_BLOGS: "/Blog/GetAllBlogsForCustomer",
  GET_BLOG_CATEGORIES: "/BlogCategory/GetAllBlogCategoriesWithStatusTrue",
  GET_BLOG_BY_ID: "/Blog/GetBlogById",
  POST_COMMENT: "/Comment",
  POST_COMMENT_ICON: "/CommentIcon",
  GET_BLOG_CATEGORY_BY_ID: "/BlogCategory",
  CREATE_FEEDBACK: "/Feedback/Create-Feedback",
  GET_TRENDING_SERVICES: "/Service/trending-services",
  GET_MARTYRS_BY_AREA: "/MartyrGrave/area",
  GET_PROFILE: "/Account/getProfile",
  UPDATE_PROFILE: "/Customer/update-profile",
  CHANGE_PASSWORD: "/Customer/change-password-customer",
};

export const getServices = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.GET_SERVICES}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const getServicesByCategory = async (categoryId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.GET_SERVICES_BY_CATEGORY}?categoryId=${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching services by category:", error);
    throw error;
  }
};

export const getServiceDetails = async (serviceId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.GET_SERVICE_DETAILS}?serviceId=${serviceId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching service details:", error);
    throw error;
  }
};

export const getGravesByCustomerCode = async (customerCode, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/MartyrGrave/getMartyrGraveByCustomerCode/${customerCode}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log("Graves API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching graves:", error);
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
    }
    throw error;
  }
};

export const addToCart = async (cartItem) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log("Sending cart item:", cartItem); // Log the cart item being sent
    console.log("API URL:", `${BASE_URL}${API_ENDPOINTS.ADD_TO_CART}`); // Log the full API URL

    const response = await axios.post(
      `${BASE_URL}${API_ENDPOINTS.ADD_TO_CART}`,
      cartItem,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API Response:", response.data); // Log the API response
    return response.data;
  } catch (error) {
    console.error(
      "Error adding item to cart:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getCartItemsByCustomerId = async (customerId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.GET_CART_ITEMS_BY_CUSTOMER_ID}/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    console.log("API Response:", response.data); // Log the response data
    return response.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};
export const getCheckoutItemsByCustomerId = async (customerId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.GET_CHECKOUT_ITEMS}/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("API Response:", response.data); // Log the response data
    return response.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};
export const createOrder = async (accountId, paymentMethod, completionDate, customerNote) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log("Creating order for account ID:", accountId);
    console.log("API URL:", `${BASE_URL}${API_ENDPOINTS.CREATE_ORDER}/${accountId}`);

    const requestBody = {
     
      expectedCompletionDate: completionDate,
      note: customerNote
    };

    const response = await axios.post(
      `${BASE_URL}${API_ENDPOINTS.CREATE_ORDER}?customerId=${accountId}`,
      requestBody,  // Replace empty object with our new request body
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating order:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getCartItems = async (accountId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.GET_CART_ITEMS}/${accountId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log("Fetching all orders");
    console.log("API URL:", `${BASE_URL}${API_ENDPOINTS.GET_ALL_ORDERS}`);
    console.log("Token:", token);

    const response = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.GET_ALL_ORDERS}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching all orders:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.GET_ORDER_BY_ID}/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw error;
  }
};

export const updateItemStatus = async (cartId, selected) => {
  try {
    const token = localStorage.getItem("accessToken");
    // Remove the BASE_URL from here since it's already included in the constant
    const url = `${API_ENDPOINTS.UPDATE_ITEM_STATUS}/${cartId}/${selected}`;
    console.log("Updating item status. Full URL:", `${BASE_URL}${url}`);
    console.log("Token:", token);

    const response = await axios.put(`${BASE_URL}${url}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Update item status response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating item status:",
      error.response ? error.response.data : error.message
    );
    console.error("Full error object:", error);
    throw error;
  }
};

export const deleteCartItem = async (cartItemId) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log("Deleting cart item with ID:", cartItemId);
    console.log("API URL:", `${BASE_URL}${API_ENDPOINTS.DELETE_CART_ITEM}/${cartItemId}`);

    const response = await axios.delete(
      `${BASE_URL}${API_ENDPOINTS.DELETE_CART_ITEM}/${cartItemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting cart item:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const createTaskForStaff = async (tasksData) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log(
      "Creating tasks for staff:",
      JSON.stringify(tasksData, null, 2)
    );
    console.log("API URL:", `${BASE_URL}${API_ENDPOINTS.CREATE_TASK}`);

    const response = await axios.post(
      `${BASE_URL}${API_ENDPOINTS.CREATE_TASK}`,
      tasksData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error(
        "Detailed error response:",
        JSON.stringify(error.response.data, null, 2)
      );
    }
    console.error(
      "Error creating tasks for staff:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Add this new function to fetch tasks by account ID
export const getTasksByAccountId = async (accountId) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log(`Fetching tasks for account ID: ${accountId}`);
    console.log(
      "API URL:",
      `${BASE_URL}${API_ENDPOINTS.GET_TASKS_BY_ACCOUNT}/${accountId}`
    );

    const response = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.GET_TASKS_BY_ACCOUNT}/${accountId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching tasks for account:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Add this new function to update task status
export const updateTaskStatus = async (taskId, newStatus) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log(
      `Updating task status for task ID: ${taskId} to status: ${newStatus}`
    );
    console.log(
      "API URL:",
      `${BASE_URL}${API_ENDPOINTS.UPDATE_TASK_STATUS}/${taskId}/status/${newStatus}`
    );

    const response = await axios.put(
      `${BASE_URL}${API_ENDPOINTS.UPDATE_TASK_STATUS}/${taskId}/status/${newStatus}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating task status:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// You can add more API functions here as needed

export const getTaskById = async (taskId) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log("Fetching task with ID:", taskId); // Debug log
    const response = await axios.get(`${BASE_URL}/Task/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("API response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error("Error fetching task details:", error);
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error(
          "You do not have permission to access this task. Please check your authentication."
        );
      } else {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
        if (error.response.headers["content-type"]?.includes("text/plain")) {
          throw new Error(`Server error: ${error.response.data}`);
        } else {
          throw new Error(
            "An error occurred while fetching the task. Please try again later."
          );
        }
      }
    } else if (error.request) {
      console.error("Error request:", error.request);
      throw new Error(
        "Unable to reach the server. Please check your internet connection."
      );
    } else {
      console.error("Error message:", error.message);
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
};

export const getOrdersByAccountId = async (accountId) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log(`Fetching orders for account ID: ${accountId}`);
    console.log(
      "API URL:",
      `${BASE_URL}${API_ENDPOINTS.GET_ALL_ORDERS_BY_ACCOUNT_ID}/${accountId}`
    );

    const response = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.GET_ALL_ORDERS_BY_ACCOUNT_ID}/${accountId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching orders for account:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Add this new function to your existing API.js file

export const updateTaskStatusWithImages = async (taskId, imageUrls) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log(`Updating task images for task ID: ${taskId}`);
    console.log("API URL:", `${BASE_URL}/Task/tasks/${taskId}/images`);

    const response = await axios.put(
      `${BASE_URL}/Task/tasks/${taskId}/images`,
      { urlImages: imageUrls },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating task images:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Add this new function to your API.js file
export const searchGraves = async (searchParams) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log("Searching graves with params:", searchParams);
    
    const queryParams = new URLSearchParams({
      Name: searchParams.name || '',
      YearOfBirth: searchParams.birthYear || '',
      YearOfSacrifice: searchParams.deathYear || '',
      HomeTown: searchParams.hometown || ''
    }).toString();

    const url = `${BASE_URL}/MartyrGrave/search?${queryParams}`;
    console.log("API URL:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error searching graves:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getGraveById = async (martyrId) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log(`Fetching grave details for ID: ${martyrId}`);
    const response = await axios.get(`${BASE_URL}/MartyrGrave/${martyrId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching grave details:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getAllServices = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log("Fetching all services");
    console.log("API URL:", `${BASE_URL}${API_ENDPOINTS.GET_ALL_SERVICES}`);

    const response = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.GET_ALL_SERVICES}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching all services:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const registerGuestAccount = async (registrationData) => {
  try {
    const response = await fetch(`${BASE_URL}/Auth/register-account-guest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      // If the response is JSON, parse it
      const data = await response.json();
      return { success: true, data };
    } else {
      // If the response is not JSON, treat it as plain text
      const text = await response.text();
      return { success: true, message: text };
    }
  } catch (error) {
    console.error('Error in registerGuestAccount:', error);
    return { success: false, error: error.message };
  }
};

// Add new function to fetch order details
export const getOrderDetails = async (orderId, accountId) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log(`Fetching order details for ID: ${orderId} and accountId: ${accountId}`);
    
    const response = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.GET_ORDER_DETAILS}/${orderId}?customerId=${accountId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log("Order details API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};

// Add this new function to get all staff
export const getAllStaff = async (page = 1, pageSize = 10, areaId) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log("Fetching all staff");
    console.log("API URL:", `${BASE_URL}${API_ENDPOINTS.GET_ALL_STAFF}`);

    const response = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.GET_ALL_STAFF}?page=${page}&pageSize=${pageSize}&areaId=${areaId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Staff API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching staff:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Add this new function
export const updateAccountStatus = async (accountId) => {
    try {
        const token = localStorage.getItem("accessToken");
        console.log(`Updating status for account ID: ${accountId}`);
        
        const response = await axios.put(
            `${BASE_URL}${API_ENDPOINTS.UPDATE_ACCOUNT_STATUS}/${accountId}`,
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

export const  getAllGraves = async (page = 1, pageSize = 5) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log("Fetching graves with pagination");
    
    const response = await axios.get(
      `${BASE_URL}/MartyrGrave?page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log("Graves API Response:", response.data);
    return response.data; // This should return the object with graveList and totalPage
  } catch (error) {
    console.error(
      "Error fetching graves:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};


export const getAllBlogs = async (pageIndex = 1, pageSize = 4) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log(`Fetching blogs - Page ${pageIndex}, Size ${pageSize}`);
    
    const response = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.GET_ALL_BLOGS}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log("Blogs API Response:", response.data);
    return response.data; // Returns { message, data: [...blogs], totalPage }
  } catch (error) {
    console.error(
      "Error fetching blogs:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};


export const getBlogCategories = async (pageIndex = 1, pageSize = 4) => {
  try {
    const response = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.GET_BLOG_CATEGORIES}?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    console.log("Blog Categories API Response:", response.data);
    return response.data; // Returns { message, data: [...categories], totalPage }
  } catch (error) {
    console.error(
      "Error fetching blog categories:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getBlogById = async (blogId) => {
  try {
    const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.GET_BLOG_BY_ID}/${blogId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog details:", error);
    throw error;
  }
};

export const postComment = async (blogId, content) => {
  const accessToken = localStorage.getItem('accessToken');
  
  try {
    const response = await axios.post(
      `${BASE_URL}${API_ENDPOINTS.POST_COMMENT}`,
      {
        blogId,
        content
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error;
  }
};

export const postCommentIcon = async (commentId, iconId) => {
  const accessToken = localStorage.getItem('accessToken');

  try {
    const response = await axios.post(
      `${BASE_URL}${API_ENDPOINTS.POST_COMMENT_ICON}?commentId=${commentId}&iconId=${iconId}`,
      {},  // empty body
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error posting comment icon:", error);
    throw error;
  }
};

export const updateComment = async (commentId, content) => {
  const accessToken = localStorage.getItem('accessToken');
  const decodedToken = jwtDecode(accessToken);
  const accountId = decodedToken.accountId;

  try {
    const response = await axios.put(
      `${BASE_URL}/Comment/${commentId}?accountId=${accountId}`,
      { content },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

export const updateCommentIcon = async (id, iconId) => {
  const accessToken = localStorage.getItem('accessToken');
  
  try {
    const response = await axios.put(
      `${BASE_URL}/CommentIcon/${id}`,
      {
        "iconId": iconId
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating comment icon:", error);
    throw error;
  }
};

// Thêm API xóa comment icon
export const deleteCommentIcon = async (id) => {
  const accessToken = localStorage.getItem('accessToken');
  
  try {
    console.log('Deleting comment icon with ID:', id);
    const response = await axios.delete(
      `${BASE_URL}/CommentIcon/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    console.log('Delete response:', response);
    return response.data;
  } catch (error) {
    console.error("Error deleting comment icon:", error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  const accessToken = localStorage.getItem('accessToken');
  const decodedToken = accessToken ? JSON.parse(atob(accessToken.split('.')[1])) : null;
  const accountId = decodedToken?.accountId;

  try {
    const response = await axios.delete(
      `${BASE_URL}/Comment/${commentId}?accountId=${accountId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};


export const getBlogCategoryById = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.GET_BLOG_CATEGORY_BY_ID}/${id}`
    );
    console.log("Blog Category Detail Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching blog category details:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};


export const createFeedback = async (feedbackData) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log("Creating feedback:", feedbackData);
    console.log("API URL:", `${BASE_URL}${API_ENDPOINTS.CREATE_FEEDBACK}`);

    const response = await axios.post(
      `${BASE_URL}${API_ENDPOINTS.CREATE_FEEDBACK}`,
      feedbackData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Feedback API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating feedback:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};


export const getTrendingServices = async (topN = 5) => {
  try {
    const response = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.GET_TRENDING_SERVICES}?topN=${topN}`
    );
    console.log("Trending Services API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching trending services:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};


export const getMartyrsByArea = async (areaId, pageIndex = 1, pageSize = 10) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/MartyrGrave/area/${areaId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching martyrs:', error);
    throw error;
  }
};

export const getProfile = async (accountId) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log(`Fetching profile for account ID: ${accountId}`);
    
    const response = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.GET_PROFILE}/${accountId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Profile API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching profile:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const updateProfile = async (accountId, profileData) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log(`Updating profile for account ID: ${accountId}`);
    console.log("Profile update data:", profileData);
    
    const response = await axios.put(
      `${BASE_URL}${API_ENDPOINTS.UPDATE_PROFILE}/${accountId}`,
      {
        fullName: profileData.fullName,
        dateOfBirth: profileData.dateOfBirth,
        address: profileData.address,
        avatarPath: profileData.avatarPath,
        emailAddress: profileData.emailAddress
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Profile update response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating profile:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};


export const changePassword = async (passwordData) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log("Changing password with data:", passwordData);
    
    const response = await axios.put(
      `${BASE_URL}${API_ENDPOINTS.CHANGE_PASSWORD}`,
      passwordData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Change password response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error changing password:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};