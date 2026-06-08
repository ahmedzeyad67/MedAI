import Navbar from "../components/Navbar";
import Hero from "../components/homepage-sections/hero";
import Features from "../components/homepage-sections/features";
import WorkFlow from "../components/homepage-sections/work-flow";
import MeetDoctors from "../components/homepage-sections/meet-doctors";
import GetStarted from "../components/homepage-sections/get-started";
import Footer from "../components/homepage-sections/footer";

export default function Homepage() {
  return (
    <div className="homepage-container">
      <Navbar />
      <Hero />
      <Features />
      <WorkFlow />
      <MeetDoctors />
      <GetStarted />
      <Footer />
    </div>
  );
}
