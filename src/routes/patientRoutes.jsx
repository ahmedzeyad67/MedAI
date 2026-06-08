import { Routes, Route, Navigate } from "react-router-dom";
import PatientDashboard from "../pages/patient-pages/patient-dashboard";
import AppointmentsPage from "../pages/appointments-page";
import XrayAnalysisPage from "../pages/xray-analysis-page";
import XrayAnalysisDetailsPage from "../components/patient-dashboard-components/xray-analysis-details-page";

export default function PatientRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<PatientDashboard />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/xray-analysis" element={<XrayAnalysisPage />} />
      <Route path="/xray-analysis/:id" element={<XrayAnalysisDetailsPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
