import axios from "axios";
import { getErrorMessage } from "../../../utils/errorCodes";

const API_URL = "http://192.168.1.72:3300/attendance";

const baseHeaders = {
  "api-key": "NtE]yUS%tF7eqAePNT6|WWlQxhJQNgb8,)M*|y8y59HkAv6nZs",
  "device-id": "12345",
  "device-token": "abcxyz",
  "device-type": "android",
  "Content-Type": "application/json",
};

const punchIn = async (punchInData, token) => {
  try {
    const response = await axios.post(`${API_URL}/punchIn`, punchInData, {
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

//punchOut
const punchOut = async( punchOutData, token)=>{
try {

   const response = await axios.post(`${API_URL}/punchOut`, punchOutData, {
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

}

export default { punchIn, punchOut }