import axios from "axios";
const URL = import.meta.env.VITE_URL
const PORT = import.meta.env.VITE_PORT

const API_URL = `http://${URL}:${PORT}`;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "device-id": "12345",
    "device-type": "android",
    "device-token": "abcxyz",
    "api-key": "NtE]yUS%tF7eqAePNT6|WWlQxhJQNgb8,)M*|y8y59HkAv6nZs",
    "Content-Type": "application/json",
  },
});

//auto token attach
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["access-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
