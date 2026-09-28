import Reveal from './Reveal';

const EVENTS = [
  {
    image: '/vibeathon.jpg',
    date: '9 March 2026',
    title: 'Vibeathon',
    dimmed: true,
    description:
      "🚀 Successfully completed! Our debut solo AI Build & Ship competition blew everyone away — ₹8,000 prize pool, insane builds under extreme time pressure, and a room full of absolute tech warriors. Execution decided the outcome. What a launch! 🔥",
  },
  {
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80',
    date: '28 April 2026',
    title: 'Operation Red Trophy',
    dimmed: true,
    description: 'Successfully completed! An incredible experience for everyone involved.',
  },
  {
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
    date: 'Upcoming',
    title: 'Tech Boss',
    dimmed: false,
    description: "Our next big upcoming event. Stay tuned for more details!",
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
