import LogoIcon from "@/assets/icons/logo.svg?react";

export default function Footer() {
  const features = [
    { title: "Product", links: ["Features", "Pricing", "Security"] },
    { title: "Company", links: ["About", "Blog", "Contact"] },
    { title: "Legal", links: ["Privacy", "Terms", "Compliance"] },
  ];
  const featuresLists = features.map((list) => {
    return (
      <div key={list.title}>
        <h4 className="title">{list.title}</h4>
        <div className="links-list">
          {list.links.map((link) => (
            <a key={link} href="#" className="link">
              {link}
            </a>
          ))}
        </div>
      </div>
    );
  });

  return (
    <div className="footer">
      <div className="container">
        <div className="content">
          <div className="grid">
            <div>
              <div className="footer-logo">
                <div className="icon logo-icon">
                  <LogoIcon />
                </div>
                <p className="text">MedAI</p>
              </div>
              <p>AI-powered lung X-ray analysis for clinical diagnosis</p>
            </div>
            {featuresLists}
          </div>
          <div className="credits">
            <p>© 2025 MedAI. All rights reserved.</p>
            <p>Clinical-grade AI analysis for healthcare professionals</p>
          </div>
        </div>
      </div>
    </div>
  );
}
