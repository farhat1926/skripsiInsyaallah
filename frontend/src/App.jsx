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
import EditData from "./components/UbahData";
import ProtectedRoute from "./components/ProtectedRoute"; // ⬅️ import di sini

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
  const subscribeToMessage = useChatStore((state) => state.subscribeToMessage);
  const unSubscribeFromMessage = useChatStore((state) => state.unSubscribeFromMessage);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!authUser) return;
    subscribeToMessage();
    return () => {
      unSubscribeFromMessage();
    };
  }, [authUser]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-8 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <ToastContainer />
      <Toaster />

      {authUser && <Navbar />} {/* ✅ tampilkan navbar hanya jika login */}

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MedicalUpPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/HomePage"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient"
          element={
            <ProtectedRoute>
              <AddFormCRUD />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addData"
          element={
            <ProtectedRoute>
              <AddData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editData/:id"
          element={
            <ProtectedRoute>
              <EditData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        {/* Route terbuka (tanpa login) */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
};

export default App;
