import AnalysisIcon from "@/assets/icons/analysis.svg?react";
import PendingIcon from "@/assets/icons/pending.svg?react";
import ApprovedIcon from "@/assets/icons/approved.svg?react";
import CalendarIcon from "@/assets/icons/calendar.svg?react";
import SlotsIcon from "@/assets/icons/slots.svg?react";
import DoctorIcon from "@/assets/icons/doctor.svg?react";
import PatientsIcon from "@/assets/icons/users.svg?react";
import CancelledIcon from "@/assets/icons/cancelled.svg?react";
import EditIcon from "@/assets/icons/edit.svg?react";

export const patientStatCards = [
  {
    key: "totalAnalyses",
    label: "Total Analyses",
    value: "3",
    description: "All time scans",
    icon: AnalysisIcon,
    color: "rgb(59, 130, 246)",
  },

  {
    key: "pendingAnalysis",
    label: "Pending Analysis",
    value: "2",
    description: "Awaiting doctor review",
    icon: PendingIcon,
    color: "rgb(217, 119, 6)",
  },

  {
    key: "completedAnalysis",
    label: "Completed Analysis",
    value: "1",
    description: "Reviewed by experts",
    icon: ApprovedIcon,
    color: "rgb(5, 150, 105)",
  },

  {
    key: "find-doctors",
    label: "Find Doctors",
    subLabel: "Browse & Book",
    description: "View profile & reviews",
    icon: DoctorIcon,
    color: "rgb(8, 145, 178)",
    link: "/doctors",
  },
];

export const doctorStatCards = [
  {
    key: "pendingReviews",
    label: "Pending Reviews",
    value: "3",
    description: "Awaiting your review",
    icon: PendingIcon,
    color: "rgb(217, 119, 6)",
  },

  {
    key: "reviewedToday",
    label: "Reviewed Today",
    value: "1",
    description: "Analyses you reviewed",
    icon: ApprovedIcon,
    color: "rgb(5, 150, 105)",
  },

  {
    key: "todayAppointments",
    label: "Today Appointments",
    value: "2",
    description: "Scheduled for today",
    icon: CalendarIcon,
    color: "rgb(59, 130, 246)",
  },

  {
    key: "availability",
    label: "Availability",
    subLabel: "Manage Slots",
    description: "Set your Schedule",
    icon: SlotsIcon,
    color: "rgb(8, 145, 178)",
    link: "/availability",
  },
];

export const adminStatCards = [
  {
    key: "doctors",
    icon: DoctorIcon,
    color: "rgb(127 34 254)",
    label: "Doctors",
  },
  {
    key: "patients",
    icon: PatientsIcon,
    color: "rgb(59, 130, 246)",
    label: "Patients",
  },
  {
    key: "bookings",
    icon: CalendarIcon,
    color: "rgb(217, 119, 6)",
    label: "Bookings",
  },
  {
    key: "xrays",
    icon: AnalysisIcon,
    color: "rgb(5, 150, 105)",
    label: "X-Rays",
  },
];

export const statsBreakdownIcons = {
  upcoming: { icon: PendingIcon, color: "rgb(217, 119, 6)" },
  pending: { icon: PendingIcon, color: "rgb(217, 119, 6)" },
  completed: { icon: ApprovedIcon, color: "rgb(5, 150, 105)" },
  approved: { icon: ApprovedIcon, color: "rgb(5, 150, 105)" },
  cancelled: { icon: CancelledIcon, color: "rgb(239, 68, 68)" },
  edited: { icon: EditIcon, color: "rgb(59, 130, 246)" },
};
