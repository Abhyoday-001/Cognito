import { useEffect, useRef } from 'react';

// Full port of the vanilla constellation system: a full-page dot field,
// cursor-connect lines, an idle "cursor forms the logo" easter egg, and
// a scroll-driven cursor stretch. Kept as one imperative effect (refs,
// not state) because this is a 60fps canvas/animation system — the
// vanilla structure is preserved almost exactly, just swapping
// getElementById for refs and adding proper effect cleanup so React's
// dev-mode double-invoke (StrictMode) can't leave duplicate listeners
// or timers running.
export default function ConstellationBackground() {
  const dotsCanvasRef = useRef(null);
  const linesCanvasRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);

  useEffect(() => {
    const dotsCanvas = dotsCanvasRef.current;
    const linesCanvas = linesCanvasRef.current;
    const cursorDot = cursorDotRef.current;
    const cursorRing = cursorRingRef.current;
    if (!dotsCanvas || !linesCanvas) return;

    const dctx = dotsCanvas.getContext('2d');
    const lctx = linesCanvas.getContext('2d');
    const isFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0, H = 0;
    let dots = [];
    let grid = {};
    const mouse = { clientX: -9999, clientY: -9999, docX: -9999, docY: -9999, active: false };
    let redrawScheduled = false;

    const CELL = 130;
    const JITTER = 0.5;
    const CONNECT_R = 190;
    const DOT_R_MIN = 2, DOT_R_MAX = 3.4;

    const DOT_COLOR = '255,255,255';
    const DOT_ALPHA = 0.13;
    const LINE_ALPHA = 0.4;

    // -------- idle "forms into the logo" easter egg --------
    const LOGO_NODES_RAW = [
      { x: 566, y: 225 }, { x: 675, y: 295 }, { x: 431, y: 298 }, { x: 566, y: 380 }, { x: 271, y: 414 },
      { x: 409, y: 414 }, { x: 749, y: 414 }, { x: 271, y: 532 }, { x: 566, y: 532 }, { x: 839, y: 534 },
      { x: 749, y: 591 }, { x: 566, y: 627 }, { x: 379, y: 636 }, { x: 839, y: 655 }, { x: 566, y: 734 },
      { x: 839, y: 776 }, { x: 431, y: 805 }, { x: 689, y: 817 }, { x: 566, y: 906 },
    ];
    const LOGO_EDGES = [
      [0, 1], [0, 2], [0, 3], [1, 3], [2, 3], [3, 6], [3, 8],
      [8, 5], [5, 4], [4, 7], [5, 7], [6, 8], [6, 10], [7, 8], [8, 9], [9, 13],
      [13, 15], [15, 11], [11, 12], [11, 14], [11, 16], [12, 14], [12, 16], [14, 17], [14, 18], [16, 18], [17, 18],
    ];
    const HUB_INDEX = 8;
    const xs = LOGO_NODES_RAW.map((n) => n.x);
    const hub = LOGO_NODES_RAW[HUB_INDEX];
    const rawWidth = Math.max.apply(null, xs) - Math.min.apply(null, xs);
    const LOGO_REL = LOGO_NODES_RAW.map((n) => ({ dx: n.x - hub.x, dy: n.y - hub.y }));
    const LOGO_SCALE = 150 / rawWidth;

    const IDLE_DELAY = 15000;
    let idleTimer = null;
    let logoState = 'idle'; // idle | forming | formed | unforming
    let activeLogoDots = [];
    let logoAnimId = null;
    let pendingGapTimer = null;
    let animGen = 0;

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function pickNearestDots(x, y, n) {
      const withDist = dots.map((d) => {
        const dx = d.x - x, dy = d.y - y;
        return { d, dist: dx * dx + dy * dy };
      });
      withDist.sort((a, b) => a.dist - b.dist);
      return withDist.slice(0, n).map((o) => o.d);
    }

    function assignNearest(sourceDots, targets) {
      const used = new Array(targets.length).fill(false);
      return sourceDots.map((d) => {
        let best = -1, bestDist = Infinity;
        for (let j = 0; j < targets.length; j++) {
          if (used[j]) continue;
          const dx = d.x - targets[j].x, dy = d.y - targets[j].y;
          const dist = dx * dx + dy * dy;
          if (dist < bestDist) { bestDist = dist; best = j; }
        }
        used[best] = true;
        return targets[best];
      });
    }

    function runAnim(duration, easing, onFrame, onDone) {
      if (logoAnimId) cancelAnimationFrame(logoAnimId);
      const start = performance.now();
      function frame(now) {
        const t = Math.min(1, (now - start) / duration);
        onFrame(easing(t));
        if (t < 1) {
          logoAnimId = requestAnimationFrame(frame);
        } else {
          logoAnimId = null;
          onDone && onDone();
        }
      }
      logoAnimId = requestAnimationFrame(frame);
    }

    function setCursorSuppressed(on) {
      cursorDot.classList.toggle('suppressed', on);
      cursorRing.classList.toggle('suppressed', on);
    }

    let edgeFrac = [];

    function renderLogo() {
      lctx.clearRect(0, 0, W, H);
      lctx.lineWidth = 1;
      lctx.strokeStyle = 'rgba(' + DOT_COLOR + ',0.55)';
      for (let i = 0; i < LOGO_EDGES.length; i++) {
        const f = edgeFrac[i];
        if (!f) continue;
        const e = LOGO_EDGES[i];
        const a = activeLogoDots[e[0]].dot, b = activeLogoDots[e[1]].dot;
        lctx.beginPath();
        lctx.moveTo(a.x, a.y);
        lctx.lineTo(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f);
        lctx.stroke();
      }
      activeLogoDots.forEach((o) => {
        lctx.beginPath();
        lctx.arc(o.dot.x, o.dot.y, o.dot.r, 0, Math.PI * 2);
        lctx.fillStyle = 'rgba(' + DOT_COLOR + ',' + o.dot.alpha.toFixed(3) + ')';
        lctx.fill();
      });
    }

    const DOT_MOVE_DURATION = 300;
    const DOT_GAP = 200;
    const LINE_DRAW_DURATION = 80;
    const LINE_GAP = 30;

    function startForm() {
      if (!isFinePointer || !mouse.active || dots.length < 19) return;
      logoState = 'forming';
      const myGen = ++animGen;

      const picked = pickNearestDots(mouse.docX, mouse.docY, 19);
      const targets = LOGO_REL.map((r) => ({ x: mouse.docX + r.dx * LOGO_SCALE, y: mouse.docY + r.dy * LOGO_SCALE }));
      const assigned = assignNearest(picked, targets);

      const ordered = new Array(19);
      picked.forEach((d, i) => {
        const target = assigned[i];
        const idx = targets.indexOf(target);
        ordered[idx] = { dot: d, ox: d.x, oy: d.y, tx: target.x, ty: target.y };
      });
      activeLogoDots = ordered;
      edgeFrac = new Array(LOGO_EDGES.length).fill(0);

      activeLogoDots.forEach((o) => { o.dot.alpha = DOT_ALPHA; o.dot.active = true; });
      drawDots();

      placeNextDot(0, myGen);
    }

    function placeNextDot(i, myGen) {
      if (myGen !== animGen) return;
      if (i >= activeLogoDots.length) {
        drawLinesOneByOne(0, myGen);
        return;
      }
      const o = activeLogoDots[i];
      runAnim(DOT_MOVE_DURATION, easeInOutCubic, (e) => {
        if (myGen !== animGen) return;
        o.dot.x = o.ox + (o.tx - o.ox) * e;
        o.dot.y = o.oy + (o.ty - o.oy) * e;
        o.dot.alpha = DOT_ALPHA + (0.6 - DOT_ALPHA) * e;
        renderLogo();
      }, () => {
        if (myGen !== animGen) return;
        pendingGapTimer = setTimeout(() => {
          pendingGapTimer = null;
          placeNextDot(i + 1, myGen);
        }, DOT_GAP);
      });
    }

    function drawLinesOneByOne(edgeIdx, myGen) {
      if (myGen !== animGen) return;
      if (edgeIdx >= LOGO_EDGES.length) {
        logoState = 'formed';
        setCursorSuppressed(true);
        return;
      }
      runAnim(LINE_DRAW_DURATION, (t) => t, (frac) => {
        if (myGen !== animGen) return;
        edgeFrac[edgeIdx] = frac;
        renderLogo();
      }, () => {
        if (myGen !== animGen) return;
        edgeFrac[edgeIdx] = 1;
        pendingGapTimer = setTimeout(() => {
          pendingGapTimer = null;
          drawLinesOneByOne(edgeIdx + 1, myGen);
        }, LINE_GAP);
      });
    }

    function startUnform() {
      if (logoState === 'idle' || logoState === 'unforming') return;
      logoState = 'unforming';
      const myGen = ++animGen;
      if (pendingGapTimer) { clearTimeout(pendingGapTimer); pendingGapTimer = null; }
      setCursorSuppressed(false);

      const alphaSnapshot = activeLogoDots.map((o) => o.dot.alpha);

      runAnim(260, easeInOutCubic, (e) => {
        if (myGen !== animGen) return;
        activeLogoDots.forEach((o, i) => { o.dot.alpha = alphaSnapshot[i] + (DOT_ALPHA - alphaSnapshot[i]) * e; });
        renderLogo();
      }, () => {
        if (myGen !== animGen) return;
        const fracSnapshot = edgeFrac.slice();
        runAnim(340, easeInOutCubic, (e) => {
          if (myGen !== animGen) return;
          for (let i = 0; i < edgeFrac.length; i++) edgeFrac[i] = fracSnapshot[i] * (1 - e);
          renderLogo();
        }, () => {
          if (myGen !== animGen) return;
          const snapshot = activeLogoDots.map((o) => ({ o, fromX: o.dot.x, fromY: o.dot.y, delay: Math.random() * 220 }));
          const DURATION = 650;
          runAnim(DURATION, (t) => t, (globalT) => {
            if (myGen !== animGen) return;
            const elapsed = globalT * DURATION;
            snapshot.forEach((s) => {
              const span = DURATION - s.delay;
              const local = span > 0 ? Math.max(0, Math.min(1, (elapsed - s.delay) / span)) : 1;
              const e = easeInOutCubic(local);
              s.o.dot.x = s.fromX + (s.o.ox - s.fromX) * e;
              s.o.dot.y = s.fromY + (s.o.oy - s.fromY) * e;
            });
            renderLogo();
          }, () => {
            if (myGen !== animGen) return;
            activeLogoDots.forEach((o) => { o.dot.active = false; o.dot.alpha = DOT_ALPHA; });
            activeLogoDots = [];
            edgeFrac = [];
            logoState = 'idle';
            drawDots();
            drawLines();
          });
        });
      });
    }

    function resetIdleTimer() {
      clearTimeout(idleTimer);
      if (logoState === 'formed' || logoState === 'forming') {
        startUnform();
      }
      idleTimer = setTimeout(startForm, IDLE_DELAY);
    }

    // Measuring document.body/documentElement here is circular: these
    // absolutely-positioned canvases are themselves part of body's
    // content, so once they're sized tall, body.scrollHeight reports
    // that same tallness back forever — the canvases can never shrink
    // again even after switching to a shorter team tab. Measuring the
    // actual content wrapper instead (nav is position:fixed, so it's
    // excluded automatically) breaks that loop.
    function docHeight() {
      const page = document.querySelector('.page');
      if (page) return page.scrollHeight;
      const b = document.body, d = document.documentElement;
      return Math.max(b.scrollHeight, d.scrollHeight, d.clientHeight);
    }

    function fitCanvas(c, ctx) {
      c.width = Math.round(W * DPR);
      c.height = Math.round(H * DPR);
      c.style.width = W + 'px';
      c.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function resize() {
      if (logoAnimId) { cancelAnimationFrame(logoAnimId); logoAnimId = null; }
      if (pendingGapTimer) { clearTimeout(pendingGapTimer); pendingGapTimer = null; }
      animGen++;
      activeLogoDots = [];
      edgeFrac = [];
      logoState = 'idle';
      clearTimeout(idleTimer);

      W = window.innerWidth;
      H = docHeight();
      fitCanvas(dotsCanvas, dctx);
      fitCanvas(linesCanvas, lctx);
      generateDots();
      drawDots();
      updateMouseDocPos();
      drawLines();
    }

    function generateDots() {
      dots = [];
      grid = {};
      const cols = Math.ceil(W / CELL) + 1;
      const rows = Math.ceil(H / CELL) + 1;
      for (let iy = 0; iy < rows; iy++) {
        for (let ix = 0; ix < cols; ix++) {
          const jx = (Math.random() - 0.5) * CELL * JITTER;
          const jy = (Math.random() - 0.5) * CELL * JITTER;
          const d = { x: ix * CELL + jx, y: iy * CELL + jy, r: DOT_R_MIN + Math.random() * (DOT_R_MAX - DOT_R_MIN) };
          dots.push(d);
          const key = ix + ',' + iy;
          (grid[key] || (grid[key] = [])).push(d);
        }
      }
    }

    function nearbyDots(x, y, radius) {
      const reach = Math.ceil(radius / CELL) + 1;
      const cx = Math.floor(x / CELL), cy = Math.floor(y / CELL);
      const out = [];
      for (let iy = cy - reach; iy <= cy + reach; iy++) {
        for (let ix = cx - reach; ix <= cx + reach; ix++) {
          const cell = grid[ix + ',' + iy];
          if (cell) out.push.apply(out, cell);
        }
      }
      return out;
    }

    function drawDots() {
      dctx.clearRect(0, 0, W, H);
      dctx.fillStyle = 'rgba(' + DOT_COLOR + ',' + DOT_ALPHA + ')';
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        if (d.active) continue;
        dctx.beginPath();
        dctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        dctx.fill();
      }
    }

    function drawLines() {
      if (logoState !== 'idle' || isScrolling) return;
      lctx.clearRect(0, 0, W, H);
      if (!isFinePointer || !mouse.active) return;

      const candidates = nearbyDots(mouse.docX, mouse.docY, CONNECT_R);
      for (let j = 0; j < candidates.length; j++) {
        const p = candidates[j];
        const dx = p.x - mouse.docX, dy = p.y - mouse.docY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_R) {
          const t = 1 - dist / CONNECT_R;
          lctx.strokeStyle = 'rgba(' + DOT_COLOR + ',' + (t * LINE_ALPHA).toFixed(3) + ')';
          lctx.lineWidth = 1;
          lctx.beginPath();
          lctx.moveTo(mouse.docX, mouse.docY);
          lctx.lineTo(p.x, p.y);
          lctx.stroke();

          lctx.fillStyle = 'rgba(' + DOT_COLOR + ',' + (0.18 + t * 0.32).toFixed(3) + ')';
          lctx.beginPath();
          lctx.arc(p.x, p.y, p.r + t * 1.6, 0, Math.PI * 2);
          lctx.fill();
        }
      }
    }

    // -------- cursor scroll reaction --------
    let isScrolling = false;
    let scrollStopTimer = null;
    let scrollAnimRunning = false;
    let scrollLastY = 0;
    let smoothedVelocity = 0;

    const SCROLL_STOP_DELAY = 130;
    const SCROLL_MIN_SPEED = 0.6;
    const VELOCITY_SMOOTHING = 0.16;

    function updateCursorStretch(velocity) {
      if (!isFinePointer || !mouse.active) return;
      const base = 'translate3d(' + mouse.clientX + 'px,' + mouse.clientY + 'px,0) translate(-50%,-50%)';
      const speed = Math.abs(velocity);
      if (speed < SCROLL_MIN_SPEED) {
        cursorDot.style.transform = base;
        cursorRing.style.transform = base;
        return;
      }
      const stretch = Math.min(1.5, 1 + speed * 0.025);
      const t = base + ' scaleY(' + stretch.toFixed(2) + ')';
      cursorDot.style.transform = t;
      cursorRing.style.transform = t;
    }

    let lastFrameTs = 0;
    let scrollFrameId = null;
    function scrollVelocityFrame(ts) {
      let dt = ts - lastFrameTs;
      lastFrameTs = ts;
      if (!(dt > 0) || dt > 200) dt = 16.67;

      const currentY = window.scrollY;
      const rawVelocity = (currentY - scrollLastY) * (16.67 / dt);
      scrollLastY = currentY;
      smoothedVelocity += (rawVelocity - smoothedVelocity) * VELOCITY_SMOOTHING;

      updateMouseDocPos();
      updateCursorStretch(smoothedVelocity);

      if (isScrolling || Math.abs(smoothedVelocity) > 0.15) {
        scrollFrameId = requestAnimationFrame(scrollVelocityFrame);
      } else {
        scrollAnimRunning = false;
        smoothedVelocity = 0;
        lastFrameTs = 0;
        updateCursorStretch(0);
        drawLines();
      }
    }

    function markScrolling() {
      isScrolling = true;
      clearTimeout(scrollStopTimer);
      scrollStopTimer = setTimeout(() => { isScrolling = false; }, SCROLL_STOP_DELAY);
      if (!scrollAnimRunning) {
        scrollAnimRunning = true;
        scrollLastY = window.scrollY;
        smoothedVelocity = 0;
        lastFrameTs = 0;
        scrollFrameId = requestAnimationFrame(scrollVelocityFrame);
      }
    }

    function updateMouseDocPos() {
      mouse.docX = mouse.clientX + window.scrollX;
      mouse.docY = mouse.clientY + window.scrollY;
    }

    function scheduleRedraw() {
      if (redrawScheduled) return;
      redrawScheduled = true;
      requestAnimationFrame(() => {
        redrawScheduled = false;
        updateMouseDocPos();
        drawLines();
      });
    }

    function moveCursor(x, y) {
      const t = 'translate3d(' + x + 'px,' + y + 'px,0) translate(-50%,-50%)';
      cursorDot.style.transform = t;
      cursorRing.style.transform = t;
    }

    function setCursorActive(on) {
      cursorDot.classList.toggle('active', on);
      cursorRing.classList.toggle('active', on);
    }

    function handleMouseMove(e) {
      mouse.clientX = e.clientX;
      mouse.clientY = e.clientY;
      mouse.active = true;
      moveCursor(mouse.clientX, mouse.clientY);
      setCursorActive(true);
      scheduleRedraw();
      resetIdleTimer();
    }
    function handleScrollIdleReset() {
      if (mouse.active) resetIdleTimer();
    }
    function handleMouseLeave() {
      mouse.active = false;
      setCursorActive(false);
      clearTimeout(idleTimer);
      if (logoState === 'formed' || logoState === 'forming') startUnform();
      scheduleRedraw();
    }
    function handleMouseOut(e) {
      if (!e.relatedTarget && !e.toElement) {
        mouse.active = false;
        setCursorActive(false);
        clearTimeout(idleTimer);
        if (logoState === 'formed' || logoState === 'forming') startUnform();
        scheduleRedraw();
      }
    }

    window.addEventListener('resize', resize);
    if (isFinePointer) {
      window.addEventListener('scroll', markScrolling, { passive: true });
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('scroll', handleScrollIdleReset, { passive: true });
      window.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('mouseout', handleMouseOut);
    }

    // A 'resize' event only fires for viewport changes, but the page's
    // own height can grow after mount without one — a web font
    // swapping in, or a member photo finishing its network load, both
    // reflow the layout taller. Without this, the canvases stay sized
    // to the shorter pre-load height and the bottom of the page ends
    // up with no dots at all. Debounced since several images/fonts can
    // each trigger their own layout change in quick succession.
    let resizeObserverTimer = null;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeObserverTimer);
      resizeObserverTimer = setTimeout(resize, 150);
    });
    resizeObserver.observe(document.body);

    resize();

    return () => {
      window.removeEventListener('resize', resize);
      if (isFinePointer) {
        window.removeEventListener('scroll', markScrolling);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScrollIdleReset);
        window.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('mouseout', handleMouseOut);
      }
      resizeObserver.disconnect();
      clearTimeout(resizeObserverTimer);
      clearTimeout(idleTimer);
      clearTimeout(pendingGapTimer);
      clearTimeout(scrollStopTimer);
      if (logoAnimId) cancelAnimationFrame(logoAnimId);
      if (scrollFrameId) cancelAnimationFrame(scrollFrameId);
    };
  }, []);

  return (
    <>
      <canvas id="bgDots" ref={dotsCanvasRef} />
      <canvas id="bgLines" ref={linesCanvasRef} />
      <div className="cursor-ring" id="cursorRing" ref={cursorRingRef} />
      <div className="cursor-dot" id="cursorDot" ref={cursorDotRef} />
    </>
  );
}
