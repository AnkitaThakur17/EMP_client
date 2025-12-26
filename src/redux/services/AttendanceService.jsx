import axiosInstance from "./axioInstance";
import { getErrorMessage } from "../../../utils/errorCodes";

// punchIn
const punchIn = async (punchInData) => {
  try {
    const response = await axiosInstance.post(
      "/attendance/punchIn",
      punchInData
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

// punchOut
const punchOut = async (punchOutData) => {
  try {
    const response = await axiosInstance.post(
      "/attendance/punchOut",
      punchOutData
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

// myAttendance
const myAttendance = async () => {
  try {
    const response = await axiosInstance.get("/attendance/myAttendance");

    return {
      status: response.status,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    handleError(error);
  }
};

// allAttendance
const allAttendance = async ({ pageNo, limit, search, teamFilter, startDate, endDate, statusFilter }) => {
  try {
    const response = await axiosInstance.get("/attendance/allAttendance", {
      params: {
        pageNo,
        limit,
        search,
        teamFilter,
        startDate,
        endDate,
        statusFilter,
      },
    });

    return {
      status: response.status,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    handleError(error);
  }
};

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

export default { punchIn, punchOut, myAttendance, allAttendance };
