import { Routes, Route, Navigate } from "react-router-dom";
import PatientDashboard from "../pages/patient-pages/patient-dashboard";
import AppointmentsPage from "../pages/appointments-page";

export default function PatientRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<PatientDashboard />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
