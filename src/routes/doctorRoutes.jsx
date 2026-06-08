import { Routes, Route, Navigate } from "react-router-dom";
import DoctorDashboard from "../pages/doctor-pages/doctor-dashboard";
import AvailabilityPage from "../pages/doctor-pages/availability-page";
import AppointmentsPage from "../pages/appointments-page";
import { useAuth } from "../services/auth/useAuth";
import XrayAnalysisPage from "../pages/xray-analysis-page";
import XrayAnalysisDetailsPage from "../components/doctor-dashboard-components/xray-analysis-details-page";
export default function DoctorRoutes() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      {!user?.isAccountCompleted ? (
        <Route path="*" element={<Navigate to="/profile" replace />} />
      ) : (
        <>
          <Route path="/dashboard" element={<DoctorDashboard />} />
          <Route path="/availability" element={<AvailabilityPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/xray-analysis" element={<XrayAnalysisPage />} />
          <Route
            path="/xray-analysis/:id"
            element={<XrayAnalysisDetailsPage />}
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      )}
    </Routes>
  );
}
