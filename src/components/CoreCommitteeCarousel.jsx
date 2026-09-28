import { useEffect, useMemo, useRef } from 'react';
import Reveal from './Reveal';
import MemberAvatar from './MemberAvatar';
import members from '../data/members';

function buildCoreCommittee() {
  const president = members.find((m) => m.team === 'Core Committee' && (m.role.includes('President') || m.role.includes('Club Lead')));
  const secretary = members.find((m) => m.team === 'Core Committee' && m.role.includes('Secretary'));
  const leads = members.filter((m) => m.tier === 1 && m.role === 'Lead' && m.team !== 'Core Committee');

  const list = [];
  if (president) list.push(president);
  list.push({ name: 'Vice President (TBD)', role: 'Vice President', photo: null, linkedin: null });
  if (secretary) list.push(secretary);
  list.push(...leads);
  return list;
}

function roleDisplay(member) {
  if (member.role === 'Lead' && member.team && member.team !== 'Core Committee') {
    return member.team.replace(' Team', '') + ' Lead';
  }
  return member.role;
}

// A horizontal strip that auto-scrolls sideways on its own, fading out
// at both edges (CSS mask, not a hard cut-off) instead of the old
// full 3D rotating wheel. Hovering hands control to the user: auto-scroll
// pauses and the strip becomes a normal scrollable/draggable area (native
// overflow-x, mouse wheel, trackpad, click-drag all just work). The card
// list is duplicated back-to-back so auto-scroll can loop seamlessly by
// snapping scrollLeft back by one set's width once it passes the first copy.
//
// A coverflow-style 3D tilt is layered on top: each frame, every card's
// distance from the strip's visual center (measured via offsetLeft, which
// is layout-based and unaffected by the transform itself) drives a
// rotateY + scale — flat and full-size dead center, tilting away and
// shrinking slightly toward the edges.
const MAX_TILT_DEG = 28;
const MIN_SCALE = 0.86;

export default function CoreCommitteeCarousel() {
  const coreCommittee = useMemo(buildCoreCommittee, []);
  const trackRef = useRef(null);
  const hoveredRef = useRef(false);
  const cardRefs = useRef([]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || coreCommittee.length === 0) return;

    const SPEED = 0.6; // px per frame
    let frameId = null;

    function applyTilt() {
      const center = track.clientWidth / 2;
      cardRefs.current.forEach((card) => {
        if (!card) return;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2 - track.scrollLeft;
        const norm = Math.max(-1, Math.min(1, (cardCenter - center) / center));
        const rotateY = norm * -MAX_TILT_DEG;
        const scale = 1 - Math.abs(norm) * (1 - MIN_SCALE);
        card.style.transform = `rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      });
    }

    function animate() {
      if (!hoveredRef.current) {
        track.scrollLeft += SPEED;
      }
      // Wrap-around correction runs regardless of hover, so a manual
      // scroll that drags past the loop point also gets caught.
      const singleSetWidth = track.scrollWidth / 2;
      if (track.scrollLeft >= singleSetWidth) {
        track.scrollLeft -= singleSetWidth;
      } else if (track.scrollLeft < 0) {
        track.scrollLeft += singleSetWidth;
      }
      applyTilt();
      frameId = requestAnimationFrame(animate);
    }
    frameId = requestAnimationFrame(animate);

    function onEnter() { hoveredRef.current = true; }
    function onLeave() { hoveredRef.current = false; }
    track.addEventListener('mouseenter', onEnter);
    track.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(frameId);
      track.removeEventListener('mouseenter', onEnter);
      track.removeEventListener('mouseleave', onLeave);
    };
  }, [coreCommittee.length]);

  // Duplicated so the strip can scroll seamlessly past the "end" into
  // what looks like a continuation, both for auto-scroll and for a user
  // dragging/scrolling manually.
  const doubled = [...coreCommittee, ...coreCommittee];

  return (
    <section id="core-committee">
      <Reveal as="p" className="eyebrow" variant="scale">Core Committee</Reveal>
      <Reveal as="h2" variant="up" delay={0.1}>Leading the vision.</Reveal>

      <Reveal as="div" className="carousel-fade-wrap" variant="scale" delay={0.2}>
        <div className="carousel-track" id="core-carousel" ref={trackRef}>
          {doubled.map((member, i) => (
            <div
              key={member.name + '-' + i}
              className="carousel-card"
              ref={(el) => { cardRefs.current[i] = el; }}
            >
              <MemberAvatar member={member} size={100} />
              <h3 style={{ textAlign: 'center' }}>{member.name}</h3>
              <p style={{ textAlign: 'center', textTransform: 'uppercase' }}>{roleDisplay(member)}</p>
              {member.linkedin && (
                <a href={member.linkedin} className="cta carousel-linkedin" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
