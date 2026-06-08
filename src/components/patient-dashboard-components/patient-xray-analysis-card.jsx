import { useNavigate } from "react-router-dom";
import noImg from "@/assets/images/no-image-dark-mode.svg";
import DiagnosisIcon from "@/assets/icons/diagnosis.svg?react";
import PendingIcon from "@/assets/icons/pending.svg?react";
import { RightOutlined } from "@ant-design/icons";

export default function PatientXrayAnalysisCard({ card, size }) {
  const navigate = useNavigate();
  const { month, day } = card.isRevised
    ? card.confirmationDateInfo
    : card.creationDateInfo;

  return (
    <div
      className={`xray-analysis-card ${!card.isRevised ? "disabled" : ""}`}
      onClick={() => {
        if (card.isRevised) navigate(`/xray-analysis/${card.id}`);
      }}
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
          <h3 className="name">
            {card.isRevised ? `Dr. ${card.doctorName}` : "Pending Review"}
          </h3>
          <p className="date">
            {card.isRevised
              ? `Reviewed ${month} ${day}`
              : `Uploaded ${month} ${day}`}
          </p>
          {size === "small" && (
            <div className="diagnosis">
              {card.isRevised ? (
                <>
                  <DiagnosisIcon />
                  {card.finalDiagnosis}
                </>
              ) : (
                <>
                  <PendingIcon />
                  Awaiting doctor review
                </>
              )}
            </div>
          )}
        </div>
        {size === "large" && (
          <div>
            <div className="diagnosis">
              {card.isRevised ? (
                <>
                  <DiagnosisIcon />
                  {card.finalDiagnosis}
                </>
              ) : (
                <>
                  <PendingIcon />
                  Awaiting doctor review
                </>
              )}
            </div>
            <span
              className={`badge ${card.isRevised ? "completed" : "pending"}`}
            >
              {card.isRevised ? "Completed" : "Pending"}
            </span>
          </div>
        )}
      </div>
      {size === "small" && (
        <span className={`badge ${card.isRevised ? "completed" : "pending"}`}>
          {card.isRevised ? "Completed" : "Pending"}
        </span>
      )}

      <p className="review-btn">
        {size === "large" && "View Details"} <RightOutlined />
      </p>
    </div>
  );
}
