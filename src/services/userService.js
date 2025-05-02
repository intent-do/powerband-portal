import { getCookie } from '@/helper/functions';
import axios from 'axios';

// Define your base URL for the API
const BASE_URL = 'http://portal.powerbandelectrical.com.au/api'; 
// const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;


// Function to get token from localStorage
const getAuthToken = () => {
  const payload = getCookie("payload");
  if (payload) {
    const { accessToken } = JSON?.parse(payload);
    return accessToken
  } else {
    return '';
  }
};

// Create an Axios instance with default settings
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',  // Set default content type
    Authorization: `Bearer ${getAuthToken()}`,  // Add token to headers
  },
});

// Function for GET requests
const getUsersData = async (params) => {
  try {

    let url = `/user/list?page=${params?.page}&pageSize=${params?.pageSize}`;

    // Append search param only if it exists
    if (params?.search) {
      url += `&search=${params.search}`;
    }

    // const response = await axiosInstance.get(`/user/list?page=${params?.page}&pageSize=${params?.pageSize}`);
    const response = await axiosInstance.get(url);
    return response.data;  // Return response data
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const getUpdateUsersData = async (payload, editId) => {
    try {
      const response = await axiosInstance.put(`/user/update?userId=${editId}`, payload);
      return response.data;  
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };



const getAddUsersData   = async (payload) => {
  try {
    const response = await axiosInstance.post(`/user`, payload);
    return response.data;  
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};


export { getUsersData ,getUpdateUsersData , getAddUsersData};
