import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../services/auth/useAuth";

export default function PublicRoute({ element }) {
  const { loading, role } = useAuth();

  if (loading) {
    return <Spin className="loading" size="large" />;
  }

  return role ? <Navigate to="/dashboard" replace /> : element;
}
