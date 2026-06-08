import { useState } from "react";
import {
  CloseOutlined,
  MedicineBoxOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { navLinksByRole } from "../config/navConfig";
import ProfileDropdown from "./profile-dropdown";

export default function Navbar({ user, role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navLinks = navLinksByRole[role] || null;
  const navLinksList = navLinks?.map((link, index) => (
    <button
      key={index}
      onClick={() => navigate(link.path)}
      className={location.pathname === link.path ? "selected" : ""}
    >
      {link.icon && <link.icon style={{ marginRight: 6 }} />}
      {link.label}
    </button>
  ));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogoClick = () => {
    if (role) navigate("/dashboard");
    else navigate("/");
  };

  return (
    <div
      className={`navbar ${role ? "private" : "public"} ${isDrawerOpen ? "drawer-open" : ""}`}
    >
      <div className="navbar-container">
        <div className="navbar-logo" onClick={handleLogoClick}>
          <div className="icon">
            <MedicineBoxOutlined />
          </div>
          <p className="text">MediScan</p>
          {role && role !== "patient" && (
            <span className="role-badge">{role}</span>
          )}
        </div>
        <div className="nav-right">
          {navLinksList && <div className="nav-links">{navLinksList}</div>}
          <div className="navbar-actions">
            {role ? (
              <>
                <ProfileDropdown user={user} />
                {navLinksList && (
                  <button
                    className="toggle-drawer-btn"
                    onClick={() => setIsDrawerOpen((prev) => !prev)}
                  >
                    {isDrawerOpen ? <CloseOutlined /> : <MenuOutlined />}
                  </button>
                )}
              </>
            ) : (
              <>
                <button type="text-btn" onClick={() => navigate("/login")}>
                  Sign In
                </button>
                <button type="btn" onClick={() => navigate("/signup")}>
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {navLinksList && (
        <div className={`mobile-menu ${isDrawerOpen ? "open" : ""}`}>
          <div className="nav-links">{navLinksList}</div>
        </div>
      )}
    </div>
  );
}
