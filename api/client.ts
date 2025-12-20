import axios from "axios";

/**
 * Axios instance configuration.
 *
 * Replace 'https://api.example.com' with your actual API base URL.
 * You can also add default headers, interceptors, etc. here.
 */
const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "https://api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
