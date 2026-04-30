import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../pages/admin-pages/admin-dashboard";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
