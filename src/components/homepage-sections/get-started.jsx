import { ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <div className="get-started-section section">
      <div className="container">
        <div className="content">
          <div className="header">
            <h1 className="title">Ready to Get Started?</h1>
            <p className="description">
              Join thousands of patients and healthcare professionals using
              MedAI for accurate lung X-ray analysis
            </p>
          </div>
          <div className="actions">
            <button type="btn" onClick={() => navigate("/signup")}>
              Get Started <ArrowRightOutlined style={{ marginLeft: "8px" }} />
            </button>
            <button type="outlined-btn" onClick={() => navigate("/login")}>
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
