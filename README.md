# Cognito Club

The Cognito Club website — a React + Vite single-page site built from the club's
original static HTML/CSS/JS version, with the same design system: an animated
dot-network nav logo, a full-page cursor-connect constellation background (with
an idle "cursor forms the logo" easter egg), scroll-reveal section animations,
switchable per-team tabs, and a 3D coverflow-style Core Committee carousel.

## Running locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Building for production

```bash
npm run build
```

Outputs to `dist/`.

## Structure

- `src/App.jsx` — assembles the page from the section components below.
- `src/components/` — one component per section (`Hero`, `About`, `Events`,
  `CoreCommitteeCarousel`, `TeamsTabs` + `TeamSection` + `TierCard`,
  `Collaborations`, `Footer`, `Nav`), plus `ConstellationBackground` (the
  cursor/dots/idle-logo system), `CognitoLogo` (the animated nav mark),
  `CardConstellation` (the corner-dot hover decoration on role cards), and
  `BoredMark` (the Shorya Saxena easter egg).
- `src/data/members.js` — the team roster (name, team, role, tier, photo,
  LinkedIn) that drives both the Core Committee carousel and the per-team
  sections.
- `src/hooks/useReveal.js` + `src/components/Reveal.jsx` — the
  IntersectionObserver-based scroll-reveal wrapper used throughout.
- `src/index.css` — all styling.
