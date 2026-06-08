import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth/useAuth";
import Navbar from "../components/navbar";
import { notification, Pagination, Spin } from "antd";
import {
  getDoctorReviwedXraysHistory,
  getPatientXrays,
  getUnrevisedXrays,
} from "../services/api";
import DoctorXrayAnalysisCard from "../components/doctor-dashboard-components/doctor-xray-analysis-card";
import PatientXrayAnalysisCard from "../components/patient-dashboard-components/patient-xray-analysis-card";

export default function XrayAnalysisPage() {
  const { user, role } = useAuth();
  const [api, contextHolder] = notification.useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  const hasShownToast = useRef(false);
  const [tab, setTab] = useState("pending");
  const [xraysMap, setXraysMap] = useState([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [myHistoryTotal, setMyHistoryTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const toast = location.state?.toast;

  function handleTabChange(newTab) {
    setTab(newTab);
    setCurrentPage(1);
  }

  useEffect(() => {
    if (!toast || hasShownToast.current) return;
    hasShownToast.current = true;
    if (toast.type === "success") {
      api.success({
        title: toast.title,
        description: toast.description,
        placement: "bottomLeft",
        duration: 3,
      });
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [toast, api, navigate, location.pathname]);

  useEffect(() => {
    const loadData = async (page) => {
      setLoading(true);

      try {
        if (role === "doctor") {
          const pendingData = await getUnrevisedXrays(page);
          const myHistoryData = await getDoctorReviwedXraysHistory(page);

          tab === "pending"
            ? setXraysMap(pendingData)
            : setXraysMap(myHistoryData);

          setPendingTotal(pendingData.totalCount);
          setMyHistoryTotal(myHistoryData.totalCount);
        } else {
          const data = await getPatientXrays();
          setXraysMap(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData(currentPage);
  }, [currentPage, tab, role]);

  const xrayAnalysisList = xraysMap.items?.map((card) =>
    role === "doctor" ? (
      <DoctorXrayAnalysisCard
        key={card.id}
        card={card}
        tab={tab}
        size="large"
      />
    ) : (
      <PatientXrayAnalysisCard key={card.id} card={card} size="large" />
    ),
  );

  return (
    <div className="xray-analysis-page-container">
      {contextHolder}
      <Navbar user={user} role={role} />
      <div className="xray-analysis-page-content container">
        <div className="header">
          <div>
            <h2 className="title">X-ray Analysis</h2>
            <p className="subtitle">
              Browse historical X-rays and analysis results
            </p>
          </div>
          {role === "doctor" && (
            <div className="tabs">
              <button
                type={tab === "pending" ? "btn" : "text-btn"}
                className="tab-btn"
                onClick={() => handleTabChange("pending")}
              >
                Pending Reviews{" "}
                <span className="tab-value">{pendingTotal}</span>
              </button>
              <button
                type={tab === "my-history" ? "btn" : "text-btn"}
                className="tab-btn"
                onClick={() => handleTabChange("my-history")}
              >
                My History <span className="tab-value">{myHistoryTotal}</span>
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <Spin className="loading" size="large" />
        ) : (
          <>
            {xraysMap.items?.length > 0 ? (
              <>
                <div className="xray-analysis-list-container">
                  {xrayAnalysisList}
                </div>
                {role === "doctor" && (
                  <Pagination
                    current={currentPage}
                    total={tab === "pending" ? pendingTotal : myHistoryTotal}
                    onChange={setCurrentPage}
                    align="center"
                  />
                )}
              </>
            ) : (
              <p className="no-data">
                No {tab === "pending" ? "pending" : "historical"} x-ray analyses
                available.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
