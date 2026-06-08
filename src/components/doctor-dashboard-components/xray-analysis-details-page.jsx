import { useEffect, useState } from "react";
import { useAuth } from "../../services/auth/useAuth";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Navbar from "../navbar";
import noImg from "@/assets/images/no-image-dark-mode.svg";
import EditIcon from "@/assets/icons/edit.svg?react";
import DoctorIcon from "@/assets/icons/doctor.svg?react";
import {
  BulbOutlined,
  CheckOutlined,
  FormOutlined,
  LeftOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Alert, Image, Progress, Select, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  confirmXrayAnalysis,
  getDoctorReviwedXrayDetails,
  getUnrevisedXrayDetails,
} from "../../services/api";

export default function XrayAnalysisDetailsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const { id: xrayId } = useParams();
  const [card, setCard] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [finalDiagnosis, setFinalDiagnosis] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const diagnosisOptions = [
    { label: "Normal", value: "Normal" },
    { label: "Bacterial Pneumonia", value: "Bacterial Pneumonia" },
    { label: "Viral Pneumonia", value: "Viral Pneumonia" },
    { label: "Corona Virus Disease", value: "Corona Virus Disease" },
    { label: "Tuberculosis", value: "Tuberculosis" },
  ];

  function getConfidenceColor(confidence) {
    if (confidence >= 85) return "#059669";
    if (confidence >= 70) return "#d97706";
    return "#ef4444";
  }

  const handleSubmit = async (xrayId) => {
    if (tab !== "pending") return;

    try {
      if (isSubmitting) return;
      setIsSubmitting(true);
      setServerError(null);

      await confirmXrayAnalysis(xrayId, finalDiagnosis, doctorNotes);
      navigate("/xray-analysis", {
        state: {
          toast: {
            type: "success",
            title: "Analysis Reviewed",
            description: "The X-ray analysis has been reviewed successfully.",
          },
        },
      });
    } catch (err) {
      setServerError("Failed to review X-ray analysis. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!xrayId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        let data;

        if (tab === "pending") {
          data = await getUnrevisedXrayDetails(xrayId);
        } else {
          data = await getDoctorReviwedXrayDetails(xrayId);
        }

        setCard(data);
        setSelectedDiagnosis(data.aI_Diagnosis);
        setFinalDiagnosis(data.aI_Diagnosis);
      } catch (err) {
        console.error("Failed to fetch xray details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [xrayId, tab]);

  return (
    <div className="xray-analysis-page-container">
      <Navbar user={user} role="doctor" />
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
                  {tab === "pending" ? "Uploaded:" : "Confirmed:"}{" "}
                  {card.date.split(", ").slice(1).join(", ")}
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
                  <UserOutlined /> Patient Information
                </p>
                <div className="content">
                  <p className="label">Name</p>
                  <p className="name">{card.patientName}</p>
                </div>
              </div>
              <div className="info-item">
                <p className="title">
                  <BulbOutlined /> AI Analysis Result
                </p>
                <div className="content">
                  <div>
                    <p className="label">Detected condition</p>
                    {isEditing ? (
                      <Select
                        className="diagnosis"
                        size="large"
                        defaultValue={finalDiagnosis}
                        options={diagnosisOptions}
                        onChange={(value) => setSelectedDiagnosis(value)}
                      />
                    ) : (
                      <h2 className="diagnosis">{finalDiagnosis}</h2>
                    )}
                  </div>
                  <Progress
                    type="circle"
                    percent={card.aI_Confidence}
                    size="small"
                    railColor="#0000001f"
                    strokeColor={getConfidenceColor(card.aI_Confidence)}
                    format={(percent) => `${percent}%`}
                  />
                </div>
              </div>
              {tab === "pending" ? (
                <>
                  <div className="info-item">
                    <p className="title">
                      <FormOutlined /> Doctor Notes
                    </p>
                    <div className="content">
                      <TextArea
                        autoSize={{ minRows: 5 }}
                        placeholder="Add your clinical notes, observations, or recommendations..."
                        value={doctorNotes}
                        onChange={(e) => setDoctorNotes(e.target.value)}
                      />
                    </div>
                  </div>
                  {serverError && (
                    <Alert title={serverError} type="error" showIcon />
                  )}
                  {isEditing ? (
                    <div className="action-buttons">
                      <button
                        type="outlined-btn"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="btn"
                        onClick={() => {
                          setIsEditing(false);
                          setFinalDiagnosis(selectedDiagnosis);
                        }}
                      >
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <div className="action-buttons">
                      <button
                        type="outlined-btn"
                        onClick={() => {
                          setIsEditing(true);
                          setServerError(null);
                        }}
                        disabled={isSubmitting}
                      >
                        <EditIcon /> Edit Diagnosis
                      </button>
                      <button
                        type="btn"
                        disabled={doctorNotes.trim() === "" || isSubmitting}
                        onClick={() => handleSubmit(card.id)}
                      >
                        <CheckOutlined />
                        {isSubmitting ? "Approving..." : "Approve Analysis"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="info-item">
                    <p className="title">
                      <DoctorIcon /> Doctor Final Diagnosis
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
