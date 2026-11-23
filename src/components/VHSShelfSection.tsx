/**
 * VHSShelfSection — Leon Vasari filmography shelf hero
 * Adapted from the original prompt for portfolio dark theme (#0C0C0C)
 * Uses CSS 3D transforms + vanilla rAF loop + Web Animations API
 * Feature: Hovering the mouse through any book automatically turns it out in 3D (no click required to reach front-cover state)
 * Single click on the open book / center play button opens the book detail view
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { playKeyboardSound } from '../utils/audio';

// ─── Asset URLs ──────────────────────────────────────────────────────────────
const SHEETS: Record<string, { url: string; W: number; H: number }> = {
  covers: {
    url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_010644_837e04ca-2418-45c1-b8e0-0233265c4cd5.png&w=1744&q=85',
    W: 1744,
    H: 2336,
  },
  spines: {
    url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_010738_a3e47ead-18f2-4974-9468-06d16a25edc5.png&w=2688&q=85',
    W: 2688,
    H: 1152,
  },
  fix: {
    url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_010831_3ebb874b-93dc-433e-87ed-6299aba720f0.png&w=1520&q=85',
    W: 1520,
    H: 2688,
  },
  fix2: {
    url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_092020_f96bc094-db7b-46de-9298-074a24e0a3b8.png&w=1520&q=85',
    W: 1520,
    H: 2688,
  },
};

// ─── Film data ────────────────────────────────────────────────────────────────
interface Film {
  id: string;
  title: string;
  titleRomanji: string;
  titleKanji: string;
  year: number;
  genre: string;
  runtime: number;
  spineSheet: string;
  spineBox: [number, number, number, number]; // x, y, w, h
  coverSheet: string;
  coverBox: [number, number, number, number];
}

const FILMS: Film[] = [
  { id: 'valley', title: 'The Silent Valley', titleRomanji: 'SHIZUKANA TANI', titleKanji: '静かな谷', year: 1958, genre: 'Drama', runtime: 104, spineSheet: 'spines', spineBox: [266, 31, 189, 1089], coverSheet: 'covers', coverBox: [497, 72, 344, 659] },
  { id: 'bluehour', title: 'The Blue Hour', titleRomanji: 'AO NO TOKI', titleKanji: '青の刻', year: 1962, genre: 'Romance', runtime: 97, spineSheet: 'spines', spineBox: [492, 31, 189, 1089], coverSheet: 'covers', coverBox: [914, 72, 342, 659] },
  { id: 'river', title: 'River of Salt', titleRomanji: 'SHIO NO KAWA', titleKanji: '塩の川', year: 1964, genre: 'Drama', runtime: 121, spineSheet: 'fix', spineBox: [197, 54, 324, 2566], coverSheet: 'covers', coverBox: [1332, 72, 344, 659] },
  { id: 'summer', title: 'The Last Summer', titleRomanji: 'SAIGO NO NATSU', titleKanji: '最後の夏', year: 1966, genre: 'Drama', runtime: 109, spineSheet: 'spines', spineBox: [937, 31, 188, 1089], coverSheet: 'covers', coverBox: [74, 813, 344, 676] },
  { id: 'green', title: 'The Green Road', titleRomanji: 'MIDORI NO MICHI', titleKanji: '緑の道', year: 1969, genre: 'Mystery', runtime: 101, spineSheet: 'spines', spineBox: [1157, 31, 185, 1090], coverSheet: 'covers', coverBox: [497, 815, 344, 674] },
  { id: 'noon', title: 'Noon in Ashes', titleRomanji: 'HAI NO SHOGO', titleKanji: '灰の正午', year: 1971, genre: 'Western', runtime: 112, spineSheet: 'spines', spineBox: [44, 32, 184, 1088], coverSheet: 'covers', coverBox: [74, 72, 347, 659] },
  { id: 'observer', title: 'The Observer', titleRomanji: 'KANSATSUSHA', titleKanji: '観察者', year: 1973, genre: 'Thriller', runtime: 96, spineSheet: 'fix2', spineBox: [371, 15, 349, 2655], coverSheet: 'covers', coverBox: [915, 815, 342, 675] },
  { id: 'birds', title: 'The Fallen Birds', titleRomanji: 'OCHITA TORI', titleKanji: '落ちた鳥', year: 1975, genre: 'Drama', runtime: 118, spineSheet: 'spines', spineBox: [1573, 31, 183, 1089], coverSheet: 'covers', coverBox: [1331, 815, 345, 675] },
  { id: 'storm', title: 'Light in the Storm', titleRomanji: 'ARASHI NO HI', titleKanji: '嵐の灯', year: 1978, genre: 'Drama', runtime: 127, spineSheet: 'fix2', spineBox: [808, 15, 347, 2656], coverSheet: 'covers', coverBox: [74, 1571, 345, 681] },
  { id: 'tide', title: 'The Long Tide', titleRomanji: 'NAGAI SHIO', titleKanji: '長い潮', year: 1981, genre: 'Drama', runtime: 99, spineSheet: 'spines', spineBox: [2012, 31, 188, 1089], coverSheet: 'covers', coverBox: [496, 1577, 343, 678] },
  { id: 'war', title: 'A Quiet War', titleRomanji: 'SHIZUKANA SENSO', titleKanji: '静かな戦争', year: 1985, genre: 'Comedy', runtime: 103, spineSheet: 'spines', spineBox: [2236, 31, 189, 1089], coverSheet: 'covers', coverBox: [913, 1579, 343, 676] },
  { id: 'door', title: 'Red Door', titleRomanji: 'AKAI TOBIRA', titleKanji: '赤い扉', year: 1989, genre: 'Thriller', runtime: 114, spineSheet: 'spines', spineBox: [2462, 31, 188, 1089], coverSheet: 'covers', coverBox: [1331, 1579, 344, 677] },
];

const N = FILMS.length; // 12
const COPIES = 3;       // 3 × 12 = 36 tape elements

// Decade tabs
const DECADES = ['ALL', '1950s', '1960s', '1970s', '1980s'];

function filmDecade(f: Film): string {
  return `${Math.floor(f.year / 10) * 10}s`;
}

// CSS background crop helper
function cropStyle(sheetKey: string, box: [number, number, number, number]): React.CSSProperties {
  const [x, y, w, h] = box;
  const { url, W, H } = SHEETS[sheetKey];
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: `${(W / w) * 100}% ${(H / h) * 100}%`,
    backgroundPosition: `${(x / (W - w)) * 100}% ${(y / (H - h)) * 100}%`,
    backgroundRepeat: 'no-repeat',
  };
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const VHSShelfSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const shelfRef = useRef<HTMLDivElement>(null);
  // cursorRingRef removed — GlobalCursor handles the site-wide custom cursor
  const detailRef = useRef<HTMLDivElement>(null);
  const captionTitleRef = useRef<HTMLDivElement>(null);
  const captionSubRef = useRef<HTMLDivElement>(null);
  const captionYearRef = useRef<HTMLDivElement>(null);
  const decadeBarRef = useRef<HTMLDivElement>(null);

  // State managed imperatively via refs for the rAF loop
  const stateRef = useRef({
    s: 3 + N,            // start on the fourth book from the left (The Last Summer)
    sTarget: 3 + N,     // spring target
    vel: 0,             // spring velocity
    activeFilmIdx: 3,   // actual film index (0-11)
    decade: 'ALL',
    isOpen: false,       // detail view open
    isDragging: false,
    dragStartX: 0,
    dragStartS: 5 + N as number,
    lastMx: 0,
    lastMy: 0,
    tapeEls: [] as HTMLElement[],
    H: 180,              // tape height px (computed from probe)
    spineW: 0,          // computed spine width
  });

  // Spring constants - tuned for responsive, snappy hover response
  const K_SPRING = 6.8;
  const DAMPING = 0.74;

  // rAF id
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // ── Computed tape geometry ──────────────────────────────────────────────────
  const getH = useCallback((): number => {
    if (!sectionRef.current) return 180;
    return Math.min(sectionRef.current.clientHeight * 0.46, sectionRef.current.clientWidth * 0.31);
  }, []);

  const getSpineW = useCallback((H: number): number => {
    return Math.round(H * 0.1735);
  }, []);

  const getCoverW = useCallback((H: number): number => {
    return Math.round(H * 0.522);
  }, []);

  // ── Caption slide ───────────────────────────────────────────────────────────
  const setCaption = useCallback((filmIdx: number, animate = true) => {
    const f = FILMS[filmIdx];
    const duration = animate ? 320 : 0;

    const slideIn = (el: HTMLElement | null, text: string, delay: number) => {
      if (!el) return;
      el.textContent = text;
      if (animate) {
        el.animate(
          [
            { transform: 'translateY(100%)', opacity: 0 },
            { transform: 'translateY(0)', opacity: 1 },
          ],
          { duration, delay, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards' }
        );
      }
    };

    if (captionTitleRef.current) {
      if (animate) {
        captionTitleRef.current.animate(
          [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-100%)', opacity: 0 }],
          { duration: 160, easing: 'ease-in', fill: 'forwards' }
        ).onfinish = () => slideIn(captionTitleRef.current, f.title, 0);
      } else {
        slideIn(captionTitleRef.current, f.title, 0);
      }
    }
    slideIn(captionSubRef.current, `${f.titleRomanji} / ${f.titleKanji}`, animate ? 50 : 0);
    slideIn(captionYearRef.current, String(f.year), animate ? 90 : 0);
  }, []);

  // ── Detail view open/close ──────────────────────────────────────────────────
  const openDetail = useCallback((filmIdx: number) => {
    const st = stateRef.current;
    if (st.isOpen) return;
    st.isOpen = true;

    const f = FILMS[filmIdx];
    const detailEl = detailRef.current;
    if (!detailEl) return;

    // Populate detail content
    const imgEl = detailEl.querySelector<HTMLElement>('.detail-poster');
    const titleEl = detailEl.querySelector<HTMLElement>('.detail-title');
    const metaEl = detailEl.querySelector<HTMLElement>('.detail-meta');
    const descEl = detailEl.querySelector<HTMLElement>('.detail-desc');

    if (imgEl) Object.assign(imgEl.style, cropStyle(f.coverSheet, f.coverBox));
    if (titleEl) titleEl.textContent = f.title;
    if (metaEl) metaEl.textContent = `${f.year} · ${f.genre} · ${f.runtime} min`;
    if (descEl) descEl.textContent = `A LEON VASARI FILM — ${f.titleRomanji} / ${f.titleKanji}`;

    detailEl.style.display = 'flex';

    // Animate in: scale from 0.92 to 1 + opacity
    detailEl.animate(
      [
        { opacity: 0, transform: 'scale(0.92)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      { duration: 380, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards' }
    );

    // Stagger text lines
    [titleEl, metaEl, descEl].forEach((el, i) => {
      if (!el) return;
      el.animate(
        [
          { transform: 'translateY(24px)', opacity: 0 },
          { transform: 'translateY(0)', opacity: 1 },
        ],
        { duration: 350, delay: 100 + i * 60, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards' }
      );
    });
  }, []);

  const closeDetail = useCallback(() => {
    const st = stateRef.current;
    if (!st.isOpen) return;

    const detailEl = detailRef.current;
    if (!detailEl) return;

    detailEl.animate(
      [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.92)' }],
      { duration: 250, easing: 'ease-in', fill: 'forwards' }
    ).onfinish = () => {
      detailEl.style.display = 'none';
      st.isOpen = false;
    };
  }, []);

  // ── Active tape visual (cover vs spine) ────────────────────────────────────
  const updateTapeVisuals = useCallback((s: number) => {
    const st = stateRef.current;
    st.tapeEls.forEach((el, i) => {
      const isActive = i === s;
      const H = st.H;
      const spineW = st.spineW;
      const coverW = getCoverW(H);

      const spineEl = el.querySelector<HTMLElement>('.vhs-spine');
      const coverEl = el.querySelector<HTMLElement>('.vhs-cover');
      const playRingEl = el.querySelector<HTMLElement>('.vhs-center-play-btn');
      const badgeEl = el.querySelector<HTMLElement>('.vhs-cover-open-badge');

      if (!spineEl || !coverEl) return;

      if (isActive) {
        // Show cover face, turned out in 3D facing user
        el.style.width = `${coverW}px`;
        el.style.zIndex = '20';
        el.dataset.active = '1';

        spineEl.style.opacity = '0';
        spineEl.style.transform = 'rotateY(-90deg)';

        coverEl.style.opacity = '1';
        coverEl.style.transform = 'rotateY(0deg) rotateZ(0deg) translateZ(28px)';
        coverEl.style.width = `${coverW}px`;
        coverEl.style.height = `${H}px`;
        coverEl.style.overflow = 'visible';

        if (playRingEl) {
          playRingEl.style.opacity = '0';
          playRingEl.style.transform = 'translate(-50%, -50%) scale(0.5)';
          playRingEl.style.pointerEvents = 'none';
          playRingEl.style.display = 'none';
        }
        if (badgeEl) {
          badgeEl.style.display = 'none';
        }
      } else {
        // Show narrow spine
        el.style.width = `${spineW}px`;
        el.style.zIndex = '1';
        el.dataset.active = '0';

        spineEl.style.opacity = '1';
        spineEl.style.transform = 'rotateY(0deg)';
        spineEl.style.width = `${spineW}px`;
        spineEl.style.height = `${H}px`;

        coverEl.style.opacity = '0';
        coverEl.style.transform = 'rotateY(90deg)';

        if (playRingEl) {
          playRingEl.style.opacity = '0';
          playRingEl.style.transform = 'translate(-50%, -50%) scale(0.5)';
          playRingEl.style.pointerEvents = 'none';
          playRingEl.style.display = 'none';
        }
        if (badgeEl) {
          badgeEl.style.display = 'none';
        }
      }
    });
  }, [getCoverW]);

  // ── Set active tape ─────────────────────────────────────────────────────────
  const setActive = useCallback((s: number) => {
    const st = stateRef.current;
    const prev = st.s;
    const prevFilm = prev % N;
    const nextFilm = s % N;

    // Wrap s into middle copy range
    let ns = s;
    if (ns < N) ns += N;
    if (ns >= 2 * N) ns -= N;

    st.sTarget = ns;
    stateRef.current.activeFilmIdx = nextFilm;

    updateTapeVisuals(ns);

    if (prevFilm !== nextFilm) {
      setCaption(nextFilm);
    }
  }, [updateTapeVisuals, setCaption]);

  // ── Decade filter ───────────────────────────────────────────────────────────
  const handleDecadeClick = useCallback((decade: string) => {
    stateRef.current.decade = decade;
    playKeyboardSound(1, true);

    // Update decade bar buttons
    if (decadeBarRef.current) {
      decadeBarRef.current.querySelectorAll<HTMLButtonElement>('[data-decade]').forEach(btn => {
        const isActive = btn.dataset.decade === decade;
        btn.style.color = isActive ? '#D7E2EA' : '#D7E2EA66';
        btn.style.borderColor = isActive ? '#D7E2EA44' : 'transparent';
        btn.style.background = isActive ? '#D7E2EA0A' : 'transparent';
      });
    }

    if (decade === 'ALL') return;
    const idx = FILMS.findIndex(f => filmDecade(f) === decade);
    if (idx !== -1) setActive(idx + N);
  }, [setActive]);

  // ── rAF loop ────────────────────────────────────────────────────────────────
  const tick = useCallback((time: number) => {
    const st = stateRef.current;
    const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05); // cap at 50ms
    lastTimeRef.current = time;

    // Spring toward target
    const diff = st.sTarget - st.s;
    st.vel = st.vel * DAMPING + diff * K_SPRING * dt;
    st.s += st.vel;

    if (Math.abs(diff) < 0.001 && Math.abs(st.vel) < 0.001) {
      st.s = st.sTarget;
      st.vel = 0;
    }

    // Position tapes on shelf
    const H = st.H;
    const spineW = st.spineW;
    const coverW = getCoverW(H);
    const shelfEl = shelfRef.current;
    if (!shelfEl) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    const viewW = shelfEl.parentElement?.clientWidth ?? window.innerWidth;
    // Center the open cover itself, not the spine grid coordinate.
    const activeCenterX = Math.floor(st.s * spineW) + coverW / 2;
    const offsetX = viewW / 2 - activeCenterX;

    shelfEl.style.transform = `translateX(${offsetX}px)`;

    rafRef.current = requestAnimationFrame(tick);
  }, [getCoverW, DAMPING, K_SPRING]);

  // ── Keyboard navigation ─────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const st = stateRef.current;
    if (st.isOpen) {
      if (e.key === 'Escape') closeDetail();
      return;
    }
    if (e.key === 'ArrowLeft') {
      playKeyboardSound(2, false);
      setActive(st.sTarget - 1);
    }
    if (e.key === 'ArrowRight') {
      playKeyboardSound(3, false);
      setActive(st.sTarget + 1);
    }
    if (e.key === 'Enter') {
      playKeyboardSound(0, true);
      openDetail(st.activeFilmIdx);
    }
  }, [setActive, openDetail, closeDetail]);

  // ── Mouse cursor tracking ───────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const st = stateRef.current;
    st.lastMx = e.clientX;
    st.lastMy = e.clientY;
    // GlobalCursor handles all cursor visuals — no internal cursor ring needed
  }, []);

  // ── Wheel scroll ────────────────────────────────────────────────────────────
  const handleWheel = useCallback((e: WheelEvent) => {
    const st = stateRef.current;
    if (st.isOpen) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      const dir = e.deltaX > 0 ? 1 : -1;
      playKeyboardSound(dir > 0 ? 4 : 5, false);
      setActive(st.sTarget + dir);
    }
  }, [setActive]);

  // ── Drag ───────────────────────────────────────────────────────────────────
  const handlePointerDown = useCallback((e: PointerEvent) => {
    const st = stateRef.current;
    st.isDragging = true;
    st.dragStartX = e.clientX;
    st.dragStartS = st.sTarget;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const st = stateRef.current;
    if (!st.isDragging) return;
    const dx = e.clientX - st.dragStartX;
    const steps = -dx / st.spineW;
    const newS = Math.round(st.dragStartS + steps);
    if (newS !== st.sTarget) setActive(newS);
  }, [setActive]);

  const handlePointerUp = useCallback(() => {
    stateRef.current.isDragging = false;
  }, []);

  // ── Main Setup Effect ───────────────────────────────────────────────────────
  useEffect(() => {
    const st = stateRef.current;
    const shelfEl = shelfRef.current;
    const sectionEl = sectionRef.current;
    if (!shelfEl || !sectionEl) return;

    st.H = getH();
    st.spineW = getSpineW(st.H);
    const H = st.H;
    const spineW = st.spineW;
    const coverW = getCoverW(H);

    // Create 3 × 12 = 36 tape elements
    const tapes: HTMLElement[] = [];
    for (let i = 0; i < COPIES * N; i++) {
      const filmIdx = i % N;
      const f = FILMS[filmIdx];

      const tape = document.createElement('div');
      tape.className = 'vhs-tape cursor-pointer';
      tape.dataset.i = String(i);
      tape.dataset.film = f.id;
      tape.dataset.active = '0';
      tape.style.cssText = `
        display: inline-flex;
        align-items: flex-end;
        height: ${H}px;
        width: ${spineW}px;
        position: relative;
        flex-shrink: 0;
        cursor: pointer;
        transition: width 0.38s cubic-bezier(0.22,1,0.36,1);
        vertical-align: bottom;
      `;

      // Spine face
      const spine = document.createElement('div');
      spine.className = 'vhs-spine';
      Object.assign(spine.style, {
        position: 'absolute',
        inset: '0',
        width: `${spineW}px`,
        height: `${H}px`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${(SHEETS[f.spineSheet].W / f.spineBox[2]) * 100}% ${(SHEETS[f.spineSheet].H / f.spineBox[3]) * 100}%`,
        backgroundPosition: `${(f.spineBox[0] / (SHEETS[f.spineSheet].W - f.spineBox[2])) * 100}% ${(f.spineBox[1] / (SHEETS[f.spineSheet].H - f.spineBox[3])) * 100}%`,
        backgroundImage: `url(${SHEETS[f.spineSheet].url})`,
        transition: 'opacity 0.38s ease, transform 0.38s cubic-bezier(0.22,1,0.36,1)',
        transformOrigin: 'right center',
      });

      // Cover face
      const cover = document.createElement('div');
      cover.className = 'vhs-cover cursor-pointer';
      cover.dataset.cover = '1';
      cover.setAttribute('title', `Click to open ${f.title}`);
      Object.assign(cover.style, {
        position: 'absolute',
        left: '0',
        bottom: '0',
        width: `${coverW}px`,
        height: `${H}px`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${(SHEETS[f.coverSheet].W / f.coverBox[2]) * 100}% ${(SHEETS[f.coverSheet].H / f.coverBox[3]) * 100}%`,
        backgroundPosition: `${(f.coverBox[0] / (SHEETS[f.coverSheet].W - f.coverBox[2])) * 100}% ${(f.coverBox[1] / (SHEETS[f.coverSheet].H - f.coverBox[3])) * 100}%`,
        backgroundImage: `url(${SHEETS[f.coverSheet].url})`,
        opacity: '0',
        transform: 'rotateY(90deg)',
        transition: 'opacity 0.38s ease, transform 0.38s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
        transformOrigin: 'left center',
        borderRadius: '3px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08)',
        cursor: 'pointer',
        overflow: 'visible',
      });

      // ── Centered Play Button (exact layout from user reference photo) ──
      const playBtn = document.createElement('div');
      playBtn.className = 'vhs-center-play-btn cursor-pointer';
      playBtn.setAttribute('title', `Click to open ${f.title}`);
      Object.assign(playBtn.style, {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%) scale(0.5)',
        width: '54px',
        height: '54px',
        borderRadius: '50%',
        border: '1.5px solid rgba(255, 255, 255, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: '0',
        transition: 'opacity 0.28s ease, transform 0.25s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.25s ease, background 0.25s ease',
        pointerEvents: 'none',
        zIndex: '30',
        backdropFilter: 'blur(8px)',
        background: 'rgba(0, 0, 0, 0.48)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.7), 0 0 20px rgba(255,255,255,0.15)',
        cursor: 'pointer',
      });
      // Solid white play triangle nudged 2px right
      playBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style="margin-left:2.5px;"><path d="M8 5v14l11-7z"/></svg>
      `;

      // Play button hover & click
      playBtn.addEventListener('mouseenter', () => {
        playBtn.style.transform = 'translate(-50%, -50%) scale(1.15)';
        playBtn.style.background = '#1F3FB0';
        playBtn.style.borderColor = '#ffffff';
        playBtn.style.boxShadow = '0 0 35px rgba(31, 63, 176, 0.95), 0 0 15px rgba(255,255,255,0.8)';
      });
      playBtn.addEventListener('mouseleave', () => {
        playBtn.style.transform = 'translate(-50%, -50%) scale(1)';
        playBtn.style.background = 'rgba(0, 0, 0, 0.48)';
        playBtn.style.borderColor = 'rgba(255, 255, 255, 0.7)';
        playBtn.style.boxShadow = '0 8px 30px rgba(0,0,0,0.7), 0 0 20px rgba(255,255,255,0.15)';
      });
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playKeyboardSound(0, true);
        openDetail(filmIdx);
      });

      // ── Lower Action Badge on Cover ──
      const coverBadge = document.createElement('div');
      coverBadge.className = 'vhs-cover-open-badge cursor-pointer';
      Object.assign(coverBadge.style, {
        position: 'absolute',
        left: '50%',
        bottom: '14px',
        transform: 'translateX(-50%)',
        opacity: '0.85',
        pointerEvents: 'auto',
        cursor: 'pointer',
        transition: 'opacity 0.2s ease, transform 0.2s ease, background 0.2s ease',
        zIndex: '25',
        padding: '5px 13px',
        borderRadius: '9999px',
        background: 'rgba(10, 11, 14, 0.88)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.8)',
        display: 'none',
        alignItems: 'center',
        gap: '6px',
        whiteSpace: 'nowrap',
      });
      coverBadge.innerHTML = `
        <span style="font-family:'Kanit',sans-serif;font-weight:700;font-size:10px;letter-spacing:0.06em;color:#ffffff;text-transform:uppercase;">Click to Read the Book</span>
        <span style="font-family:monospace;font-size:8.5px;color:#D7E2EA88;text-transform:uppercase;background:rgba(255,255,255,0.1);padding:1px 5px;border-radius:9999px;">Single Click</span>
      `;
      coverBadge.addEventListener('mouseenter', () => {
        coverBadge.style.opacity = '1';
        coverBadge.style.background = 'rgba(31, 63, 176, 0.9)';
      });
      coverBadge.addEventListener('mouseleave', () => {
        coverBadge.style.opacity = '0.85';
        coverBadge.style.background = 'rgba(10, 11, 14, 0.88)';
      });
      coverBadge.addEventListener('click', (e) => {
        e.stopPropagation();
        playKeyboardSound(0, true);
        openDetail(filmIdx);
      });

      // Cover hover & click
      cover.addEventListener('mouseenter', () => {
        cover.style.boxShadow = '0 25px 80px rgba(0,0,0,0.95), 0 0 35px rgba(31,63,176,0.65), 0 0 0 1.5px rgba(255,255,255,0.3)';
      });
      cover.addEventListener('mouseleave', () => {
        cover.style.boxShadow = '0 20px 60px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08)';
      });
      cover.addEventListener('click', (e) => {
        e.stopPropagation();
        playKeyboardSound(0, true);
        openDetail(filmIdx);
      });

      cover.appendChild(playBtn);
      cover.appendChild(coverBadge);
      tape.appendChild(spine);
      tape.appendChild(cover);

      // ── HOVER TO TURN (NO CLICK REQUIRED TO REACH THIS STATE!) ──
      // When the user hovers their arrow through any book, it automatically turns out in 3D:
      tape.addEventListener('mouseenter', () => {
        const tapeIdx = parseInt(tape.dataset.i ?? '0');
        if (st.sTarget !== tapeIdx) {
          playKeyboardSound(tapeIdx % N, false);
          setActive(tapeIdx);
        }
      });

      // Single click on the book opens the detail modal
      tape.addEventListener('click', () => {
        playKeyboardSound(filmIdx, true);
        openDetail(filmIdx);
      });

      shelfEl.appendChild(tape);
      tapes.push(tape);
    }

    st.tapeEls = tapes;

    // Always open the fourth book from the left (The Last Summer) on first load.
    st.s = 3 + N;
    st.sTarget = 3 + N;
    st.activeFilmIdx = 3;
    st.vel = 0;

    setCaption(st.activeFilmIdx, false);
    updateTapeVisuals(st.s);

    // Start rAF loop
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);

    // Event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    shelfEl.parentElement?.addEventListener('wheel', handleWheel, { passive: false });
    sectionEl.addEventListener('pointerdown', handlePointerDown as EventListener);
    sectionEl.addEventListener('pointermove', handlePointerMove as EventListener);
    sectionEl.addEventListener('pointerup', handlePointerUp as EventListener);

    // Resize handler
    const handleResize = () => {
      st.H = getH();
      st.spineW = getSpineW(st.H);
      tapes.forEach(tape => {
        const isActive = tape.dataset.active === '1';
        const spEl = tape.querySelector<HTMLElement>('.vhs-spine');
        const cvEl = tape.querySelector<HTMLElement>('.vhs-cover');
        tape.style.height = `${st.H}px`;
        if (spEl) {
          spEl.style.width = `${st.spineW}px`;
          spEl.style.height = `${st.H}px`;
        }
        if (cvEl) {
          cvEl.style.width = `${getCoverW(st.H)}px`;
          cvEl.style.height = `${st.H}px`;
        }
        tape.style.width = isActive ? `${getCoverW(st.H)}px` : `${st.spineW}px`;
      });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      shelfEl.parentElement?.removeEventListener('wheel', handleWheel);
      sectionEl.removeEventListener('pointerdown', handlePointerDown as EventListener);
      sectionEl.removeEventListener('pointermove', handlePointerMove as EventListener);
      sectionEl.removeEventListener('pointerup', handlePointerUp as EventListener);
      window.removeEventListener('resize', handleResize);
      while (shelfEl.firstChild) shelfEl.removeChild(shelfEl.firstChild);
    };
  }, [
    getH, getSpineW, getCoverW, tick, setCaption, updateTapeVisuals,
    setActive, openDetail, handleKeyDown, handleMouseMove, handleWheel,
    handlePointerDown, handlePointerMove, handlePointerUp,
  ]);

  return (
    <section
      ref={sectionRef}
      id="films"
      className="relative overflow-hidden select-none"
      style={{
        background: '#0C0C0C',
        paddingTop: '6rem',
        paddingBottom: '5rem',
        minHeight: '520px',
      }}
    >
      {/* Paper grain overlay — mix-blend-mode overlay for dark bg */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 2,
          opacity: 0.045,
          mixBlendMode: 'screen',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Section label */}
      <div className="text-center mb-8 relative z-10 pointer-events-none">
        <p className="text-xs font-mono uppercase tracking-[0.35em] text-[#D7E2EA]/40">
          A Leon Vasari Film · Selected Works
        </p>
      </div>

      {/* Decade tab bar */}
      <div
        ref={decadeBarRef}
        className="flex items-center justify-center gap-2 mb-10 relative z-10 flex-wrap px-4"
      >
        {DECADES.map((d, i) => (
          <button
            key={d}
            data-decade={d}
            onClick={() => handleDecadeClick(d)}
            className="px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-200 cursor-pointer border active:scale-95"
            style={{
              color: i === 0 ? '#D7E2EA' : '#D7E2EA66',
              borderColor: i === 0 ? '#D7E2EA44' : 'transparent',
              background: i === 0 ? '#D7E2EA0A' : 'transparent',
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Shelf viewport */}
      <div
        className="relative overflow-hidden"
        style={{
          height: 'min(46vh, 31vw)',
          minHeight: '160px',
          maxHeight: '340px',
        }}
      >
        {/* Play/read button moved to the left side of the shelf */}
        <button
          type="button"
          onClick={() => {
            playKeyboardSound(0, true);
            openDetail(stateRef.current.activeFilmIdx);
          }}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-white/30 bg-black/70 backdrop-blur-md flex items-center justify-center text-white hover:text-white hover:border-white/70 hover:bg-[#1F3FB0]/90 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.7),0_0_24px_rgba(31,63,176,0.28)]"
          aria-label="Read the selected book"
          title="Click to Read the Book"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style={{ marginLeft: '2.5px' }}><path d="M8 5v14l11-7z" /></svg>
        </button>

        {/* Right arrow */}
        <button
          onClick={() => {
            playKeyboardSound(3, false);
            setActive(stateRef.current.sTarget + 1);
          }}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-[#D7E2EA]/20 bg-black/60 backdrop-blur-md flex items-center justify-center text-[#D7E2EA]/70 hover:text-[#D7E2EA] hover:border-[#D7E2EA]/50 hover:bg-[#1F3FB0]/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-lg"
          aria-label="Next film"
          title="Next Book"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>

        {/* The tape shelf — imperative DOM */}
        <div
          className="absolute bottom-0 left-0 flex items-end"
          style={{
            willChange: 'transform',
            height: '100%',
            whiteSpace: 'nowrap',
          }}
        >
          <div
            ref={shelfRef}
            style={{
              display: 'inline-flex',
              alignItems: 'flex-end',
              height: '100%',
            }}
          />
        </div>

        {/* Left vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 h-full w-24 sm:w-40 z-20"
          style={{ background: 'linear-gradient(to right, #0C0C0C, transparent)' }}
        />
        {/* Right vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 h-full w-24 sm:w-40 z-20"
          style={{ background: 'linear-gradient(to left, #0C0C0C, transparent)' }}
        />
      </div>

        {/* Caption — film title, romanised + kanji subtitle, year */}
      <div className="mt-8 text-center relative z-10 overflow-hidden">
        <div style={{ overflow: 'hidden', display: 'inline-block' }}>
          <div
            ref={captionTitleRef}
            className="text-[#D7E2EA] font-semibold tracking-tight"
            style={{ fontFamily: "'Kanit', sans-serif", fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)' }}
          />
        </div>
        <div style={{ overflow: 'hidden', marginTop: '4px' }}>
          <div
            ref={captionSubRef}
            className="text-[#1F3FB0] text-xs sm:text-sm font-mono tracking-widest"
            style={{ fontFamily: "'Noto Sans JP', 'Noto Serif SC', sans-serif" }}
          />
        </div>
        <div style={{ overflow: 'hidden', marginTop: '2px' }}>
          <div
            ref={captionYearRef}
            className="text-[#D7E2EA]/45 text-xs font-mono tracking-widest"
          />
        </div>
      </div>

      {/* Custom cursor ring removed — GlobalCursor handles site-wide cursor */}

      {/* Detail overlay */}
      <div
        ref={detailRef}
        className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl items-center justify-center p-4 sm:p-8"
        style={{ display: 'none' }}
      >
        <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-[28px] border border-white/15 bg-[#101115] shadow-[0_40px_120px_rgba(0,0,0,0.95)] p-6 sm:p-10 flex flex-col md:flex-row gap-8">
          {/* Close button */}
          <button
            className="detail-close absolute top-5 right-5 w-9 h-9 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 flex items-center justify-center text-[#D7E2EA] transition-all cursor-pointer z-10"
            onClick={closeDetail}
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>

          {/* Poster */}
          <div
            className="detail-poster flex-shrink-0 rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
            style={{
              width: 'clamp(140px, 30%, 240px)',
              aspectRatio: '344/659',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          />

          {/* Text content */}
          <div className="flex flex-col justify-center gap-4">
            <p className="text-[9px] font-mono uppercase tracking-[0.35em] text-[#D7E2EA]/40">A Leon Vasari Film</p>
            <h2
              className="detail-title text-white font-black uppercase leading-tight"
              style={{ fontFamily: "'Kanit', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
            />
            <p className="detail-meta text-[#D7E2EA]/60 font-mono text-xs uppercase tracking-widest" />
            <p className="detail-desc text-[#D7E2EA]/80 font-light text-sm leading-relaxed" style={{ fontFamily: "'Noto Sans JP', sans-serif" }} />
            <div className="mt-4 flex gap-3 flex-wrap">
              <button
                onClick={closeDetail}
                className="px-5 py-2.5 rounded-full border border-[#D7E2EA]/20 bg-white/5 hover:bg-white/10 text-xs uppercase font-mono tracking-widest text-[#D7E2EA] transition-all cursor-pointer"
              >
                ← Back to Shelf
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VHSShelfSection;
