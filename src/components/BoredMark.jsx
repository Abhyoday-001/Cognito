// Spells "BORED" using the exact same technique as the nav logo:
// a handful of shared corner nodes per letter, joined by edges — just
// a seven-segment-style letterform instead of the logo's own shape.
const LETTER_W = 24;
const LETTER_H = 40;
const GAP = 8;

function nodePos(key, ox) {
  switch (key) {
    case 'tl': return [ox, 0];
    case 'tr': return [ox + LETTER_W, 0];
    case 'ml': return [ox, LETTER_H / 2];
    case 'mr': return [ox + LETTER_W, LETTER_H / 2];
    case 'bl': return [ox, LETTER_H];
    case 'br': return [ox + LETTER_W, LETTER_H];
    default: return [ox, 0];
  }
}

// Seven-segment display naming: a=top, b=top-right, c=bottom-right,
// d=bottom, e=bottom-left, f=top-left, g=middle. `extra` pairs are
// genuine diagonals (7-segment has none of its own) added where a
// straight segment reads as the wrong letter — R needs a kicked-out
// leg or it's indistinguishable from P.
const SEGMENTS = {
  a: ['tl', 'tr'],
  b: ['tr', 'mr'],
  c: ['mr', 'br'],
  d: ['bl', 'br'],
  e: ['ml', 'bl'],
  f: ['tl', 'ml'],
  g: ['ml', 'mr'],
};

const LETTERS = {
  B: { segs: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] },
  O: { segs: ['a', 'b', 'c', 'd', 'e', 'f'] },
  R: { segs: ['a', 'f', 'b', 'g'], extra: [['ml', 'br']] },
  E: { segs: ['a', 'f', 'g', 'e', 'd'] },
  D: { segs: ['b', 'g', 'e', 'c', 'd'] },
};

const WORD = ['B', 'O', 'R', 'E', 'D'];

export default function BoredMark() {
  const totalWidth = WORD.length * LETTER_W + (WORD.length - 1) * GAP;
  const lines = [];
  const circles = [];

  WORD.forEach((letter, li) => {
    const ox = li * (LETTER_W + GAP);
    const { segs, extra = [] } = LETTERS[letter];
    const usedNodes = new Set();
    const pairs = [...segs.map((key) => SEGMENTS[key]), ...extra];

    pairs.forEach(([a, b], si) => {
      usedNodes.add(a);
      usedNodes.add(b);
      const [x1, y1] = nodePos(a, ox);
      const [x2, y2] = nodePos(b, ox);
      lines.push(<line key={`${li}-l-${si}`} x1={x1} y1={y1} x2={x2} y2={y2} />);
    });

    Array.from(usedNodes).forEach((nodeKey, ni) => {
      const [cx, cy] = nodePos(nodeKey, ox);
      circles.push(<circle key={`${li}-c-${ni}`} cx={cx} cy={cy} r="2.4" />);
    });
  });

  return (
    <svg viewBox={`-4 -4 ${totalWidth + 8} ${LETTER_H + 8}`} className="bored-svg" aria-hidden="true">
      {lines}
      {circles}
    </svg>
  );
}
