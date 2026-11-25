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
  },
  {
    title: 'Global Rank 1326',
    metric: 'Rank #1326',
    platform: 'CodeChef Starters 227',
    description:
      'Secured Global Rank 1326 out of 25,000+ registered competitive programmers in CodeChef Starters 227 contest.',
    icon: Award,
    badge: 'Top Global Percentile',
  },
  {
    title: 'Rank 5668',
    metric: 'Rank #5668',
    platform: 'Codeforces Round 1064 (Div. 2)',
    description:
      'Achieved Rank 5668 in Codeforces Round 1064 (Div. 2) solving speed-optimized algorithmic problems under tight constraints.',
    icon: Cpu,
    badge: 'Codeforces Div. 2',
  },
  {
    title: 'Rank 7527',
    metric: 'Rank #7527',
    platform: 'LeetCode Weekly Contest 490',
    description:
      'Achieved competitive contest rank 7527 in LeetCode Weekly Contest 490 with clean accepted submissions.',
    icon: Terminal,
    badge: 'LeetCode Contest',
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
          background: `
            radial-gradient(ellipse 50% 45% at 92% 50%, rgba(105, 87, 219, 0.28), transparent 70%),
            radial-gradient(ellipse 65% 40% at 20% 65%, rgba(61, 232, 186, 0.25), transparent 70%),
            linear-gradient(180deg, rgba(9, 45, 52, 0.52) 0%, rgba(4, 6, 10, 0.88) 55%, #04060a 100%)
          `,
        }}
        className="relative rounded-[26px] sm:rounded-[30px] p-6 sm:p-8 md:p-9 flex flex-col justify-between overflow-hidden cursor-pointer select-none backdrop-blur-2xl border border-[#3de8ba]/20 hover:border-[#3de8ba]/45 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(61,232,186,0.06),inset_0_1px_1px_rgba(122,250,217,0.18)] hover:shadow-[0_18px_48px_rgba(0,0,0,0.65),0_0_35px_rgba(61,232,186,0.16),inset_0_1px_1px_rgba(122,250,217,0.3)] transition-all duration-300 group"
      >
        {/* Soft directional spotlight following cursor with Aurora Emerald & Violet tints */}
        <div
          className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: spotlight.opacity,
            background: `radial-gradient(420px circle at ${spotlight.x}px ${spotlight.y}px, rgba(61, 232, 186, 0.25), rgba(105, 87, 219, 0.20) 45%, transparent 75%)`,
          }}
        />

        {/* Ambient Top Edge Luminous Reflection wire */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#7afad9]/60 to-[#6957db]/40 group-hover:via-[#7afad9] transition-all" />

        {/* Layer 1: Top Badge & Elevated 3D Icon */}
        <div
          style={{ transform: 'translateZ(28px)', transformStyle: 'preserve-3d' }}
          className="flex items-center justify-between gap-3 mb-5"
        >
          <span className="px-3.5 py-1 rounded-full bg-[#092d34]/70 border border-[#3de8ba]/30 text-[11px] font-mono uppercase tracking-wider text-[#7afad9] shadow-[0_0_12px_rgba(61,232,186,0.15),inset_0_1px_1px_rgba(122,250,217,0.2)]">
            {item.badge}
          </span>

          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#092d34] to-[#04060a] border border-[#3de8ba]/35 flex items-center justify-center text-[#7afad9] group-hover:text-white group-hover:border-[#7afad9]/70 group-hover:scale-110 transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.5),0_0_16px_rgba(61,232,186,0.18)]">
            <Icon className="w-5 h-5 text-[#7afad9] group-hover:text-[#3de8ba] transition-colors" />
          </div>
        </div>

        {/* Layer 2: Dominant 3D Metric & Titles */}
        <div style={{ transform: 'translateZ(38px)', transformStyle: 'preserve-3d' }}>
          <div className="text-3xl sm:text-4xl md:text-[44px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f0fdf4] to-[#7afad9] tracking-tight uppercase leading-none mb-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            {item.metric}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white/95 uppercase tracking-wide mb-2 group-hover:text-white transition-colors">
            {item.title}
          </h3>

          <div className="text-xs font-mono text-[#7afad9] uppercase tracking-wider font-semibold mb-5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3de8ba] shadow-[0_0_8px_#3de8ba] animate-pulse" />
            <span>{item.platform}</span>
          </div>
        </div>

        {/* Layer 3: Description with Refined Border */}
        <div
          style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}
          className="pt-4 border-t border-[#3de8ba]/15 group-hover:border-[#3de8ba]/30 transition-colors"
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
      className="bg-[#0C0C0C] py-20 sm:py-28 px-5 sm:px-8 md:px-10 select-none border-t border-[#3de8ba]/15 relative overflow-hidden"
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
