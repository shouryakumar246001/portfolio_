import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import FadeIn from './FadeIn';

interface KeyConfig {
  id: string;
  label: string;
  sublabel: string;
  category: string;
  color: string;
  sideColor: string;
  textColor: string;
  shortcut?: string;
  icon: (color: string) => React.ReactNode;
}

// Crisp inline SVGs for 100% reliable rendering without CDN dependencies
const keys: KeyConfig[] = [
  // ROW 1
  {
    id: 'nextjs',
    label: 'NEXT.JS',
    sublabel: 'App Router & Full-Stack',
    category: 'Framework',
    color: '#FFFFFF',
    sideColor: '#CBD5E1',
    textColor: '#09090B',
    shortcut: '1',
    icon: (col) => (
      <svg className="w-8 h-8" viewBox="0 0 180 180" fill="none">
        <path fill={col} d="M125 150L60 62.5V150H45V30H60L125 117.5V30H140V150H125Z" />
        <circle cx="152" cy="142" r="8" fill={col} />
      </svg>
    ),
  },
  {
    id: 'react',
    label: 'REACT',
    sublabel: 'React 19 & Component UI',
    category: 'Frontend',
    color: '#1E293B',
    sideColor: '#475569',
    textColor: '#38BDF8',
    shortcut: '2',
    icon: (col) => (
      <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" stroke={col} strokeWidth="6">
        <ellipse cx="50" cy="50" rx="42" ry="16" />
        <ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(60 50 50)" />
        <ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(120 50 50)" />
        <circle cx="50" cy="50" r="7" fill={col} stroke="none" />
      </svg>
    ),
  },
  {
    id: 'typescript',
    label: 'TYPESCRIPT',
    sublabel: 'Strict Typing & Tooling',
    category: 'Language',
    color: '#2563EB',
    sideColor: '#1D4ED8',
    textColor: '#FFFFFF',
    shortcut: '3',
    icon: () => (
      <div className="flex items-center justify-center font-black tracking-tighter text-xl font-mono text-white">
        TS
      </div>
    ),
  },
  {
    id: 'javascript',
    label: 'JAVASCRIPT',
    sublabel: 'Modern ES6+ & DOM',
    category: 'Language',
    color: '#FACC15',
    sideColor: '#EAB308',
    textColor: '#18181B',
    shortcut: '4',
    icon: () => (
      <div className="flex items-center justify-center font-black tracking-tighter text-xl font-mono text-black">
        JS
      </div>
    ),
  },
  {
    id: 'python',
    label: 'PYTHON',
    sublabel: 'Algorithms & Automation',
    category: 'Language',
    color: '#1E3A5F',
    sideColor: '#2B578A',
    textColor: '#FDE047',
    shortcut: '5',
    icon: () => (
      <svg className="w-8 h-8" viewBox="0 0 110 110" fill="none">
        <path d="M54 10C27 10 28 22 28 22H39C39 22 39 16 54 16C68 16 68 25 68 25V35H24C10 35 10 49 10 49C10 63 21 63 21 63H28V56C28 47 37 47 37 47H68C76 47 80 43 80 35V22C80 10 54 10 54 10Z" fill="#38BDF8" />
        <path d="M56 100C83 100 82 88 82 88H71C71 88 71 94 56 94C42 94 42 85 42 85V75H86C100 75 100 61 100 61C100 47 89 47 89 47H82V54C82 63 73 63 73 63H42C34 63 30 67 30 75V88C30 100 56 100 56 100Z" fill="#FACC15" />
        <circle cx="43" cy="20" r="3.5" fill="#1E3A5F" />
        <circle cx="67" cy="90" r="3.5" fill="#1E3A5F" />
      </svg>
    ),
  },

  // ROW 2
  {
    id: 'cpp',
    label: 'C++',
    sublabel: 'DSA & Systems',
    category: 'Language',
    color: '#0284C7',
    sideColor: '#0369A1',
    textColor: '#FFFFFF',
    shortcut: 'q',
    icon: (col) => (
      <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none">
        <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" stroke={col} strokeWidth="6" fill="rgba(255,255,255,0.1)" />
        <text x="50" y="60" textAnchor="middle" fill={col} fontSize="32" fontWeight="bold" fontFamily="sans-serif">C++</text>
      </svg>
    ),
  },
  {
    id: 'nodejs',
    label: 'NODE.JS',
    sublabel: 'Server Runtime & APIs',
    category: 'Backend',
    color: '#22C55E',
    sideColor: '#16A34A',
    textColor: '#FFFFFF',
    shortcut: 'w',
    icon: (col) => (
      <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none">
        <polygon points="50,10 88,32 88,76 50,98 12,76 12,32" stroke={col} strokeWidth="6" fill="rgba(0,0,0,0.15)" />
        <text x="50" y="60" textAnchor="middle" fill={col} fontSize="30" fontWeight="900" fontFamily="monospace">JS</text>
      </svg>
    ),
  },
  {
    id: 'tailwind',
    label: 'TAILWIND',
    sublabel: 'Utility CSS & Design',
    category: 'Styling',
    color: '#06B6D4',
    sideColor: '#0891B2',
    textColor: '#FFFFFF',
    shortcut: 'e',
    icon: (col) => (
      <svg className="w-8 h-8" viewBox="0 0 100 60" fill={col}>
        <path d="M26 14c-12 0-19 6-21 18 5-6 10-8 15-6 4 1 6 4 9 7 5 5 11 11 23 11 12 0 19-6 21-18-5 6-10 8-15 6-4-1-6-4-9-7-5-5-11-11-23-11zm24 16c-12 0-19 6-21 18 5-6 10-8 15-6 4 1 6 4 9 7 5 5 11 11 23 11 12 0 19-6 21-18-5 6-10 8-15 6-4-1-6-4-9-7-5-5-11-11-23-11z" />
      </svg>
    ),
  },
  {
    id: 'redux',
    label: 'REDUX',
    sublabel: 'Centralized State Toolkit',
    category: 'State Mgmt',
    color: '#8B5CF6',
    sideColor: '#7C3AED',
    textColor: '#FFFFFF',
    shortcut: 'r',
    icon: (col) => (
      <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" stroke={col} strokeWidth="6">
        <circle cx="50" cy="30" r="14" fill="rgba(255,255,255,0.2)" />
        <circle cx="32" cy="65" r="14" fill="rgba(255,255,255,0.2)" />
        <circle cx="68" cy="65" r="14" fill="rgba(255,255,255,0.2)" />
        <path d="M50 44 L32 51 M50 44 L68 51 M46 65 L54 65" />
      </svg>
    ),
  },
  {
    id: 'prisma',
    label: 'PRISMA',
    sublabel: 'Relational ORM & DB',
    category: 'Database',
    color: '#334155',
    sideColor: '#475569',
    textColor: '#E2E8F0',
    shortcut: 't',
    icon: (col) => (
      <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none">
        <polygon points="50,12 85,88 15,88" stroke={col} strokeWidth="6" fill="rgba(56,189,248,0.15)" />
        <line x1="50" y1="12" x2="50" y2="88" stroke={col} strokeWidth="4" />
      </svg>
    ),
  },

  // ROW 3
  {
    id: 'nextjs-api',
    label: 'NEXT.JS API',
    sublabel: 'Serverless Edge Handlers',
    category: 'Backend',
    color: '#27272A',
    sideColor: '#52525B',
    textColor: '#E4E4E7',
    shortcut: 'a',
    icon: (col) => (
      <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none">
        <rect x="15" y="25" width="70" height="50" rx="8" stroke={col} strokeWidth="5" fill="none" />
        <path d="M30 50L42 60L42 40" stroke={col} strokeWidth="4" strokeLinecap="round" />
        <line x1="50" y1="62" x2="68" y2="62" stroke={col} strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'git',
    label: 'GIT',
    sublabel: 'Version Control & Flow',
    category: 'DevOps',
    color: '#F97316',
    sideColor: '#EA580C',
    textColor: '#FFFFFF',
    shortcut: 's',
    icon: (col) => (
      <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" stroke={col} strokeWidth="6" strokeLinecap="round">
        <line x1="30" y1="20" x2="30" y2="80" />
        <circle cx="30" cy="25" r="9" fill={col} />
        <circle cx="30" cy="75" r="9" fill={col} />
        <path d="M30 55 C 50 55, 70 45, 70 35" />
        <circle cx="70" cy="35" r="9" fill={col} />
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'GITHUB',
    sublabel: 'CI/CD & Collaboration',
    category: 'Platform',
    color: '#27272A',
    sideColor: '#52525B',
    textColor: '#F4F4F5',
    shortcut: 'd',
    icon: (col) => (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill={col}>
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    id: 'vercel',
    label: 'VERCEL',
    sublabel: 'Deployment & Edge CDN',
    category: 'Cloud',
    color: '#18181B',
    sideColor: '#52525B',
    textColor: '#F4F4F5',
    shortcut: 'f',
    icon: (col) => (
      <svg className="w-8 h-8" viewBox="0 0 100 100" fill={col}>
        <polygon points="50,15 90,85 10,85" />
      </svg>
    ),
  },
  {
    id: 'netlify',
    label: 'NETLIFY',
    sublabel: 'Serverless JAMStack',
    category: 'Cloud',
    color: '#14B8A6',
    sideColor: '#0D9488',
    textColor: '#FFFFFF',
    shortcut: 'g',
    icon: (col) => (
      <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" stroke={col} strokeWidth="6" strokeLinejoin="round">
        <polygon points="50,10 90,50 50,90 10,50" />
        <line x1="50" y1="10" x2="50" y2="90" strokeWidth="4" />
        <line x1="10" y1="50" x2="90" y2="50" strokeWidth="4" />
      </svg>
    ),
  },

  // ROW 4
  {
    id: 'html',
    label: 'HTML',
    sublabel: 'Semantic Web Structure',
    category: 'Web',
    color: '#EA580C',
    sideColor: '#C2410C',
    textColor: '#FFFFFF',
    shortcut: 'z',
    icon: (col) => (
      <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none">
        <polygon points="15,10 85,10 78,85 50,95 22,85" fill="rgba(0,0,0,0.15)" stroke={col} strokeWidth="5" strokeLinejoin="round" />
        <text x="50" y="66" textAnchor="middle" fill={col} fontSize="44" fontWeight="900" fontFamily="sans-serif">5</text>
      </svg>
    ),
  },
  {
    id: 'css',
    label: 'CSS',
    sublabel: 'Responsive Layouts & Motion',
    category: 'Styling',
    color: '#3B82F6',
    sideColor: '#2563EB',
    textColor: '#FFFFFF',
    shortcut: 'x',
    icon: (col) => (
      <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none">
        <polygon points="15,10 85,10 78,85 50,95 22,85" fill="rgba(0,0,0,0.15)" stroke={col} strokeWidth="5" strokeLinejoin="round" />
        <text x="50" y="66" textAnchor="middle" fill={col} fontSize="44" fontWeight="900" fontFamily="sans-serif">3</text>
      </svg>
    ),
  },
  {
    id: 'sql',
    label: 'SQL',
    sublabel: 'PostgreSQL & MySQL Querying',
    category: 'Database',
    color: '#475569',
    sideColor: '#64748B',
    textColor: '#F8FAFC',
    shortcut: 'c',
    icon: (col) => (
      <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" stroke={col} strokeWidth="6">
        <ellipse cx="50" cy="25" rx="34" ry="12" />
        <path d="M16 25 v 24 c 0 7 15 12 34 12 s 34 -5 34 -12 v -24" />
        <path d="M16 49 v 24 c 0 7 15 12 34 12 s 34 -5 34 -12 v -24" />
      </svg>
    ),
  },
  {
    id: 'opencv',
    label: 'OPENCV',
    sublabel: 'Computer Vision & Images',
    category: 'AI / Vision',
    color: '#84CC16',
    sideColor: '#65A30D',
    textColor: '#FFFFFF',
    shortcut: 'v',
    icon: () => (
      <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="32" r="15" stroke="#EF4444" strokeWidth="6" fill="rgba(239,68,68,0.2)" />
        <circle cx="32" cy="65" r="15" stroke="#22C55E" strokeWidth="6" fill="rgba(34,197,94,0.2)" />
        <circle cx="68" cy="65" r="15" stroke="#3B82F6" strokeWidth="6" fill="rgba(59,130,246,0.2)" />
      </svg>
    ),
  },
  {
    id: 'ml-ai',
    label: 'ML / AI',
    sublabel: 'Neural Nets & Intelligence',
    category: 'AI / Model',
    color: '#FB923C',
    sideColor: '#EA580C',
    textColor: '#FFFFFF',
    shortcut: 'b',
    icon: (col) => (
      <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" stroke={col} strokeWidth="6" strokeLinecap="round">
        <polygon points="50,15 85,35 85,75 50,95 15,75 15,35" strokeWidth="4" />
        <circle cx="50" cy="15" r="6" fill={col} />
        <circle cx="85" cy="35" r="6" fill={col} />
        <circle cx="85" cy="75" r="6" fill={col} />
        <circle cx="50" cy="95" r="6" fill={col} />
        <circle cx="15" cy="75" r="6" fill={col} />
        <circle cx="15" cy="35" r="6" fill={col} />
        <circle cx="50" cy="55" r="8" fill={col} />
      </svg>
    ),
  },
];

// High-fidelity Web Audio API mechanical keyboard switch synthesizer
let sharedAudioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioCtx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) sharedAudioCtx = new AudioCtx();
  }
  return sharedAudioCtx;
}

function executeSound(ctx: AudioContext, pitchOffset = 0, isPress = false) {
  try {
    const now = ctx.currentTime;

    // 1. Mechanical switch tactile click (tonal impulse)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    const baseFreq = isPress ? 220 : 640;
    const freq = Math.max(120, baseFreq + (pitchOffset % 5) * 35 + (Math.random() * 40 - 20));

    osc.type = isPress ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(60, freq * 0.3), now + (isPress ? 0.09 : 0.05));

    // Clear, audible volume
    const vol = isPress ? 0.45 : 0.32;
    oscGain.gain.setValueAtTime(vol, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + (isPress ? 0.09 : 0.05));

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + (isPress ? 0.1 : 0.06));

    // 2. Crisp keycap plastic snap (high-frequency tactile noise)
    const bufferSize = Math.floor(ctx.sampleRate * (isPress ? 0.025 : 0.018));
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(isPress ? 2200 : 4400, now);
    noiseFilter.Q.setValueAtTime(2.2, now);

    const noiseGain = ctx.createGain();
    const noiseVol = isPress ? 0.42 : 0.34;
    noiseGain.gain.setValueAtTime(noiseVol, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + (isPress ? 0.024 : 0.017));

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + (isPress ? 0.026 : 0.019));
  } catch {
    // Graceful fallback
  }
}

function playKeycapSound(pitchOffset = 0, isPress = false) {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        executeSound(ctx, pitchOffset, isPress);
      }).catch(() => { });
    } else {
      executeSound(ctx, pitchOffset, isPress);
    }
  } catch {
    // Graceful fallback
  }
}

export const KeycapSkillsSection: React.FC = () => {
  const [activeKey, setActiveKey] = useState<KeyConfig | null>(keys[0]);
  const [pressedKeyId, setPressedKeyId] = useState<string | null>(null);

  const handleKeyInteraction = useCallback((key: KeyConfig, isPress: boolean) => {
    setActiveKey(key);
    if (isPress) {
      setPressedKeyId(key.id);
    }
    // Keyboard sound is ALWAYS ON
    const idx = keys.findIndex((k) => k.id === key.id);
    playKeycapSound(idx, isPress);
  }, []);

  const handleKeyRelease = useCallback(() => {
    setPressedKeyId(null);
  }, []);

  // Pre-unlock Web Audio on first user interaction so hover sound is immediately active
  useEffect(() => {
    const unlock = () => {
      const ctx = getAudioCtx();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => { });
      }
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('mousemove', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('mousemove', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  // Physical keyboard key press listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      const keyChar = e.key.toLowerCase();
      const matched = keys.find(
        (k) =>
          k.shortcut?.toLowerCase() === keyChar ||
          k.label.toLowerCase().startsWith(keyChar)
      );
      if (matched) {
        handleKeyInteraction(matched, true);
        setTimeout(() => setPressedKeyId(null), 180);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKeyInteraction]);

  // --- "Explore My Skills" 3D scroll transform (same as Hero heading) ---
  const headingRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: headingScrollY } = useScroll({
    target: headingRef,
    offset: ['start end', 'end start'],
  });
  const smoothHeading = useSpring(headingScrollY, { stiffness: 80, damping: 22, restDelta: 0.001 });
  const headingRotateX = useTransform(smoothHeading, [0, 0.5, 1], [0, 0, 28]);
  const headingScale = useTransform(smoothHeading, [0, 0.5, 1], [1, 1, 0.88]);
  const headingOpacity = useTransform(smoothHeading, [0, 0.5, 0.85, 1], [1, 1, 0.75, 0]);
  const headingY = useTransform(smoothHeading, [0, 1], [0, 50]);

  const boardRef = useRef<HTMLDivElement>(null);
  const [boardRot, setBoardRot] = useState({ x: 18, y: -3 });

  const handleBoardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth interactive 3D tilt around the natural resting perspective (18deg X, -3deg Y)
    const tiltX = 18 - ((y - centerY) / centerY) * 11;
    const tiltY = -3 + ((x - centerX) / centerX) * 13;

    setBoardRot({ x: tiltX, y: tiltY });
  };

  const handleBoardMouseLeave = () => {
    setBoardRot({ x: 18, y: -3 });
  };

  return (
    <section id="keycaps" className="bg-[#0C0C0C] py-20 sm:py-28 px-4 sm:px-6 overflow-hidden select-none">
      {/* Section Header — 3D scroll transform matching HeroSection */}
      <div
        ref={headingRef}
        className="text-center mb-10 sm:mb-14 max-w-4xl mx-auto overflow-hidden"
        style={{ perspective: 1200 }}
      >
        <motion.div
          style={{
            rotateX: headingRotateX,
            scale: headingScale,
            opacity: headingOpacity,
            y: headingY,
            transformStyle: 'preserve-3d',
          }}
          className="inline-block w-full"
        >
          <h2
            className="hero-heading font-black uppercase tracking-tight leading-none text-[clamp(2.5rem,7vw,90px)] drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] cursor-default"
            style={{
              fontFamily: 'Kanit, sans-serif',
              transform: 'translateZ(35px)',
              transformStyle: 'preserve-3d',
              textShadow: '0 4px 20px rgba(0,0,0,0.85), 0 10px 40px rgba(182,0,168,0.25)',
            }}
          >
            Explore My Skills
          </h2>
          <p
            className="text-[#D7E2EA]/70 text-xs sm:text-sm font-mono uppercase tracking-widest mt-3 flex items-center justify-center gap-2"
            style={{ transform: 'translateZ(18px)' }}
          >
            <span>Hover, tap, or press a key</span>
          </p>
        </motion.div>
      </div>

      {/* Main 3D Keypad Container */}
      <FadeIn delay={0.1} y={40}>
        <div
          className="mx-auto w-full max-w-4xl"
          style={{
            perspective: 1200,
            perspectiveOrigin: '50% 25%',
          }}
        >
          <motion.div
            ref={boardRef}
            onMouseMove={handleBoardMouseMove}
            onMouseLeave={handleBoardMouseLeave}
            animate={{
              rotateX: boardRot.x,
              rotateY: boardRot.y,
            }}
            transition={{
              type: 'spring',
              stiffness: 240,
              damping: 22,
              mass: 0.75,
            }}
            className="relative mx-auto rounded-[32px] p-5 sm:p-7 md:p-9"
            style={{
              transformStyle: 'preserve-3d',
              background: 'linear-gradient(165deg, #222226 0%, #151518 50%, #0d0d0f 100%)',
              boxShadow:
                '0 40px 90px rgba(0,0,0,0.95), 0 0 0 1.5px rgba(255,255,255,0.1), inset 0 2px 2px rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.06)',
              maxWidth: 720,
              willChange: 'transform',
            }}
          >
            {/* 4x5 Mechanical Keypad Grid */}
            <div
              className="grid gap-3.5 sm:gap-4.5 md:gap-5 justify-center pb-2"
              style={{
                gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
              }}
            >
              {keys.map((k) => {
                const isHovered = activeKey?.id === k.id;
                const isPressed = pressedKeyId === k.id;

                return (
                  <div
                    key={k.id}
                    className="relative cursor-pointer select-none group"
                    style={{
                      height: 94,
                      // Outer stable hit-box prevents ANY hover flickering!
                    }}
                    onMouseEnter={() => handleKeyInteraction(k, false)}
                    onMouseDown={() => handleKeyInteraction(k, true)}
                    onMouseUp={handleKeyRelease}
                    onMouseLeave={() => {
                      if (pressedKeyId === k.id) handleKeyRelease();
                    }}
                    onTouchStart={() => handleKeyInteraction(k, true)}
                    onTouchEnd={handleKeyRelease}
                  >
                    {/* Keycap Body (with 3D bottom bevel extrusion) */}
                    <div
                      className="w-full h-[82px] sm:h-[86px] rounded-2xl relative transition-all duration-100 ease-out"
                      style={{
                        transform: isPressed
                          ? 'translateY(8px)'
                          : isHovered
                            ? 'translateY(-4px)'
                            : 'translateY(0)',
                      }}
                    >
                      {/* 3D Side Shadow / Extrusion (Taller lifted side wall) */}
                      <div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{
                          background: k.sideColor,
                          transform: isPressed ? 'translateY(3px)' : 'translateY(13px)',
                          borderBottom: '3px solid rgba(0,0,0,0.35)',
                          boxShadow: isPressed
                            ? `0 2px 4px rgba(0,0,0,0.45)`
                            : isHovered
                            ? `0 16px 26px rgba(0,0,0,0.75), 0 3px 6px rgba(0,0,0,0.5)`
                            : `0 12px 20px rgba(0,0,0,0.65), 0 2px 4px rgba(0,0,0,0.45)`,
                          transition: 'transform 0.08s ease, box-shadow 0.08s ease',
                        }}
                      />

                      {/* 3D Top Cap Surface */}
                      <div
                        className="absolute inset-0 rounded-2xl flex flex-col items-center justify-between p-2 pb-2.5 overflow-hidden"
                        style={{
                          background: `linear-gradient(180deg, ${k.color} 0%, ${k.color} 88%, ${k.sideColor} 100%)`,
                          border: '1px solid rgba(255,255,255,0.32)',
                          borderBottom: '2.5px solid rgba(0,0,0,0.3)',
                          boxShadow: isHovered
                            ? `inset 0 1.5px 2px rgba(255,255,255,0.75), 0 0 18px ${k.color}45`
                            : 'inset 0 1px 1.5px rgba(255,255,255,0.5)',
                        }}
                      >
                        {/* Keycap Icon */}
                        <div className="flex-1 flex items-center justify-center w-full transition-transform duration-100 group-hover:scale-105">
                          {k.icon(k.textColor)}
                        </div>

                        {/* Keycap Label */}
                        <span
                          className="text-[9px] sm:text-[10px] font-black uppercase tracking-tight text-center leading-none mt-1"
                          style={{
                            color: k.textColor,
                            fontFamily: 'Kanit, sans-serif',
                            textShadow: k.color === '#FFFFFF' ? 'none' : '0 1px 2px rgba(0,0,0,0.6)',
                          }}
                        >
                          {k.label}
                        </span>

                        {/* Subtle tactile switch shine */}
                        <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-2xl" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Mechanical Switch Indicators / Model Decals */}
            <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between px-2 text-white/30 text-[11px] font-mono">
              <div className="flex items-center gap-4">
                <span>MX-TACTILE</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">4x5 ORTHO MATRIX</span>
              </div>
              <div className="flex items-center gap-3">
                {[2, 5, 9, 7, 8].map((n) => (
                  <span
                    key={n}
                    className="w-5 h-5 rounded flex items-center justify-center bg-white/5 border border-white/10 text-[10px] text-white/40"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </FadeIn>
    </section>
  );
};

export default KeycapSkillsSection;
