import { getCookie } from "@/helper/functions";
import axios from "axios";

// Define your base URL for the API
const BASE_URL = "http://20.213.184.177:3000/tasks/report";
// const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

// Function to get token from localStorage
const getAuthToken = () => {
  const payload = getCookie("payload");
  if (payload) {
    const { accessToken } = JSON?.parse(payload);
    return accessToken;
  } else {
    return "";
  }
};

// Create an Axios instance with default settings
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json", // Set default content type
    Authorization: `Bearer ${getAuthToken()}`, // Add token to headers
  },
});

// Function for GET requests
const getReportAndInvoiceData = async (params) => {
  try {
    // Construct base URL
    let url = `/report?page=${params?.page}&pageSize=${params?.pageSize}`;

    // Append search param only if it exists
    if (params?.search) {
      url += `&search=${params.search}`;
    }

    // const response = await axiosInstance.get(`/report?page=${params?.page}&pageSize=${params?.pageSize}&search=${params?.search}`);
    const response = await axiosInstance.get(url);
    return response.data; // Return response data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const getReportAndInvoiceDataClient = async (params) => {
  try {
    const response = await axiosInstance.post(
      `http://20.213.184.177:3000/tasks/report`,
      { clientname: params?.organizationName }
    );
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const downloadDocument = async (url) => {
  try {
    const response = await axiosInstance.post(
      `http://portal.powerbandelectrical.com.au/api/download`,
      { fileUrl: url },
      { responseType: "arraybuffer" }
    );
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export {
  getReportAndInvoiceData,
  getReportAndInvoiceDataClient,
  downloadDocument,
};
