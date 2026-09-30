const SOCIALS = [
  {
    label: 'WHATSAPP',
    href: 'https://chat.whatsapp.com/L4MFPFZvkbZ2HhrlB9nRYX',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.274-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.525.146-.18.194-.3.297-.51.102-.21.05-.39-.025-.54-.075-.15-.673-1.62-.922-2.22-.24-.585-.487-.51-.673-.51-.174-.015-.373-.015-.573-.015-.199 0-.523.075-.797.375-.273.3-1.04 1.017-1.04 2.482 0 1.464 1.065 2.878 1.213 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12.002 22a9.964 9.964 0 0 1-5.1-1.39l-5.63 1.48 1.5-5.48A9.957 9.957 0 0 1 2 12c0-5.523 4.477-10 10-10s10 4.477 10 10c0 5.514-4.472 10-9.998 10z" />
      </svg>
    ),
  },
  {
    label: 'INSTAGRAM',
    href: 'https://www.instagram.com/thecognitoclub/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'LINKEDIN',
    href: 'https://www.linkedin.com/company/the-cognito-club/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-inner">
        <h1 id="hero-heading" className="hero-heading">
          Empower AI,<br />Innovate Tomorrow!
        </h1>

        <div className="hero-divider">
          <span className="hero-divider-line" />
          <span className="hero-divider-label">WELCOME TO THE CLUB</span>
          <span className="hero-divider-line" />
        </div>

        <p className="hero-copy">
          A student-led initiative driving innovation in artificial intelligence and machine
          learning at Jain (Deemed-to-be) University.
        </p>

        <div className="hero-nodes">
          <span className="hero-nodes-label">COMMUNITY NODES</span>
          <div className="hero-nodes-row">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="node-link">
                {s.icon}
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
