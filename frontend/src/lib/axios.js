import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL:"https://skripsiinsyaallah-production.up.railway.app/api",
    withCredentials:true
})