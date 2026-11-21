import React from 'react';
import FadeIn from './FadeIn';
import { GitPullRequest, Award, Calendar, MapPin, CheckCircle } from 'lucide-react';

const experiencesList = [
  {
    role: 'Open Source Contributor',
    organization: 'Independent Open Source Repositories',
    location: 'Remote',
    period: 'Oct 2024 – Present',
    type: 'Engineering',
    points: [
      'Resolved defects and refactored data preprocessing pipelines across open-source Python machine learning and web repositories.',
      'Delivered frontend UI fixes and improved cross-browser rendering and responsive layouts using JavaScript and CSS.',
      'Participated in code reviews, bug triaging, and documentation improvements for community projects.',
    ],
    icon: GitPullRequest,
    tagColor: 'text-white',
  },
  {
    role: 'Placement Coordinator',
    organization: 'Training & Placement Cell, KIIT',
    location: 'Bhubaneswar, India',
    period: 'Nov 2024 – Present',
    type: 'Leadership & Operations',
    points: [
      'Orchestrated campus recruitment drives, interview scheduling, logistics and communication across university administration, students and corporate HR teams.',
      'Mentored fellow students on recruitment processes, resume preparation and interview readiness.',
      'Streamlined communication pipelines and candidate tracking during high-volume recruitment drives.',
    ],
    icon: Award,
    tagColor: 'text-white',
  },
];

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="bg-[#0C0C0C] py-24 sm:py-32 px-5 sm:px-8 md:px-10 select-none">
      <div className="max-w-5xl mx-auto">
        <FadeIn delay={0} y={40} className="text-center mb-16 sm:mb-24">
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(3rem,12vw,160px)]">
            Experience
          </h2>
          <p className="text-[#D7E2EA]/70 uppercase tracking-widest font-mono text-xs sm:text-sm mt-4">
            Engineering Contributions • Leadership • Coordination
          </p>
        </FadeIn>

        <div className="relative border-l-2 border-[#D7E2EA]/20 ml-4 sm:ml-8 md:ml-12 pl-6 sm:pl-10 space-y-12 sm:space-y-16">
          {experiencesList.map((exp, idx) => {
            const Icon = exp.icon;
            return (
              <FadeIn key={exp.role} delay={idx * 0.15} y={30} className="relative group">
                {/* Timeline Node */}
                <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0C0C0C] border-2 border-[#D7E2EA] flex items-center justify-center shadow-[0_0_15px_rgba(187,204,215,0.6)] group-hover:scale-125 transition-transform duration-300">
                  <div className="w-2 h-2 rounded-full bg-[#B600A8]" />
                </div>

                <div className="rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_1px_0_rgba(255,255,255,0.12)] hover:border-white/30 hover:bg-white/[0.06] transition-all duration-300">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <span className={`text-[11px] font-mono uppercase tracking-wider inline-block mb-2 ${exp.tagColor}`}>
                        {exp.type}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-tight flex items-center gap-2">
                        <Icon className="w-5 h-5 text-[#BBCCD7]" />
                        {exp.role}
                      </h3>
                      <p className="text-sm sm:text-base text-[#D7E2EA]/90 font-medium mt-0.5">
                        {exp.organization}
                      </p>
                    </div>

                    <div className="text-right text-xs font-mono text-[#D7E2EA]/70 space-y-1">
                      <div className="flex items-center gap-1 sm:justify-end">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:justify-end text-[#BBCCD7]">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2.5 mt-4 pt-4 border-t border-[#D7E2EA]/10">
                    {exp.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#D7E2EA]/80 font-light leading-relaxed">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
