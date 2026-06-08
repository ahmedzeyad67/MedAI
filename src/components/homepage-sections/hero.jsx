import { ArrowRightOutlined } from "@ant-design/icons";
import heroImg from "@/assets/images/hero-img.png";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="hero-section">
      <div className="hero-bg"></div>
      <div className="hero-glow--1"></div>
      <div className="hero-glow--2"></div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-text-container">
            <div className="hero-badge">Advanced AI Technology</div>
            <h1 className="hero-title">Intelligent Lung X-ray Diagnosis</h1>
            <p className="hero-description">
              Harness the power of artificial intelligence combined with expert
              medical professionals to detect lung diseases with unprecedented
              accuracy and speed.
            </p>
            <div className="hero-actions">
              <button type="btn" onClick={() => navigate("/signup")}>
                Start Free Trial{" "}
                <ArrowRightOutlined style={{ marginLeft: "8px" }} />
              </button>
              <button type="outlined-btn" onClick={() => navigate("/login")}>
                Sign In
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="value">5</div>
                <p className="label">Disease Classes</p>
              </div>
              <div className="stat-item">
                <div className="value">98%</div>
                <p className="label">Accuracy</p>
              </div>
              <div className="stat-item">
                <div className="value">24/7</div>
                <p className="label">Available</p>
              </div>
            </div>
          </div>
          <div className="hero-img-container">
            <img src={heroImg} alt="hero-img" />
          </div>
        </div>
      </div>
    </div>
  );
}
