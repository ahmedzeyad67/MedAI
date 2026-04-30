import { Routes, Route, Navigate } from "react-router-dom";
import DoctorDashboard from "../pages/doctor-pages/doctor-dashboard";

export default function DoctorRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DoctorDashboard />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
