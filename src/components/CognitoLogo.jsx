import { useEffect, useRef } from 'react';

const R = 20;

const DEFAULT_NODES = [
  { x: 566, y: 225 }, { x: 675, y: 295 }, { x: 431, y: 298 }, { x: 566, y: 380 },
  { x: 271, y: 414 }, { x: 409, y: 414 }, { x: 749, y: 414 }, { x: 271, y: 532 },
  { x: 566, y: 532 }, { x: 839, y: 534 }, { x: 749, y: 591 }, { x: 566, y: 627 },
  { x: 379, y: 636 }, { x: 839, y: 655 }, { x: 566, y: 734 }, { x: 839, y: 776 },
  { x: 431, y: 805 }, { x: 689, y: 817 }, { x: 566, y: 906 },
];

// Ordered so each edge always shares a node with what's already been
// drawn — the network grows outward as one connected shape instead
// of separate clusters popping in out of sequence.
const LOGO_EDGES = [
  [0, 1], [0, 2], [0, 3], [1, 3], [2, 3], [3, 6], [3, 8],
  [8, 5], [5, 4], [4, 7], [5, 7], [6, 8], [6, 10], [7, 8], [8, 9], [9, 13],
  [13, 15], [15, 11], [11, 12], [11, 14], [11, 16], [12, 14], [12, 16], [14, 17], [14, 18], [16, 18], [17, 18],
];

const RING = [[0, 1], [1, 6], [6, 9], [9, 13], [13, 15], [15, 17], [17, 18], [18, 16], [16, 12], [12, 7], [7, 4], [4, 0]];

// Every letter is ordered as one continuous stroke: each edge starts
// exactly where the previous one ended, so the whole letter draws
// itself in a single unbroken line rather than jumping between
// disconnected segments.
const LETTER_EDGES = {
  O: RING,
  C: [[13, 15], [15, 17], [17, 18], [18, 16], [16, 12], [12, 7], [7, 4], [4, 0], [0, 1], [1, 6]],
  G: [[13, 15], [15, 17], [17, 18], [18, 16], [16, 12], [12, 7], [7, 4], [4, 0], [0, 1], [1, 6], [6, 9], [9, 8], [8, 11]],
  N: [[16, 12], [12, 5], [5, 2], [2, 17], [17, 10], [10, 6], [6, 1]],
  I: [[0, 3], [3, 8], [8, 11], [11, 14], [14, 18]],
  T: [[3, 1], [1, 2], [2, 3], [3, 8], [8, 11], [11, 14], [14, 18]],
};

const LETTER_SEQ = ['C', 'O', 'G', 'N', 'I', 'T', 'O'];
const STAGGER = 48;
const MAX_EDGES = 30;

export default function CognitoLogo() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '100 100 930 930');
    svg.setAttribute('class', 'cognito-logo-svg');
    const edgesG = document.createElementNS(svgNS, 'g');
    const nodesG = document.createElementNS(svgNS, 'g');
    svg.appendChild(edgesG);
    svg.appendChild(nodesG);
    mount.appendChild(svg);

    const circleEls = DEFAULT_NODES.map((n) => {
      const c = document.createElementNS(svgNS, 'circle');
      c.setAttribute('class', 'node');
      c.setAttribute('cx', n.x);
      c.setAttribute('cy', n.y);
      c.setAttribute('r', R);
      nodesG.appendChild(c);
      return c;
    });

    const lineEls = [];
    for (let i = 0; i < MAX_EDGES; i++) {
      const l = document.createElementNS(svgNS, 'line');
      l.setAttribute('class', 'edge');
      edgesG.appendChild(l);
      lineEls.push(l);
    }

    let cancelled = false;
    let pendingTimeout = null;
    function wait(ms) {
      return new Promise((resolve) => {
        pendingTimeout = setTimeout(() => {
          pendingTimeout = null;
          resolve();
        }, ms);
      });
    }

    function setActiveDots(edgePairs) {
      const used = new Array(DEFAULT_NODES.length).fill(false);
      edgePairs.forEach((e) => { used[e[0]] = true; used[e[1]] = true; });
      circleEls.forEach((c, i) => c.classList.toggle('idle', !used[i]));
    }

    function fadeOutEdges() {
      lineEls.forEach((l) => l.classList.remove('on'));
    }

    // Sets a line's endpoints and primes it to draw itself from (x1,y1)
    // to (x2,y2) via stroke-dasharray/dashoffset, rather than fading in
    // uniformly along its whole length.
    function primeLine(l, a, b) {
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      l.style.transition = 'none';
      l.setAttribute('x1', a.x); l.setAttribute('y1', a.y);
      l.setAttribute('x2', b.x); l.setAttribute('y2', b.y);
      l.style.strokeDasharray = len;
      l.style.strokeDashoffset = len;
      l.getBoundingClientRect(); // flush
      l.style.transition = '';
    }

    function goTo(edges) {
      fadeOutEdges();
      return wait(200).then(() => {
        if (cancelled) return;
        for (let i = 0; i < lineEls.length; i++) {
          if (i < edges.length) {
            const a = DEFAULT_NODES[edges[i][0]], b = DEFAULT_NODES[edges[i][1]];
            primeLine(lineEls[i], a, b);
          }
        }
        return new Promise((resolve) => {
          let i = 0;
          function step() {
            if (cancelled) return;
            lineEls[i].classList.add('on');
            lineEls[i].style.strokeDashoffset = 0;
            i++;
            if (i < edges.length) {
              pendingTimeout = setTimeout(step, STAGGER);
            } else {
              setActiveDots(edges);
              pendingTimeout = setTimeout(resolve, 260);
            }
          }
          step();
        });
      });
    }

    function showLogoInstant() {
      setActiveDots(LOGO_EDGES);
      lineEls.forEach((l, i) => {
        if (i < LOGO_EDGES.length) {
          const a = DEFAULT_NODES[LOGO_EDGES[i][0]], b = DEFAULT_NODES[LOGO_EDGES[i][1]];
          const len = Math.hypot(b.x - a.x, b.y - a.y);
          l.style.transition = 'none';
          l.setAttribute('x1', a.x); l.setAttribute('y1', a.y);
          l.setAttribute('x2', b.x); l.setAttribute('y2', b.y);
          l.style.strokeDasharray = len;
          l.style.strokeDashoffset = 0;
          l.classList.add('on');
          l.getBoundingClientRect();
          l.style.transition = '';
        } else {
          l.classList.remove('on');
        }
      });
    }

    async function loop() {
      if (cancelled) return;
      showLogoInstant();
      await wait(1500);
      if (cancelled) return;

      for (let i = 0; i < LETTER_SEQ.length; i++) {
        await goTo(LETTER_EDGES[LETTER_SEQ[i]]);
        if (cancelled) return;
        await wait(680);
        if (cancelled) return;
      }

      await goTo(LOGO_EDGES);
      if (cancelled) return;
      await wait(4200);
      if (cancelled) return;

      loop();
    }

    loop();

    return () => {
      cancelled = true;
      if (pendingTimeout) clearTimeout(pendingTimeout);
      mount.removeChild(svg);
    };
  }, []);

  return <div id="cognitoLogo" ref={mountRef} />;
}
