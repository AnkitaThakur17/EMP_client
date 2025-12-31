import { getErrorMessage } from "../../../utils/errorCodes";
import axiosInstance from "./axioInstance";
// import env from "react-dotenv";
const URL = import.meta.env.VITE_URL
const PORT = import.meta.env.VITE_PORT

const API_URL = `http://${URL}:${PORT}/user/admin`;

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
const getEmployees = async ({ token, pageNo, limit, search, teamFilter }) => {
  try {
    const response = await axiosInstance.get(
      "/user/admin/getEmployees",
      {
        params: {
          pageNo,   
          limit,
          search,
          teamFilter  
        }
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
};

// const getEmployees = async ({ token, pageNo, limit, search, filters, team }) => {
//   const response = await axiosInstance.get(
//     "/user/admin/getEmployees",
//     {
//       params: {
//         pageNo,
//         limit,
//         search,
//         team,
//         ...filters
//       }
//     }
//   );
// };

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
