import axios from "axios";
import { API_CONFIG } from "../apiConfig";

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để log lỗi tập trung
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("📤 Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response OK:", response.status, response.config.url);
    return response;
  },
  (error) => {
    // Phân tích chi tiết lỗi
    console.error("❌ Lỗi Response:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);

export default axiosInstance;
