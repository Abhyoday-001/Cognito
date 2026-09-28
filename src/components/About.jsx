import Reveal from './Reveal';

export default function About() {
  return (
    <section id="about" className="about">
      <Reveal as="p" className="eyebrow" variant="up">About Us</Reveal>
      <Reveal as="h2" className="about-heading" variant="up" delay={0.1}>
        More Than a Club. A Community
      </Reveal>
      <Reveal as="p" className="section-intro about-copy" variant="up" delay={0.2}>
        At <strong>The Cognito Club</strong>, we're more than just a student group—we're a
        vibrant community at JAIN (Deemed-to-be-University). Here, creativity ignites, ideas
        become reality, and students from all backgrounds unite to shape the future. Whether
        you're a fresher, a final-year student, a tech enthusiast, or a creative mind, you're
        welcome to join us. We provide a space for networking, experimentation, and
        growth—perfect for puzzle solvers, tech innovators, and anyone eager to connect with
        bold thinkers.
      </Reveal>
    </section>
  );
}
