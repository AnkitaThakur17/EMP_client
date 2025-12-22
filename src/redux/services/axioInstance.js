import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.1.86:3300",
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
