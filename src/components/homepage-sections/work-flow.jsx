export default function WorkFlow() {
  const workFlowSteps = [
    {
      title: "Upload X-ray",
      desription: "Securely upload your lung X-ray image to our platform",
    },
    {
      title: "AI Analysis",
      desription:
        "Our AI model analyzes the image and provides preliminary classification",
    },
    {
      title: "Doctor Review",
      desription: "A qualified doctor reviews and verifies the AI results",
    },
    {
      title: "Get Results",
      desription:
        "Receive detailed analysis report with doctor's recommendations",
    },
  ];
  const workFlowList = workFlowSteps.map((step, index) => {
    return (
      <div key={step.title} className="workFlow-step">
        <div className="order">{index + 1}</div>
        <h3 className="title">{step.title}</h3>
        <p className="description">{step.desription}</p>
      </div>
    );
  });

  return (
    <div className="workFlow-section section">
      <div className="container">
        <div className="content">
          <div className="header">
            <h1 className="title">How It Works</h1>
            <p className="description">
              Simple, secure, and efficient process from upload to diagnosis
            </p>
          </div>
          <div className="grid">{workFlowList}</div>
        </div>
      </div>
    </div>
  );
}
