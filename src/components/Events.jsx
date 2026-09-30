import Reveal from './Reveal';

const EVENTS = [
  {
    image: '/vibeathon.jpg',
    date: '9 March 2026',
    title: 'Vibeathon',
    dimmed: true,
    description:
      "Our debut AI Build & Ship competition — ₹8,000 prize pool, insane builds, and absolute tech warriors.",
  },
  {
    image: '/operation-red-trophy.webp',
    date: '28 April 2026',
    title: 'Operation Red Trophy',
    dimmed: true,
    description: 'A thrilling display of innovation and strategy — brilliant minds pushing boundaries under pressure.',
  },
  {
    image: '/techboss.webp',
    date: 'Upcoming',
    title: 'Tech Boss',
    dimmed: false,
    description: "The Cognito Team is cooking up something fun, so stay tuned!",
  },
  {
    image: '/Audition.png',
    date: 'Upcoming',
    title: 'Cognito Club Recruitment 2026',
    dimmed: false,
    description: "Turn your skills and creativity into real opportunities. Open for 1st & 2nd year students.",
  },
];

export default function Events() {
  return (
    <section id="events">
      <Reveal as="p" className="eyebrow" variant="drop">Events</Reveal>
      <Reveal as="h2" variant="up" delay={0.1}>What's coming up.</Reveal>
      <Reveal as="p" className="section-intro" variant="up" delay={0.2}>
        Check out our past and upcoming events.
      </Reveal>
      <div className="grid events">
        {EVENTS.map((ev, i) => (
          <Reveal
            key={ev.title}
            as="div"
            className="card"
            variant="drop"
            delay={0.3 + i * 0.1}
            style={{ display: 'flex', flexDirection: 'column', opacity: ev.dimmed ? 0.7 : 1 }}
          >
            <img className="card-img" src={ev.image} alt={ev.title} />
            <p className="date">{ev.date}</p>
            <h3>{ev.title}</h3>
            <p>{ev.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
