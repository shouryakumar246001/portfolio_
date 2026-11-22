import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import FadeIn from './FadeIn';
import Heading3D from './Heading3D';
import { Trophy, Award, Cpu, Terminal, LucideIcon } from 'lucide-react';
import { playKeyboardSound } from '../utils/audio';

interface AchievementItem {
  title: string;
  metric: string;
  platform: string;
  description: string;
  icon: LucideIcon;
  badge: string;
  badgeColor: string;
}

const achievementsList: AchievementItem[] = [
  {
    title: '1000+ Questions Solved',
    metric: '1000+',
    platform: 'LeetCode • Codeforces • CodeChef',
    description:
      'Mastered core topics including Data Structures, Dynamic Programming, Graph Theory, and Greedy Algorithms across prominent online judges.',
    icon: Trophy,
    badge: 'Algorithms & Problem Solving',
    badgeColor: 'text-white',
  },
  {
    title: 'Global Rank 1326',
    metric: 'Rank #1326',
    platform: 'CodeChef Starters 227',
    description:
      'Secured Global Rank 1326 out of 25,000+ registered competitive programmers in CodeChef Starters 227 contest.',
    icon: Award,
    badge: 'Top Global Percentile',
    badgeColor: 'text-white',
  },
  {
    title: 'Rank 5668',
    metric: 'Rank #5668',
    platform: 'Codeforces Round 1064 (Div. 2)',
    description:
      'Achieved Rank 5668 in Codeforces Round 1064 (Div. 2) solving speed-optimized algorithmic problems under tight constraints.',
    icon: Cpu,
    badge: 'Codeforces Div. 2',
    badgeColor: 'text-white',
  },
  {
    title: 'Rank 7527',
    metric: 'Rank #7527',
    platform: 'LeetCode Weekly Contest 490',
    description:
      'Achieved competitive contest rank 7527 in LeetCode Weekly Contest 490 with clean accepted submissions.',
    icon: Terminal,
    badge: 'LeetCode Contest',
    badgeColor: 'text-white',
  },
];

const AchievementCard3D: React.FC<{ item: AchievementItem; index: number }> = ({ item, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle, restrained 3D tilt (max 7 degrees)
    setRotation({
      x: -((y - centerY) / centerY) * 7,
      y: ((x - centerX) / centerX) * 7,
    });
    setSpotlight({ x, y, opacity: 1 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playKeyboardSound(index, false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  const Icon = item.icon;

  return (
    <div style={{ perspective: 1100 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => playKeyboardSound(index, true)}
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
          y: isHovered ? -8 : 0,
          scale: isHovered ? 1.015 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 350,
          damping: 22,
          mass: 0.6,
        }}
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        className="relative rounded-[26px] sm:rounded-[30px] p-6 sm:p-8 md:p-9 flex flex-col justify-between overflow-hidden cursor-pointer select-none bg-[#101115]/95 border border-white/15 hover:border-[#B600A8]/50 shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:shadow-[0_25px_60px_rgba(182,0,168,0.35),0_0_30px_rgba(255,255,255,0.08)] transition-colors duration-300 group"
      >
        {/* Soft directional spotlight following the cursor */}
        <div
          className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: spotlight.opacity,
            background: `radial-gradient(420px circle at ${spotlight.x}px ${spotlight.y}px, rgba(182, 0, 168, 0.18), rgba(255, 255, 255, 0.04) 40%, transparent 80%)`,
          }}
        />

        {/* Ambient Top Edge Luminous Reflection */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:via-[#B600A8]/60 transition-colors" />

        {/* Layer 1: Top Badge & Elevated 3D Icon */}
        <div
          style={{ transform: 'translateZ(28px)', transformStyle: 'preserve-3d' }}
          className="flex items-center justify-between gap-3 mb-5"
        >
          <span className="px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-[11px] font-mono uppercase tracking-wider text-white/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
            {item.badge}
          </span>

          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 flex items-center justify-center text-[#E2E8F0] group-hover:text-white group-hover:border-[#B600A8]/50 group-hover:scale-110 transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]">
            <Icon className="w-5 h-5 text-white/90 group-hover:text-[#F0ABFC] transition-colors" />
          </div>
        </div>

        {/* Layer 2: Dominant 3D Metric & Titles */}
        <div style={{ transform: 'translateZ(38px)', transformStyle: 'preserve-3d' }}>
          <div className="text-3xl sm:text-4xl md:text-[44px] font-black text-white tracking-tight uppercase leading-none mb-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            {item.metric}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white/95 uppercase tracking-wide mb-2 group-hover:text-white transition-colors">
            {item.title}
          </h3>

          <div className="text-xs font-mono text-[#E879F9] uppercase tracking-wider font-semibold mb-5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B600A8] animate-pulse" />
            <span>{item.platform}</span>
          </div>
        </div>

        {/* Layer 3: Description with Refined Border */}
        <div
          style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}
          className="pt-4 border-t border-white/10 group-hover:border-white/20 transition-colors"
        >
          <p className="text-xs sm:text-sm text-[#D7E2EA]/80 font-light leading-relaxed">
            {item.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export const AchievementsSection: React.FC = () => {
  return (
    <section
      id="achievements"
      className="bg-[#0C0C0C] py-20 sm:py-28 px-5 sm:px-8 md:px-10 select-none border-t border-[#D7E2EA]/10 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <Heading3D
          title="Achievements"
          subtitle="Competitive Programming • Contest Rankings • Algorithmic Mastery"
          className="mb-14 sm:mb-20"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {achievementsList.map((item, idx) => (
            <FadeIn key={item.title} delay={idx * 0.12} y={30}>
              <AchievementCard3D item={item} index={idx} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
