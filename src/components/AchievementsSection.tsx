import React from 'react';
import FadeIn from './FadeIn';
import { Trophy, Award, Cpu, Terminal } from 'lucide-react';

const achievementsList = [
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

export const AchievementsSection: React.FC = () => {
  return (
    <section id="achievements" className="bg-[#0C0C0C] py-20 sm:py-28 px-5 sm:px-8 md:px-10 select-none border-t border-[#D7E2EA]/10">
      <div className="max-w-6xl mx-auto">
        <FadeIn delay={0} y={40} className="text-center mb-14 sm:mb-20">
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(2.6rem,10vw,140px)]">
            Achievements
          </h2>
          <p className="text-[#D7E2EA]/70 uppercase tracking-widest font-mono text-xs sm:text-sm mt-4">
            Competitive Programming • Contest Rankings • Algorithmic Mastery
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {achievementsList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <FadeIn
                key={item.title}
                delay={idx * 0.1}
                y={30}
                className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-2xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_1px_0_rgba(255,255,255,0.12)] hover:border-white/35 hover:from-white/[0.09] hover:to-white/[0.04] transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className={`text-[11px] font-mono uppercase tracking-wider ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/15 flex items-center justify-center text-[#BBCCD7] group-hover:scale-110 transition-transform shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight uppercase mb-1">
                    {item.metric}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide mb-2">
                    {item.title}
                  </h3>
                  <div className="text-xs font-mono text-[#B600A8] uppercase tracking-wider mb-4">
                    {item.platform}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#D7E2EA]/75 font-light leading-relaxed pt-4 border-t border-[#D7E2EA]/10">
                  {item.description}
                </p>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
