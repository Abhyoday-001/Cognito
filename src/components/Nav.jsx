import CognitoLogo from './CognitoLogo';

export default function Nav() {
  return (
    <header className="nav">
      <div className="brand">
        <CognitoLogo />
        <span className="brand-name">COGNITO CLUB</span>
      </div>
      <nav className="links">
        <a href="#home">Home</a>
        <a href="#about">About Us</a>
        <a href="#events">Events</a>
        <a href="#core-committee">Team</a>
        <a href="#collaborations">Collaborations</a>
      </nav>
    </header>
  );
}
