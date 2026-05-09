import { useState } from "react";
import { Dropdown, Avatar } from "antd";
import downArrowIcon from "@/assets/icons/down-arrow.svg";
import LogoutIcon from "@/assets/icons/logout.svg?react";
import EditIcon from "@/assets/icons/edit.svg?react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../services/auth/useLogout";

export default function ProfileDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useLogout();

  const handleMenuClick = ({ key }) => {
    if (key === "edit") {
      navigate("/profile");
    } else if (key === "logout") {
      logout();
    }
  };

  const items = [
    {
      key: "header",
      label: (
        <div className="profile-dropdown-header">
          <Avatar size="large" className="avatar">
            {user?.firstName.charAt(0).toUpperCase()}
          </Avatar>
          <div className="info">
            <div className="name">
              {user?.firstName} {user?.lastName}
            </div>
            <p className="email">{user?.email}</p>
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "edit",
      icon: <EditIcon style={{ width: "1rem", height: "stretch" }} />,
      label: "Edit profile",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutIcon style={{ width: "1rem", height: "stretch" }} />,
      label: <span>Sign Out</span>,
      className: "profile-dropdown-signout",
    },
  ];

  return (
    <Dropdown
      menu={{ items, onClick: handleMenuClick }}
      trigger={["click"]}
      placement="bottomRight"
      rootClassName="profile-dropdown-overlay"
      onOpenChange={setIsOpen}
    >
      <div className="profile-dropdown-trigger">
        <Avatar className="avatar">
          {user?.firstName.charAt(0).toUpperCase()}
        </Avatar>
        <span className={`profile-dropdown-arrow ${isOpen ? "open" : ""}`}>
          <img src={downArrowIcon} alt="dropdown-arrow" />
        </span>
      </div>
    </Dropdown>
  );
}
