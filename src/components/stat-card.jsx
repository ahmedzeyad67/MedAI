import { ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function StatCard({ card }) {
  const navigate = useNavigate();

  return (
    <div
      className={`stat-card ${card.link ? "has-link" : ""}`}
      onClick={card.link ? () => navigate(card.link) : undefined}
    >
      <card.icon style={{ color: card.color }} />
      <div className="stat-card-content">
        <div className="label">{card.label}</div>
        <div className="value" style={{ color: card.color }}>
          {card.value}
        </div>
        <div className="description">{card.description}</div>
      </div>
      {card.link && <ArrowRightOutlined className="link-arrow" />}
    </div>
  );
}
