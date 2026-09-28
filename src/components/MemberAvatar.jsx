import { useState } from 'react';

function getInitials(name) {
  return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
}

// Shows a member's photo, falling back to initials if the photo is
// missing or fails to load (Google Drive hotlinks can occasionally
// break) — replaces the original's string-templated <img onerror=...>
// with a proper React onError handler.
export default function MemberAvatar({ member, size }) {
  const [imgFailed, setImgFailed] = useState(false);
  const initials = getInitials(member.name);
  const showImg = member.photo && !imgFailed;

  return (
    <div
      className="member-avatar-frame"
      style={{ width: size, height: size }}
    >
      {showImg ? (
        <img
          src={member.photo}
          alt={member.name}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="member-avatar-img"
        />
      ) : (
        <div className="avatar member-avatar-fallback">{initials}</div>
      )}
    </div>
  );
}
