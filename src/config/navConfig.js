import {
  CalendarOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  TeamOutlined,
} from "@ant-design/icons";

export const navLinksByRole = {
  patient: [
    { label: "Home", path: "/dashboard", icon: HomeOutlined },
    { label: "Doctors", path: "/doctors", icon: TeamOutlined },
    { label: "Appointments", path: "/appointments", icon: CalendarOutlined },
  ],
  doctor: [
    { label: "Home", path: "/dashboard", icon: HomeOutlined },
    { label: "AI Analysis", path: "/ai-analysis", icon: TeamOutlined },
    { label: "Appointments", path: "/appointments", icon: CalendarOutlined },
    { label: "Availability", path: "/availability", icon: ClockCircleOutlined },
  ],
  admin: [
    { label: "Home", path: "/dashboard", icon: HomeOutlined },
    { label: "Doctors", path: "/doctors", icon: TeamOutlined },
    { label: "Appointments", path: "/appointments", icon: CalendarOutlined },
  ],
};
