// const BASE_URL = "https://api-railway-production-0c51.up.railway.app/api";

// export const API_CONFIG = {
//   BASE_URL,
//   USERS: `${BASE_URL}/users`,
//   PRODUCTS: `${BASE_URL}/products`,
//   SLIDESHOWS: `${BASE_URL}/slideShows`,
//   CATEGORIES: `${BASE_URL}/categories`, // Đảm bảo dòng này tồn tại
//   IMAGE_URL: (resource: string, fileName: string) => 
//     `${BASE_URL}/image/${resource}/${fileName}`,
// };

// Thay link Railway cũ bằng link Render mới
// const BASE_URL = "https://api-railway-o9b0.onrender.com/api";

// export const API_CONFIG = {
//   BASE_URL,
//   USERS: `${BASE_URL}/users`,
//   PRODUCTS: `${BASE_URL}/products`,
//   SLIDESHOWS: `${BASE_URL}/slideShows`,
//   CATEGORIES: `${BASE_URL}/categories`, 
//   IMAGE_URL: (resource: string, fileName: string) => 
//     `${BASE_URL}/image/${resource}/${fileName}`,
// };

// apiConfig.ts
const BASE_URL = "http://localhost:8080/api";

export const API_CONFIG = {
    BASE_URL,
    USERS: `${BASE_URL}/users`,
    PRODUCTS: `${BASE_URL}/products`,
    SLIDESHOWS: `${BASE_URL}/slideShows`,
    CATEGORIES: `${BASE_URL}/categories`,
    ORDERS: `${BASE_URL}/orders`,
    
    // Hàm này giúp lấy URL ảnh giống hệt logic trong Admin dataProvider
    IMAGE_URL: (resource: string, fileName: string) => 
        `${BASE_URL}/image/${resource}/${fileName}`,
};