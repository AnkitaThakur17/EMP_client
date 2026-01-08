import { getErrorMessage } from "../../../utils/errorCodes";
import axiosInstance from "./axioInstance";

const URL = import.meta.env.VITE_URL;
const PORT = import.meta.env.VITE_PORT;

const API_URL = `http://${URL}:${PORT}/user/admin`;

//  CREATE EMPLOYEE 
const createEmployee = async (employeeData) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/createEmployee`,
      employeeData
    );

    return {
      status: response.status,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    handleError(error);
  }
};

/*GET EMPLOYEES*/
const getEmployees = async ({ pageNo, limit, search, teamFilter }) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/getEmployees`,
      {
        params: {
          pageNo,
          limit,
          search,
          teamFilter,
        },
      }
    );

    return {
      status: response.status,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    handleError(error);
  }
};

/* GET SINGLE EMPLOYEE */
const getEmployee = async (userId) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/getEmployee/${userId}`
    );

    return {
      status: response.status,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    handleError(error);
  }
};

//Update Employee
const updateEmployee = async(userId, userData)=>{
  try {
    const response = await axiosInstance.put(
      `${API_URL}/updateEmployee/${userId}`,
       userData
    )
    return {
      status: response.status,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    handleError(error);
  }  
  }


/* COMMON ERROR HANDLER*/
const handleError = (error) => {
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
};

export default {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee
};

