import { useEffect, useState } from "react";
import { useAuth } from "../../services/auth/useAuth";
import Navbar from "../navbar";
import { Link, useParams } from "react-router-dom";
import { Image, Spin } from "antd";
import noImg from "@/assets/images/no-image-dark-mode.svg";
import DoctorIcon from "@/assets/icons/doctor.svg?react";
import DiagnosisIcon from "@/assets/icons/diagnosis.svg?react";
import { getReviewedXrayDetails } from "../../services/api";
import { FormOutlined, LeftOutlined } from "@ant-design/icons";

export default function XrayAnalysisDetailsPage() {
  const { user } = useAuth();
  const { id: xrayId } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!xrayId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await getReviewedXrayDetails(xrayId);

        setCard(data);
      } catch (err) {
        console.error("Failed to fetch xray details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [xrayId]);

  return (
    <div className="xray-analysis-page-container">
      <Navbar user={user} role="patient" />
      {loading ? (
        <Spin className="loading" size="large" />
      ) : (
        <div className="xray-analysis-page-content details-page-content container">
          <Link className="back-link" to="/xray-analysis">
            <LeftOutlined /> Back to Analysis
          </Link>
          <div className="header">
            <h2 className="title">Analysis Review</h2>
          </div>
          <div className="details-container">
            <div className="image-section">
              <div className="image-header">
                <p className="label">X-ray Image</p>
                <p className="date">
                  Reviewed:{" "}
                  {card.confirmationDateInfo.date
                    .split(", ")
                    .slice(1)
                    .join(", ")}
                </p>
              </div>
              <Image
                width={"100%"}
                src={card.imageUrl}
                alt="X-ray Image"
                fallback={noImg}
              />
            </div>
            <div className="info-section">
              <div className="info-item">
                <p className="title">
                  <DoctorIcon /> Doctor Information
                </p>
                <div className="content doctor-info">
                  <div>
                    <p className="label">Name</p>
                    <p className="name">Dr. {card.doctorName}</p>
                  </div>
                  <div>
                    <p className="label">Speciality</p>
                    <p className="name">{card.doctorSpeciality}</p>
                  </div>
                  <div>
                    <p className="label">Degree</p>
                    <p className="name">{card.doctorDegree}</p>
                  </div>
                </div>
              </div>
              <div className="info-item">
                <p className="title">
                  <DiagnosisIcon /> Doctor Diagnosis
                </p>
                <div className="content">
                  <div>
                    <p className="label">Confirmed diagnosis</p>
                    <h2 className="diagnosis">{card.finalDiagnosis}</h2>
                  </div>
                </div>
              </div>
              <div className="info-item">
                <p className="title">
                  <FormOutlined /> Doctor Notes
                </p>
                <div className="content">
                  <p className="notes">
                    {card.doctorNotes || "No notes available."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
