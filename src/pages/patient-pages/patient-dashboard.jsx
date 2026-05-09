import { useEffect, useState } from "react";
import { useAuth } from "../../services/auth/useAuth";
import { getPatientBookings } from "../../services/api";
import Navbar from "../../components/navbar";
import { Spin, Upload } from "antd";
import PrivateHero from "../../components/private-hero";
import bannerSvg from "@/assets/icons/patient-banner.svg";
import StatCard from "../../components/stat-card";
import { patientStatCards } from "../../config/dashboardConfig";
import XrayUploader from "../../components/xray-uploader";
import {
  ArrowRightOutlined,
  CalendarOutlined,
  CheckOutlined,
  MenuOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import PictureIcon from "@/assets/icons/picture.svg?react";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [nextBooking, setNextBooking] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const statCardsList = patientStatCards.map((card) => (
    <StatCard key={card.label} card={card} />
  ));

  function handleBeforeUpload(file) {
    setFile(file);
    return false;
  }

  useEffect(() => {
    const loadNextBooking = async () => {
      setLoading(true);
      try {
        const data = await getPatientBookings("upcoming");
        setNextBooking(data.items[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadNextBooking();
  }, []);

  return (
    <div className="dashboard-container patient-dashboard">
      {loading ? (
        <Spin className="loading" size="large" />
      ) : (
        <>
          <Navbar user={user} role="patient" />
          <div className="dashboard-content container">
            <PrivateHero
              greeting="Good Morning"
              title="Welcome to MediScan"
              subtitle="Upload your X-rays for AI-powered analysis and expert doctor review"
              banner={bannerSvg}
            />

            <div className="stats-container">{statCardsList}</div>

            <div className="next-appointment-container">
              <div className="next-appointment-icon">
                <CalendarOutlined />
              </div>
              <div className="next-appointment-content">
                <div className="title">Next Appointment</div>
                {nextBooking ? (
                  <div className="details">
                    Dr. {nextBooking.doctor.firstName}{" "}
                    {nextBooking.doctor.lastName} ·{" "}
                    <span className="date">
                      {nextBooking.date}
                      <span> at {nextBooking?.startTime}</span>
                    </span>
                  </div>
                ) : (
                  <p className="no-appointments">No upcoming appointments.</p>
                )}
              </div>
              <a href="/appointments" className="view-all-link">
                View All <ArrowRightOutlined className="link-arrow" />
              </a>
            </div>

            <div className="xray-upload-container">
              <div className="xray-upload-header">
                <PictureIcon className="icon" />
                <div>
                  <div className="title">
                    Upload X-ray image <span className="badge">AI Powered</span>
                  </div>
                  <div className="description">
                    Upload a chest X-ray for AI-assisted analysis and expert
                    doctor review
                  </div>
                </div>
              </div>
              <XrayUploader
                file={file}
                setFile={setFile}
                handleBeforeUpload={handleBeforeUpload}
              />
              {file && (
                <div className="preview-action-buttons">
                  <Upload
                    beforeUpload={handleBeforeUpload}
                    showUploadList={false}
                  >
                    <button className="edit-btn">
                      Change image <PlusOutlined />
                    </button>
                  </Upload>
                  <button className="analyze-btn">
                    Analyze <CheckOutlined />
                  </button>
                </div>
              )}
            </div>

            <div className="recent-analysis-container">
              <div className="recent-analysis-header">
                <div className="text">
                  <p className="title">Recent Analysis</p>
                  <p className="subtitle">Your latest X-ray analysis results</p>
                </div>
                <button type="btn">
                  <MenuOutlined style={{ marginRight: 6 }} /> View All
                </button>
              </div>
              <div className="recent-analysis-content">
                <p className="no-recents">No recent analysis available.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
