import Reveal from './Reveal';
import TierCard from './TierCard';

export default function TeamSection({ teamName, members }) {
  const teamMembers = members.filter((m) => m.team === teamName);
  if (teamMembers.length === 0) return null;

  const tier1 = teamMembers
    .filter((m) => m.tier === 1)
    .sort((a, b) => (a.role === 'Lead' ? -1 : 1) - (b.role === 'Lead' ? -1 : 1));
  const tier2 = teamMembers.filter((m) => m.tier === 2);

  return (
    <section className="team-section">
      <h2 style={{ textAlign: 'center', marginBottom: 40 }}>{teamName}</h2>

      <Reveal
        as="div"
        className="tier1-grid"
        variant="left"
        style={tier1.length === 1 ? { justifyContent: 'center' } : undefined}
      >
        {tier1.map((member) => (
          <TierCard key={member.name} member={member} size={100} variantClass="tier1-card" />
        ))}
      </Reveal>

      {tier2.length > 0 && (
        <Reveal as="div" className="tier2-grid" variant="right">
          {tier2.map((member) => (
            <TierCard key={member.name} member={member} size={70} variantClass="tier2-card" />
          ))}
        </Reveal>
      )}
    </section>
  );
}
