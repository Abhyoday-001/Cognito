import { useState } from 'react';
import TeamSection from './TeamSection';

const TEAM_ORDER = [
  'Tech Team',
  'Event Management Team',
  'Operations Team',
  'Social Media Team',
  'Photography Team',
  'Design Team',
];

// Switches between one team at a time instead of stacking every team's
// section one after another — pick a tab, see that team, instead of
// scrolling past five other teams to get to the one you want.
export default function TeamsTabs({ members }) {
  const [active, setActive] = useState(TEAM_ORDER[0]);

  return (
    <div className="teams-tabs-wrap">
      <div className="team-tabs">
        {TEAM_ORDER.map((team) => (
          <button
            key={team}
            type="button"
            className={'team-tab' + (team === active ? ' active' : '')}
            onClick={() => setActive(team)}
          >
            {team}
          </button>
        ))}
      </div>
      <TeamSection teamName={active} members={members} />
    </div>
  );
}
