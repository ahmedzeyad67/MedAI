import { useEffect, useState } from "react";
import { useAuth } from "../../services/auth/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { getPatientStats, uploadXray } from "../../services/api";
import Navbar from "../../components/Navbar";
import { notification, Spin, Upload } from "antd";
import PrivateHero from "../../components/private-hero";
import bannerSvg from "@/assets/icons/patient-banner.svg";
import StatCard from "../../components/stat-card";
import { patientStatCards } from "../../config/dashboardConfig";
import XrayUploader from "../../components/xray-uploader";
import PatientXrayAnalysisCard from "../../components/patient-dashboard-components/patient-xray-analysis-card";
import {
  ArrowRightOutlined,
  CheckOutlined,
  CloudUploadOutlined,
  MenuOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import PictureIcon from "@/assets/icons/picture.svg?react";
import CalendarIcon from "@/assets/icons/calendar.svg?react";

export default function PatientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statsValues, setStatsValues] = useState({});
  const [nextAppointment, setNextAppointment] = useState(null);
  const [recentAnalysis, setRecentAnalysis] = useState([]);
  const [imgPreview, setImgPreview] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const stats = patientStatCards.map((card) => ({
    ...card,
    value: statsValues[card.key] || 0,
  }));
  const statCardsList = stats.map((card) => (
    <StatCard key={card.key} card={card} />
  ));

  function handleBeforeUpload(file) {
    setImgPreview(URL.createObjectURL(file));
    setImgFile(file);
    return false;
  }

  function removeSelectedImage() {
    setImgPreview(null);
    setImgFile(null);
  }

  const handleXrayUpload = async () => {
    if (!imgFile) return;

    try {
      setIsUploading(true);

      await uploadXray(imgFile);

      api.success({
        message: "Upload Successful",
        description: "Your X-ray image has been uploaded successfully.",
        placement: "bottomLeft",
        duration: 3,
      });

      removeSelectedImage();
    } catch (err) {
      console.error("Upload failed:", err);
      api.error({
        message: "Upload Failed",
        description:
          err.response?.status === 400
            ? "A previous X-ray analysis is already under review."
            : "Failed to upload X-ray image.",
        placement: "bottomLeft",
        duration: 3,
      });
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await getPatientStats();
        setStatsValues({
          totalAnalyses: data.totalAnalysis,
          pendingAnalysis: data.unrevisedAnalysis,
          completedAnalysis: data.revisedAnalysis,
        });
        setNextAppointment(data.nextAppointment);
        setRecentAnalysis(data.recentAnalysis);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const recentAnalysisList = recentAnalysis.map((card) => (
    <PatientXrayAnalysisCard key={card.id} card={card} size="small" />
  ));

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
              subtitle="Upload your X-rays for AI-assisted analysis and expert doctor review"
              banner={bannerSvg}
            />

            <div className="stats-container">{statCardsList}</div>

            <div className="next-appointment-container">
              <div className="next-appointment-icon">
                <CalendarIcon />
              </div>
              <div className="next-appointment-content">
                <div className="title">Next Appointment</div>
                {nextAppointment ? (
                  <div className="details">
                    Dr. {nextAppointment.doctor.firstName}{" "}
                    {nextAppointment.doctor.lastName} ·{" "}
                    <span className="date">
                      {nextAppointment.slot.date}
                      <span> at {nextAppointment.slot.startTime}</span>
                    </span>
                  </div>
                ) : (
                  <p className="no-appointments">No upcoming appointments.</p>
                )}
              </div>
              <Link to="/appointments" className="view-all-link">
                View All <ArrowRightOutlined className="link-arrow" />
              </Link>
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
                img={imgPreview}
                removeSelectedImage={removeSelectedImage}
                handleBeforeUpload={handleBeforeUpload}
              />
              {imgPreview && (
                <div className="preview-action-buttons">
                  <Upload
                    beforeUpload={handleBeforeUpload}
                    showUploadList={false}
                  >
                    <button type="outlined-btn" disabled={isUploading}>
                      <PlusOutlined /> Change Image
                    </button>
                  </Upload>
                  <button
                    type="btn"
                    onClick={handleXrayUpload}
                    disabled={isUploading}
                  >
                    <CloudUploadOutlined />{" "}
                    {isUploading ? "Uploading..." : "Upload X-ray"}
                  </button>
                </div>
              )}
            </div>

            <div className="recent-analysis-container">
              <div className="recent-analysis-header">
                <div className="text">
                  <p
                    className="title"
                    onClick={() => console.log(recentAnalysis, statsValues)}
                  >
                    Recent Analysis
                  </p>
                  <p className="subtitle">Your latest X-ray analysis results</p>
                </div>
                <button type="btn" onClick={() => navigate("/xray-analysis")}>
                  <MenuOutlined style={{ marginRight: 6 }} /> View All
                </button>
              </div>
              <div className="recent-analysis-content">
                {recentAnalysis.length > 0 ? (
                  <div className="analysis-list">{recentAnalysisList}</div>
                ) : (
                  <p className="no-recents">No recent analysis available.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {contextHolder}
    </div>
  );
}
