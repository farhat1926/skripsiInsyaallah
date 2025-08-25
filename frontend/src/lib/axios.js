// lib/axios.js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://klinikweiku.com/api", 
  withCredentials: true, 
});
