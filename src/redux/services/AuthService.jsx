import axiosInstance from "./axioInstance";
import { getErrorMessage } from "../../../utils/errorCodes";

// LOGIN
const login = async (email, password) => {
  try {
    const response = await axiosInstance.post("/user/login", {
      email,
      password,
    });

    return {
      status: response.status,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    if (error.response) {
      const code = error.response.data.code;
      throw {
        code,
        message: getErrorMessage(code),
        status: error.response.status,
      };
    }
    throw { code: 0, message: "Server not responding" };
  }
};

// LOGOUT
const logout = async () => {
  try {
    const response = await axiosInstance.post("/user/logout");
    return response.data;
  } catch (error) {
    throw { message: "Logout failed" };
  }
};

export default { login, logout };