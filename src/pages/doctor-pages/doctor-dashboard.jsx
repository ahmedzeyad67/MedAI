import { useAuth } from "../../services/auth/useAuth";
import { Spin } from "antd";
import Navbar from "../../components/navbar";
import PrivateHero from "../../components/private-hero";
import bannerSvg from "@/assets/icons/doctor-banner.svg";
import StatCard from "../../components/stat-card";
import { doctorStatCards } from "../../config/dashboardConfig";

export default function DoctorDashboard() {
  const { user, loading } = useAuth();

  const statCardsList = doctorStatCards.map((card) => (
    <StatCard key={card.label} card={card} />
  ));

  return (
    <div className="dashboard-container">
      {loading ? (
        <Spin className="loading" size="large" />
      ) : (
        <>
          <Navbar user={user} role="doctor" />
          <div className="dashboard-content container">
            <PrivateHero
              greeting={`Good Morning, Dr. ${user?.firstName} ${user?.lastName}`}
              title="Doctor Dashboard"
              subtitle="You have 3 pending analyses to review and 3 appointments today."
              banner={bannerSvg}
            />

            <div className="stats-container">{statCardsList}</div>
          </div>
        </>
      )}
    </div>
  );
}
