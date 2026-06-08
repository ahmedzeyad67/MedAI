import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import PublicDoctorCard from "../public-doctor-card";
import { getDoctors } from "../../services/api";

export default function MeetDoctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const loadDoctors = async (page) => {
      try {
        const res = await getDoctors(page);
        setDoctors(res.doctors.slice(0, 3));
      } catch (err) {
        console.error("Failed to load doctors:", err);
      }
    };

    loadDoctors(1);
  }, []);

  const doctorsList = doctors.map((doctor) => {
    return (
      <PublicDoctorCard
        key={doctor.id}
        doctor={doctor}
      />
    );
  });

  return (
    <div className="meet-doctors-section section">
      <div className="container">
        <div className="content">
          <div className="header">
            <h1 className="title">Our Medical Team</h1>
            <p className="description">
              Experienced healthcare professionals reviewing and verifying all
              AI analysis results
            </p>
          </div>
          <div className="grid">{doctorsList}</div>
          <button type="btn" onClick={() => navigate("/doctors")}>
            Meet All Doctors{" "}
            <ArrowRightOutlined style={{ marginLeft: "8px" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
