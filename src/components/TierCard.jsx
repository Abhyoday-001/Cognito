import { useRef, useState } from 'react';
import MemberAvatar from './MemberAvatar';
import CardConstellation from './CardConstellation';
import BoredMark from './BoredMark';

// How long the cursor has to sit on Shorya's card, unmoved, before the
// card fills with dots that connect into a word — same node-and-edge
// technique as the nav logo spelling COGNITO, just spelling something
// less flattering about how long you've been staring at his card.
const BORED_DELAY = 7200;

export default function TierCard({ member, size, variantClass }) {
  const isEasterEgg = member.name === 'Shorya Saxena';
  const [bored, setBored] = useState(false);
  const boredTimerRef = useRef(null);

  function handleMouseEnter() {
    if (!isEasterEgg) return;
    boredTimerRef.current = setTimeout(() => setBored(true), BORED_DELAY);
  }
  function handleMouseLeave() {
    if (!isEasterEgg) return;
    clearTimeout(boredTimerRef.current);
    setBored(false);
  }

  return (
    <div
      className={variantClass + ' tier-card'}
      style={{ alignItems: 'center', textAlign: 'center' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardConstellation />
      <MemberAvatar member={member} size={size} />
      <h3>{member.name}</h3>
      <p>{member.role}</p>
      {member.linkedin && (
        <a
          href={member.linkedin}
          className="cta"
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: '6px 16px', fontSize: 12, marginTop: 14 }}
        >
          LinkedIn
        </a>
      )}
      {bored && (
        <div className="bored-reveal">
          <BoredMark />
        </div>
      )}
    </div>
  );
}
