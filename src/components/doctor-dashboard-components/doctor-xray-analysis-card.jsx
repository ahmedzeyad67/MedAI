import noImg from "@/assets/images/no-image-dark-mode.svg";
import DiagnosisIcon from "@/assets/icons/diagnosis.svg?react";
import { Progress } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function DoctorXrayAnalysisCard({ card, tab, size }) {
  const navigate = useNavigate();

  function getConfidenceColor(confidence) {
    if (confidence >= 85) return "#059669";
    if (confidence >= 70) return "#d97706";
    return "#ef4444";
  }

  return (
    <div
      className="xray-analysis-card"
      onClick={() => navigate(`/xray-analysis/${card.id}?tab=${tab}`)}
    >
      <div className="img-container">
        <img
          src={card.imageUrl || noImg}
          alt="X-ray Image"
          onError={(e) => {
            e.currentTarget.src = noImg;
          }}
        />
      </div>

      <div className="details-container">
        <div>
          <h3 className="name">{card.patientName}</h3>
          <p className="date">
            {tab === "my-history" ? "Reviewed" : ""} {card.month} {card.day}
          </p>
          {size === "small" && (
            <div className="diagnosis">
              <DiagnosisIcon /> {card.aI_Diagnosis}
            </div>
          )}
        </div>
        {size === "large" && (
          <div>
            <div className="diagnosis">
              <DiagnosisIcon />{" "}
              {tab === "pending" ? card.aI_Diagnosis : card.finalDiagnosis}
            </div>
            {tab === "my-history" && (
              <span
                className={`badge ${card.isEdited ? "edited" : "approved"}`}
              >
                {card.isEdited ? "Edited" : "Approved"}
              </span>
            )}
          </div>
        )}
        {tab === "pending" &&
          (size === "large" ? (
            <div className="confidence">
              <Progress
                percent={card.aI_Confidence}
                showInfo={false}
                size="small"
                railColor="#0000001f"
                strokeColor={getConfidenceColor(card.aI_Confidence)}
              />
              <p>{card.aI_Confidence}% Confidence</p>
            </div>
          ) : (
            <Progress
              type="circle"
              percent={card.aI_Confidence}
              size="small"
              railColor="#0000001f"
              strokeColor={getConfidenceColor(card.aI_Confidence)}
              format={(percent) => `${percent}%`}
            />
          ))}
      </div>
      <p className="review-btn">
        {size === "large" && (tab === "pending" ? "Review" : "View Details")}{" "}
        <RightOutlined />
      </p>
    </div>
  );
}
