import { getCookie } from '@/helper/functions';
import axios from 'axios';

// Define your base URL for the API
// const BASE_URL = 'http://portal.powerbandelectrical.com.au/api'; 
const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;


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
const getJobsData = async (payload) => {
  try {
    const response = await axiosInstance.post(`/job`, payload);
    return response.data;  // Return response data
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};



export { getJobsData };
