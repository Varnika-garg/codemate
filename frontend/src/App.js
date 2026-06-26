import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Practice from "./pages/Practice";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Rooms from "./pages/Rooms";
import RoomPage from "./pages/RoomPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
    path="/rooms"
    element={
        <ProtectedRoute>
            <Rooms />
        </ProtectedRoute>
    }
/>
        <Route path="/dashboard" element={
    <ProtectedRoute>
        <Dashboard />
    </ProtectedRoute>
} />

<Route path="/practice" element={
    <ProtectedRoute>
        <Practice />
    </ProtectedRoute>
} />
<Route
    path="/room/:roomCode"
    element={
        <ProtectedRoute>
            <RoomPage />
        </ProtectedRoute>
    }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;