import { useAuth } from "../../services/auth/useAuth";
import Navbar from "../../components/navbar";
import StatCard from "../../components/stat-card";
import { doctorStatCards } from "../../config/dashboardConfig";
import bannerSvg from "@/assets/icons/banner.svg";

export default function DoctorDashboard() {
  const { user } = useAuth();

  const statCardsList = doctorStatCards.map((card) => (
    <StatCard key={card.label} card={card} />
  ));

  return (
    <div className="dashboard-container">
      <Navbar user={user} role="doctor" />
      <div className="dashboard-content container">
        <div className="hero">
          <div className="hero-pattern"></div>
          <div className="hero-glow--1"></div>
          <div className="hero-glow--2"></div>
          <div className="hero-content">
            <div className="hero-text">
              <div className="greeting">
                <span></span> Good Morning Dr. {user?.firstName}{" "}
                {user?.lastName}
              </div>
              <div className="title">Doctor Dashboard</div>
              <div className="subtitle">
                You have 3 pending analyses to review and 3 appointments today.
              </div>
            </div>
            <div className="hero-decoration--right">
              <img src={bannerSvg} alt="Banner decoration" />
            </div>
          </div>
        </div>

        <div className="stats-container">{statCardsList}</div>
      </div>
    </div>
  );
}
