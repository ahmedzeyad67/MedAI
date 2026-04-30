import Navbar from "../components/Navbar";
import Hero from "../components/homepageSections/hero";
import Features from "../components/homepageSections/features";
import WorkFlow from "../components/homepageSections/work-flow";
import MeetDoctors from "../components/homepageSections/meet-doctors";
import GetStarted from "../components/homepageSections/get-started";
import Footer from "../components/homepageSections/footer";

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
