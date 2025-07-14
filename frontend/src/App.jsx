import Navbar from "./components/Navbar";
import { Loader } from "lucide-react";

import HomePage from "./pages/HomePage"; 
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import MedicalUpPage from "./pages/medicalChekup"; 
import HistoryPage from "./pages/HistoryPage";
import { Toaster } from "react-hot-toast";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { useChatStore } from "./store/useChatStore";
import { useThemeStore } from "./store/useThemeStore";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


import AddFormCRUD from "./pages/PatientPage";
import AddData from "./components/AddData";
import EditData from "./components/UbahData"; // Pastikan ini sesuai dengan path yang benar

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
    const subscribeToMessage = useChatStore((state) => state.subscribeToMessage);
  const unSubscribeFromMessage = useChatStore((state) => state.unSubscribeFromMessage);

  console.log({ onlineUsers });

  useEffect(() => {
  checkAuth();
}, [checkAuth]);

useEffect(() => {
  if (!authUser) return; // Tunggu authUser tersedia

  subscribeToMessage();

  return () => {
    unSubscribeFromMessage();
  };
}, [authUser]); // ✅ Trigger hanya ketika authUser tersedia


  console.log({ authUser });
  
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-8 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <MedicalUpPage /> : <Navigate to="/login" />} />
        <Route path="/HomePage" element={authUser ? <HomePage /> : <Navigate to="/HomePage" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/patient" element={<AddFormCRUD />} />
        <Route path="/addData" element={<AddData />} />
        <Route path="/editData/:id" element={<EditData />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
       <ToastContainer />
      <Toaster />
    </div>
  );
};

export default App;
