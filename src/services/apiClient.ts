import axios from "axios";
export const apiClient = axios.create({
  baseURL: "https://ecommerce.routemisr.com/api/v1",
  timeout: 20000,
});
