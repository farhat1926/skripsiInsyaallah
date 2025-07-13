import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js' 
import toast from 'react-hot-toast'
import {io} from 'socket.io-client'
import { useNavigate } from 'react-router-dom';

const isDev = import.meta.env.DEV;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SOCKET_BASE_URL = import.meta.env.VITE_SOCKET_BASE_URL;


const BASE_URL = isDev
  ? "http://localhost:5001"
  : "https://skripsiinsyaallah-production.up.railway.app/api";

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket:null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket()
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            get().connectSocket()
        } catch (error) {
            console.error("Signup error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            console.log("LOGIN RESPONSE:", res.data); 
            set({ authUser: res.data });
            toast.success("Logged in successfully");
            
            get().connectSocket()
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/updateProfile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Error in update profile:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    logout: async () => {
  try {
    await axiosInstance.post("/auth/logout");
    set({ authUser: null });
    toast.success("Logout success");

    get().disconnectSocket();
  } catch (error) {
    toast.error(error.response?.data?.message || "Logout failed");
  }
},

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
        console.log("Connecting socket with userId:", authUser?._id);
       const socket = io(SOCKET_BASE_URL, {
  auth: { userId: authUser._id },
  transports: ['websocket'],
  withCredentials: true,
  path: '/socket.io',
});


    
        socket.on("connect", () => {
            console.log("Connected to socket server:", socket.id);
        });
    
        socket.on("disconnect", () => {
            console.log("Disconnected from socket server");
        });
    
        set({ socket });

        socket.on("getOnlineUsers",(userIds) =>{
            console.log("Online users:", userIds);
            set({onlineUsers:userIds})
        })
    },
    
    disconnectSocket: () => {
        if (get().socket) {
            get().socket.disconnect();
            set({ socket: null });
        }
    }
    
}));
