import HomeIcon from "@/assets/icons/home.svg?react";
import DoctorIcon from "@/assets/icons/doctor.svg?react";
import CalendarIcon from "@/assets/icons/calendar.svg?react";
import ClockIcon from "@/assets/icons/pending.svg?react";
import XrayAnalysisIcon from "@/assets/icons/ai-analysis.svg?react";

export const navLinksByRole = {
  patient: [
    { label: "Home", path: "/dashboard", icon: HomeIcon },
    { label: "Doctors", path: "/doctors", icon: DoctorIcon },
    { label: "Appointments", path: "/appointments", icon: CalendarIcon },
    { label: "X-ray Analysis", path: "/xray-analysis", icon: XrayAnalysisIcon },
  ],
  doctor: [
    { label: "Home", path: "/dashboard", icon: HomeIcon },
    { label: "X-ray Analysis", path: "/xray-analysis", icon: XrayAnalysisIcon },
    { label: "Appointments", path: "/appointments", icon: CalendarIcon },
    { label: "Availability", path: "/availability", icon: ClockIcon },
  ],
};
