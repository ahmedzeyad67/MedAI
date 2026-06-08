import { useEffect, useState } from "react";
import { useAuth } from "../../services/auth/useAuth";
import { Spin } from "antd";
import Navbar from "../../components/navbar";
import PrivateHero from "../../components/private-hero";
import bannerSvg from "@/assets/icons/doctor-banner.svg";
import StatCard from "../../components/stat-card";
import { doctorStatCards } from "../../config/dashboardConfig";
import { getDoctorStats } from "../../services/api";
import { MenuOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DoctorAppointmentCard from "../../components/doctor-dashboard-components/doctor-appointment-card";
import DoctorXrayAnalysisCard from "../../components/doctor-dashboard-components/doctor-xray-analysis-card";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [statsValues, setStatsValues] = useState({});
  const [pendingReviews, setPendingReviews] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const stats = doctorStatCards.map((card) => ({
    ...card,
    value: statsValues[card.key] || 0,
  }));
  const statCardsList = stats.map((card) => (
    <StatCard key={card.key} card={card} />
  ));

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await getDoctorStats();
        setStatsValues({
          pendingReviews: data.unrevisedCount,
          reviewedToday: data.revisedByMeTodayCount,
          todayAppointments: data.todayAppointmentsCount,
        });
        setTodayAppointments(data.todayAppointmentsList);
        setPendingReviews(data.unrevisedList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const pendingReviewsList = pendingReviews.map((card) => (
    <DoctorXrayAnalysisCard
      key={card.id}
      card={card}
      tab="pending"
      size="small"
    />
  ));

  const todayAppointmentsList = todayAppointments.map((appointment) => (
    <DoctorAppointmentCard key={appointment.id} appointment={appointment} />
  ));

  return (
    <div className="dashboard-container doctor-dashboard">
      {loading ? (
        <Spin className="loading" size="large" />
      ) : (
        <>
          <Navbar user={user} role="doctor" />
          <div className="dashboard-content container">
            <PrivateHero
              greeting={`Good Morning, Dr. ${user?.firstName} ${user?.lastName}`}
              title="Doctor Dashboard"
              subtitle="Review X-ray analyses, manage your schedule, and track patient appointments."
              banner={bannerSvg}
            />

            <div className="stats-container">{statCardsList}</div>

            <div className="dashboard-overview">
              <div className="pending-reviews-section">
                <div className="header">
                  <div>
                    <h2 className="title">Pending X-ray Reviews</h2>
                    <p className="subtitle">
                      Review and approve X-ray analyses.
                    </p>
                  </div>
                  <button
                    type="btn"
                    onClick={() => {
                      navigate("/xray-analysis");
                    }}
                  >
                    <MenuOutlined style={{ marginRight: 8 }} /> View All
                  </button>
                </div>
                {pendingReviews.length > 0 ? (
                  <div className="pending-reviews-list">
                    {pendingReviewsList}
                  </div>
                ) : (
                  <p className="no-data">No pending X-ray reviews.</p>
                )}
              </div>
              <div className="today-appointments-section">
                <div className="header">
                  <div>
                    <h2 className="title">Today's Appointments</h2>
                    <p className="subtitle">
                      Your scheduled appointments for today.
                    </p>
                  </div>
                  <button
                    type="btn"
                    onClick={() => {
                      navigate("/appointments");
                    }}
                  >
                    <MenuOutlined style={{ marginRight: 8 }} /> View All
                  </button>
                </div>
                {todayAppointments.length > 0 ? (
                  <div className="today-appointments-list">
                    {todayAppointmentsList}
                  </div>
                ) : (
                  <p className="no-data">
                    No appointments scheduled for today.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
