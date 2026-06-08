import { statsBreakdownIcons } from "../../config/dashboardConfig";

export default function BreakdownCard({ card }) {
  return (
    <div key={card.key} className="breakdown-card">
      <div className="title">
        <card.icon /> {card.title}
      </div>
      <div className="content">
        {Object.entries(card.data || {}).map(([key, value]) => {
          if (key === "total") return null;

          const Icon = statsBreakdownIcons[key].icon;

          return (
            <div key={key} className="breakdown-item">
              <Icon
                className="icon"
                style={{ color: statsBreakdownIcons[key].color }}
              />

              <p className="label">{key}</p>
              <h3 className="value">{value}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
