import { getErrorMessage } from "../../../utils/errorCodes";
import axiosInstance from "./axioInstance";

const API_URL = "http://192.168.1.86:3300/user/admin";

//create employee
const createEmployee = async (employeeData, token) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/createEmployee`,
      employeeData,
      {
        headers: {
          ...baseHeaders,
          "access-token": token,
        },
      }
    );

    return {
      status: response.status,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    if (error.response) {
      const backendCode = error.response.data.code;
      const finalMsg = getErrorMessage(backendCode);

      throw {
        code: backendCode,
        message: finalMsg,
        status: error.response.status,
        data: error.response.data.data || null,
      };
    }

    if (error.request) {
      throw { code: 0, message: "No response from server" };
    }

    throw { code: 0, message: error.message || "An error occurred" };
  }
};

// get employees
const getEmployees = async () => {
  try {
    const response = await axiosInstance.get(
      "/user/admin/getEmployees"
    );

    return {
      status: response.status,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    if (error.response) {
      const backendCode = error.response.data.code;
      throw {
        code: backendCode,
        message: getErrorMessage(backendCode),
        status: error.response.status,
        data: error.response.data.data || null,
      };
    }

    if (error.request) {
      throw { code: 0, message: "No response from server" };
    }

    throw { code: 0, message: error.message || "An error occurred" };
  }
}

//get employee
const getEmployee = async (userId, token) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/getEmployee/${userId}`, {
      headers: {
        ...baseHeaders,
        "access-token": token,
      },
    });
    return {
      status: response.status,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    if (error.response) {
      const backendCode = error.response.data.code;
      const finalMsg = getErrorMessage(backendCode);

      throw {
        code: backendCode,
        message: finalMsg,
        status: error.response.status,
        data: error.response.data.data || null,
      };
    }

    if (error.request) {
      throw { code: 0, message: "No response from server" };
    }

    throw { code: 0, message: error.message || "An error occurred" };
  }
};

export default { createEmployee, getEmployees, getEmployee };
