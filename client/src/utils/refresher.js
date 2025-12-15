import axios from "axios";

const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(`${baseUrl}/refresh-token`, {}, {
      withCredentials: true,
    });

    if (response.data && response.data.success) {
      return response.data.success;
    }
    return null;
  } catch (err) {
    return null;
  }
};
