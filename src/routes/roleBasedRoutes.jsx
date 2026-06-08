import AdminRoutes from "./adminRoutes";
import DoctorRoutes from "./doctorRoutes";
import PatientRoutes from "./patientRoutes";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../services/auth/useAuth";

export default function RoleBasedRoutes() {
  const { role } = useAuth();

  if (role === "admin") return <AdminRoutes />;
  if (role === "doctor") return <DoctorRoutes />;
  if (role === "patient") return <PatientRoutes />;

  return <Navigate to="/" replace />;
}
