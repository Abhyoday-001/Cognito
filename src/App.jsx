import ConstellationBackground from './components/ConstellationBackground';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Events from './components/Events';
import CoreCommitteeCarousel from './components/CoreCommitteeCarousel';
import TeamSection from './components/TeamSection';
import Collaborations from './components/Collaborations';
import Footer from './components/Footer';
import members from './data/members';

const TEAM_ORDER = [
  'Tech Team',
  'Event Management Team',
  'Operations Team',
  'Social Media Team',
  'Photography Team',
  'Design Team',
];

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
        {TEAM_ORDER.map((teamName) => (
          <TeamSection key={teamName} teamName={teamName} members={members} />
        ))}
        <Collaborations />
        <Footer />
      </div>
    </>
  );
}
