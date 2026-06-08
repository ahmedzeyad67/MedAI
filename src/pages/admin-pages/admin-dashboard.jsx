import { useEffect, useState } from "react";
import { useAuth } from "../../services/auth/useAuth";
import { getAdminStats } from "../../services/api";
import { Input, Spin, Table } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Navbar from "../../components/navbar";
import PrivateHero from "../../components/private-hero";
import bannerSvg from "@/assets/icons/admin-banner.svg";
import BreakdownCard from "../../components/admin-dashboard-components/breakdown-card";
import { adminStatCards } from "../../config/dashboardConfig";
import CalendarIcon from "@/assets/icons/calendar.svg?react";
import AIAnalysisIcon from "@/assets/icons/ai-analysis.svg?react";
import DoctorsTable from "../../components/admin-dashboard-components/doctors-table";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [adminStats, setAdminStats] = useState({});

  useEffect(() => {
    const loadAdminStats = async () => {
      try {
        const stats = await getAdminStats();
        setAdminStats(stats);
      } catch (error) {
        console.error("Failed to load admin stats:", error);
      }
    };

    loadAdminStats();
  }, []);

  const stats = adminStatCards.map((card) => ({
    ...card,
    value: adminStats[card.key]?.total,
  }));
  const statsList = stats.map((stat) => (
    <div key={stat.key} className="admin-stat-card">
      <div>
        <stat.icon className="stat-icon" style={{ color: stat.color }} />
        <p className="label">{stat.label}</p>
      </div>
      <h1 className="value">{stat.value}</h1>
    </div>
  ));

  const breakdownCards = [
    {
      key: "bookings",
      title: "Bookings Breakdown",
      icon: CalendarIcon,
      data: adminStats["bookings"],
    },
    {
      key: "xrays",
      title: "X-ray Analysis Breakdown",
      icon: AIAnalysisIcon,
      data: adminStats["xrays"],
    },
  ];
  const breakdownCardsList = breakdownCards.map((card) => (
    <BreakdownCard key={card.key} card={card} />
  ));

  return (
    <div className="dashboard-container admin-dashboard">
      {loading ? (
        <Spin className="loading" size="large" />
      ) : (
        <>
          <Navbar user={user} role="admin" />
          <div className="dashboard-content container">
            <PrivateHero
              greeting="Admin control panel"
              title="System Overview"
              subtitle="Manage doctors and track bookings, patients, and X-ray analysis activity."
              banner={bannerSvg}
            />

            <div className="stats-container">{statsList}</div>

            <div className="stats-breakdown-container">
              {breakdownCardsList}
            </div>

            <DoctorsTable />
          </div>
        </>
      )}
    </div>
  );
}
