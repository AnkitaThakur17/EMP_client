import axiosInstance from "./axioInstance";
import { getErrorMessage } from "../../../utils/errorCodes";

const URL = import.meta.env.VITE_URL;
const PORT = import.meta.env.VITE_PORT;

const API_URL = `http://${URL}:${PORT}/attendance`;

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
const allAttendance = async ({ pageNo, limit, search, teamFilter, userFilter, startDate, endDate, statusFilter, isLateList }) => {
  try {
    const response = await axiosInstance.get("/attendance/allAttendance", {
      params: {
        pageNo,
        limit,
        search,
        teamFilter,
        userFilter,
        startDate,
        endDate,
        statusFilter,
        isLateList
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
}

const updateAttendanceService = async(attendanceId, userData)=>{
  try {
    const response = await axiosInstance.put(
        `${API_URL}/updateAttendance/${attendanceId}`,
       userData
    )
    return {
      status: response.status,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
  handleError(error);
  throw error;
}
  }

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

export default { punchIn, punchOut, myAttendance, allAttendance, updateAttendanceService };