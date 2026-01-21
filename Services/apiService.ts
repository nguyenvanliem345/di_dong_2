import axiosInstance from "./axiosInstance";

/**
 * Lấy danh sách sản phẩm
 */
export const getProducts = async () => {
  try {
    const response = await axiosInstance.get("/api/products");
    return response.data?.content || response.data;
  } catch (error) {
    console.error("Lỗi Service getProducts:", error);
    throw error;
  }
};

/**
 * Lấy danh sách danh mục sản phẩm
 */
export const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get("/api/categories");
    return response.data?.content || response.data;
  } catch (error) {
    console.error("Lỗi Service fetchCategories:", error);
    throw error;
  }
};

/**
 * Hàm đăng ký người dùng mới
 */
export const registerUser = async (userData: any) => {
  try {
    const formData = new FormData();

    // Đảm bảo Key khớp với UserStoreRequest trong C#
    formData.append("FullName", userData.fullName);
    formData.append("Email", userData.email);
    formData.append("Phone", userData.phone);
    formData.append("Password", userData.password);
    formData.append("Role", userData.role || "customer");

    const response = await axiosInstance.post("/api/User", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi Service registerUser:", error);
    throw error;
  }
};

/**
 * --- ĐÃ SỬA: HÀM ĐĂNG NHẬP CHUẨN ---
 * Gọi vào [HttpPost("login")] của AuthController để lấy mã JWT
 */
export const loginUserByEmail = async (email: string, password: string) => {
  try {
    // Chuyển từ GET sang POST để gửi credentials an toàn
    const response = await axiosInstance.post("/api/Auth/login", {
      email: email,
      password: password,
    });

    // Trả về dữ liệu chứa { token: "..." } từ Backend
    return response.data;
  } catch (error) {
    console.error("Lỗi Service loginUserByEmail:", error);
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết user (Nếu cần dùng sau này)
 */
export const getUserProfile = async (email: string) => {
  try {
    const response = await axiosInstance.get(`/api/User/email/${email}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi Service getUserProfile:", error);
    throw error;
  }
};
