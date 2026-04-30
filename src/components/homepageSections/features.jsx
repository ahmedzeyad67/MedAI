import boltIcon from "@/assets/icons/bolt.svg";
import shieldIcon from "@/assets/icons/shield.svg";
import usersIcon from "@/assets/icons/users.svg";
import checkIcon from "@/assets/icons/check.svg";

export default function Features() {
  const featuresCards = [
    {
      icon: boltIcon,
      title: "AI-Assisted Analysis",
      desription:
        "Advanced machine learning model classifies lung X-rays into 5 disease categories with high accuracy",
    },
    {
      icon: shieldIcon,
      title: "Secure & Compliant",
      desription:
        "HIPAA-compliant platform with end-to-end encryption for patient data protection",
    },
    {
      icon: usersIcon,
      title: "Expert Review",
      desription:
        "All AI results are reviewed and verified by qualified medical professionals",
    },
    {
      icon: checkIcon,
      title: "Fast Results",
      desription: "Get preliminary analysis results within minutes",
    },
  ];
  const featuresCardsList = featuresCards.map((card) => {
    return (
      <div key={card.title} className="features-card">
        <img className="icon" src={card.icon} alt="card-icon" />
        <h3 className="title">{card.title}</h3>
        <p className="description">{card.desription}</p>
      </div>
    );
  });

  return (
    <div className="features-section section">
      <div className="container">
        <div className="content">
          <div className="header">
            <h1 className="title">Why Choose MediScan?</h1>
            <p className="description">
              Combining elite AI technology with expert medical professionals
              for reliable diagnosis
            </p>
          </div>
          <div className="grid">{featuresCardsList}</div>
        </div>
      </div>
    </div>
  );
}
