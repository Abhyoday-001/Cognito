import ConstellationBackground from './components/ConstellationBackground';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Events from './components/Events';
import CoreCommitteeCarousel from './components/CoreCommitteeCarousel';
import TeamsTabs from './components/TeamsTabs';
import Collaborations from './components/Collaborations';
import Footer from './components/Footer';
import members from './data/members';

export default function App() {
  return (
    <>
      <ConstellationBackground />
      <div className="page">
        <Nav />
        <Hero />
        <About />
        <Events />
        <CoreCommitteeCarousel />
        <TeamsTabs members={members} />
        <Collaborations />
        <Footer />
      </div>
    </>
  );
}
