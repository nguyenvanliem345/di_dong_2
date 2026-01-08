const BASE_URL = "https://api-railway-production-0c51.up.railway.app/api";

export const API_CONFIG = {
  BASE_URL,
  USERS: `${BASE_URL}/users`,
  PRODUCTS: `${BASE_URL}/products`,
  SLIDESHOWS: `${BASE_URL}/slideShows`,
  CATEGORIES: `${BASE_URL}/categories`, // Đảm bảo dòng này tồn tại
  IMAGE_URL: (resource: string, fileName: string) => 
    `${BASE_URL}/image/${resource}/${fileName}`,
};