import Reveal from './Reveal';

export default function Collaborations() {
  return (
    <section id="collaborations">
      <Reveal as="p" className="eyebrow" variant="stagger">Collaborations</Reveal>
      <Reveal as="h2" variant="up" delay={0.1}>Who we work with.</Reveal>
      <Reveal as="p" className="section-intro" variant="up" delay={0.2}>
        Organizations and communities we've partnered with.
      </Reveal>
      <div className="grid collab">
        <Reveal as="div" className="card collab-card" variant="stagger" delay={0.3}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/43/GeeksforGeeks.svg"
            alt="Geeks for Geeks"
            style={{ maxHeight: 24, marginRight: 12 }}
          />
          GeeksforGeeks
        </Reveal>
      </div>
    </section>
  );
}
