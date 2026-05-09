export default function PrivateHero({ greeting, title, subtitle, banner }) {
  return (
    <div className="hero">
      <div className="hero-pattern"></div>
      <div className="hero-glow--1"></div>
      <div className="hero-glow--2"></div>
      <div className="hero-content">
        <div className="hero-text">
          <div className="greeting">
            <span></span> {greeting}
          </div>
          <div className="title">{title}</div>
          <div className="subtitle">{subtitle}</div>
        </div>
        <div className="hero-decoration--right">
          <img src={banner} alt="Banner decoration" />
        </div>
      </div>
    </div>
  );
}
