import { useLogout } from "../../services/auth/useLogout";

export default function AdminDashboard() {
  const logout = useLogout();

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>
      <div className="dashboard-content">
        {<button onClick={logout}>Logout</button>}
      </div>
    </div>
  );
}
