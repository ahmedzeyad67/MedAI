import {
  CalendarOutlined,
  ClockCircleOutlined,
  DotChartOutlined,
  HomeOutlined,
  TeamOutlined,
} from "@ant-design/icons";

export const navLinksByRole = {
  patient: [
    { label: "Home", path: "/dashboard", icon: HomeOutlined },
    { label: "Doctors", path: "/doctors", icon: TeamOutlined },
    { label: "Appointments", path: "/appointments", icon: CalendarOutlined },
    { label: "AI Analysis", path: "/ai-analysis", icon: DotChartOutlined },
  ],
  doctor: [
    { label: "Home", path: "/dashboard", icon: HomeOutlined },
    { label: "AI Analysis", path: "/ai-analysis", icon: DotChartOutlined },
    { label: "Appointments", path: "/appointments", icon: CalendarOutlined },
    { label: "Availability", path: "/availability", icon: ClockCircleOutlined },
  ],
  admin: [
    { label: "Home", path: "/dashboard", icon: HomeOutlined },
    { label: "Doctors", path: "/doctors", icon: TeamOutlined },
    { label: "Appointments", path: "/appointments", icon: CalendarOutlined },
  ],
};
