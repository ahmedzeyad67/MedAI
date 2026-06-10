import BoltIcon from "@/assets/icons/bolt.svg?react";
import ShieldIcon from "@/assets/icons/shield.svg?react";
import UsersIcon from "@/assets/icons/users.svg?react";
import CheckIcon from "@/assets/icons/check.svg?react";

export default function Features() {
  const featuresCards = [
    {
      icon: BoltIcon,
      title: "AI-Assisted Analysis",
      desription:
        "Advanced machine learning model classifies lung X-rays into 5 disease categories with high accuracy",
    },
    {
      icon: ShieldIcon,
      title: "Secure & Compliant",
      desription:
        "HIPAA-compliant platform with end-to-end encryption for patient data protection",
    },
    {
      icon: UsersIcon,
      title: "Expert Review",
      desription:
        "All AI results are reviewed and verified by qualified medical professionals",
    },
    {
      icon: CheckIcon,
      title: "Fast Results",
      desription: "Get preliminary analysis results within minutes",
    },
  ];
  const featuresCardsList = featuresCards.map((card) => {
    return (
      <div key={card.title} className="features-card">
        <card.icon className="icon" />
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
            <h1 className="title">Why Choose MedAI?</h1>
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
