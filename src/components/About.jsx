import Reveal from './Reveal';

export default function About() {
  return (
    <section id="about" className="about">
      <Reveal as="p" className="eyebrow" variant="up">About Us</Reveal>
      <Reveal as="h2" className="about-heading" variant="up" delay={0.1}>
        More Than a Club. A Community
      </Reveal>
      <Reveal as="p" className="section-intro about-copy" variant="up" delay={0.2}>
        At <strong>The Cognito Club</strong>,We're more than just a student group. We're a vibrant community at JAIN (Deemed-to be University) where creativity, ideas, and collaboration come together. We believe everyone has something unique to contribute, whether you're a fresher finding your way, a final year student, a tech enthusiast, or someone with a creative spark.

        It's a space to meet new people, explore ideas, experiment, build things, and grow together. Whether you enjoy solving puzzles, working on exciting tech projects, or simply connecting with like minded people, there's always a place for you here.

      </Reveal>
    </section>
  );
}
