import MemberAvatar from './MemberAvatar';
import Reveal from './Reveal';

export default function TeamSection({ teamName, members }) {
  const teamMembers = members.filter((m) => m.team === teamName);
  if (teamMembers.length === 0) return null;

  const tier1 = teamMembers.filter((m) => m.tier === 1);
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
          <div key={member.name} className="tier1-card tier-card" style={{ alignItems: 'center', textAlign: 'center' }}>
            <MemberAvatar member={member} size={100} />
            <h3>{member.name}</h3>
            <p>{member.role}</p>
            {member.linkedin && (
              <a href={member.linkedin} className="cta" target="_blank" rel="noopener noreferrer" style={{ padding: '6px 16px', fontSize: 12, marginTop: 14 }}>
                LinkedIn
              </a>
            )}
          </div>
        ))}
      </Reveal>

      {tier2.length > 0 && (
        <Reveal as="div" className="tier2-grid" variant="right">
          {tier2.map((member) => (
            <div key={member.name} className="tier2-card tier-card" style={{ alignItems: 'center', textAlign: 'center' }}>
              <MemberAvatar member={member} size={70} />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              {member.linkedin && (
                <a href={member.linkedin} className="cta" target="_blank" rel="noopener noreferrer" style={{ padding: '6px 16px', fontSize: 12, marginTop: 14 }}>
                  LinkedIn
                </a>
              )}
            </div>
          ))}
        </Reveal>
      )}
    </section>
  );
}
