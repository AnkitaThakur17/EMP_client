import axios from "axios";
import { getErrorMessage } from "../../../utils/errorCodes";

const API_URL = "http://192.168.1.72:3300/user";

const baseHeaders = {
  "device-id": "12345",
  "device-type": "android",
  "device-token": "abcxyz",
  "api-key": "NtE]yUS%tF7eqAePNT6|WWlQxhJQNgb8,)M*|y8y59HkAv6nZs",
  "Content-Type": "application/json",
};

//LOGIN
const login = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { email, password },
      { headers: baseHeaders }
    );

    return {
      status: response.status,
      message: response.data.message || "Login successful",
      data: response.data.data || null,
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

//LOGOUT
const logout = async (token) => {
  try {
    const response = await axios.post(
      `${API_URL}/logout`,
      {},
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

export default { login, logout };
