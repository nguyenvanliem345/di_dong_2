// const BASE_URL = "http://192.168.1.107:5025";

// export const API_CONFIG = {
//   BASE_URL: BASE_URL,
//   REGISTER: `${BASE_URL}/api/users`,
//   LOGIN: `${BASE_URL}/api/auth/login`,
//   USERS: `${BASE_URL}/api/users`,
//   PRODUCTS: `${BASE_URL}/api/Product`,
//   CATEGORIES: `${BASE_URL}/api/Category`,
//   BRANDS: `${BASE_URL}/api/Brand`, // Thêm dòng này cho đồng bộ
//   CART_ADD: `${BASE_URL}/api/cart/add`,

//   // Cập nhật hàm IMAGE_URL để hỗ trợ thêm 'brands'
//   IMAGE_URL: (type: "products" | "categories" | "brands", fileName: string) => {
//     if (!fileName || fileName === "null" || fileName.trim() === "") {
//       return "https://via.placeholder.com/400";
//     }
//     if (fileName.startsWith("http")) return fileName;

//     // Xác định folder dựa trên type
//     let folder = "product";
//     if (type === "categories") folder = "category";
//     if (type === "brands") folder = "brand"; // <-- Thêm logic này

//     return `${BASE_URL}/uploads/${folder}/${fileName}`;
//   },
// };
const BASE_URL = "http://10.18.4.178:5025";

export const API_CONFIG = {
  BASE_URL: BASE_URL,

  REGISTER: `${BASE_URL}/api/users`,
  LOGIN: `${BASE_URL}/api/auth/login`,
  USERS: `${BASE_URL}/api/users`,
  PRODUCTS: `${BASE_URL}/api/Product`,
  CATEGORIES: `${BASE_URL}/api/Category`,
  BRANDS: `${BASE_URL}/api/Brand`,
  CART_ADD: `${BASE_URL}/api/cart/add`,

  // 🔥 THÊM MOMO
  MOMO_PAY: `${BASE_URL}/api/payment/momo`,

  IMAGE_URL: (type: "products" | "categories" | "brands", fileName: string) => {
    if (!fileName || fileName === "null" || fileName.trim() === "") {
      return "https://via.placeholder.com/400";
    }
    if (fileName.startsWith("http")) return fileName;

    let folder = "product";
    if (type === "categories") folder = "category";
    if (type === "brands") folder = "brand";

    return `${BASE_URL}/uploads/${folder}/${fileName}`;
  },
};
