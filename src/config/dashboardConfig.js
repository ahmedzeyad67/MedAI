import AnalysisIcon from "@/assets/icons/analysis.svg?react";
import PendingIcon from "@/assets/icons/pending.svg?react";
import ApprovedIcon from "@/assets/icons/approved.svg?react";
import { CalendarOutlined, TeamOutlined } from "@ant-design/icons";

export const patientStatCards = [
  {
    label: "Total Analyses",
    value: "3",
    description: "All time scans",
    icon: AnalysisIcon,
    color: "rgb(59, 130, 246)",
  },

  {
    label: "Pending Review",
    value: "2",
    description: "Awaiting doctor",
    icon: PendingIcon,
    color: "rgb(217, 119, 6)",
  },

  {
    label: "Approved",
    value: "1",
    description: "Completed reviews",
    icon: ApprovedIcon,
    color: "rgb(5, 150, 105)",
  },

  {
    label: "Find Doctors",
    value: "Browse & Book",
    description: "View profile & reviews",
    icon: TeamOutlined,
    color: "rgb(8, 145, 178)",
    link: "/doctors",
  },
];

export const doctorStatCards = [
  {
    label: "Pending Reviews",
    value: "3",
    description: "Awaiting your review",
    icon: PendingIcon,
    color: "rgb(217, 119, 6)",
  },

  {
    label: "Today Appointments",
    value: "2",
    description: "Scheduled for today",
    icon: CalendarOutlined,
    color: "rgb(59, 130, 246)",
  },

  {
    label: "Approved Today",
    value: "1",
    description: "Analyses you approved",
    icon: ApprovedIcon,
    color: "rgb(5, 150, 105)",
  },

  {
    label: "Availability",
    value: "Manage Slots",
    description: "Set your Schedule",
    icon: PendingIcon,
    color: "rgb(8, 145, 178)",
    link: "/availability",
  },
];
