import React from 'react';
import FadeIn from './FadeIn';
import { Terminal, Code2, Database, Cpu, Wrench, Layers } from 'lucide-react';

const skillsData = [
  {
    number: '01',
    name: 'Programming Languages',
    description:
      'Core compiled and interpreted programming languages used for systems engineering, competitive programming, and application logic.',
    skills: ['C++', 'Python', 'C', 'JavaScript', 'TypeScript', 'Java', 'SQL'],
    icon: Terminal,
  },
  {
    number: '02',
    name: 'Frontend Development',
    description:
      'Building performant, accessible, and responsive user interfaces with modern React paradigms, state management, and modern CSS frameworks.',
    skills: ['React 19', 'Next.js 15', 'Redux Toolkit', 'HTML', 'CSS', 'Tailwind CSS v4'],
    icon: Code2,
  },
  {
    number: '03',
    name: 'Backend & Database',
    description:
      'Designing robust RESTful API endpoints, server routing architectures, relational data models, and type-safe schema migrations.',
    skills: ['Next.js API Routes', 'RESTful API Design', 'Prisma ORM', 'Relational Database Design', 'Data Modeling'],
    icon: Database,
  },
  {
    number: '04',
    name: 'AI & Machine Learning',
    description:
      'Developing computer vision applications, model inference pipelines, feature engineering, and automated dataset cleaning.',
    skills: ['Machine Learning', 'Computer Vision', 'Artificial Intelligence', 'Data Preprocessing'],
    icon: Cpu,
  },
  {
    number: '05',
    name: 'Developer Tools',
    description:
      'Version control, continuous integration, hosting platforms, and modern development environments for productive software engineering.',
    skills: ['Git', 'GitHub', 'VS Code', 'Vercel', 'Netlify'],
    icon: Wrench,
  },
  {
    number: '06',
    name: 'Core Computer Science',
    description:
      'Foundational computer science principles applied in writing memory-efficient, mathematically sound, and scalable software solutions.',
    skills: ['Data Structures & Algorithms (DSA)', 'Object-Oriented Programming (OOP)', 'Database Management Systems (DBMS)'],
    icon: Layers,
  },
];

export const SkillsSection: React.FC = () => {
  return (
    <section
      id="skills"
      className="bg-[#FFFFFF] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 select-none relative z-0"
    >
      <div className="max-w-5xl mx-auto">
        <FadeIn delay={0} y={40} className="text-center">
          <h2 className="text-[#0C0C0C] font-black uppercase tracking-tight leading-none text-[clamp(3rem,12vw,160px)] mb-16 sm:mb-20 md:mb-28">
            Technical Skills
          </h2>
        </FadeIn>

        <div className="flex flex-col border-t border-[rgba(12,12,12,0.15)]">
          {skillsData.map((item, index) => {
            const Icon = item.icon;
            return (
              <FadeIn
                key={item.number}
                delay={index * 0.08}
                y={30}
                className="border-b border-[rgba(12,12,12,0.15)] py-8 sm:py-10 md:py-12 transition-colors duration-300 hover:bg-black/[0.02]"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 md:gap-12">
                  <span className="font-black text-[clamp(3rem,10vw,140px)] leading-none text-[#0C0C0C] tracking-tight shrink-0 select-none">
                    {item.number}
                  </span>

                  <div className="flex flex-col justify-center flex-1">
                    <div className="flex items-center gap-3 mb-2 sm:mb-3">
                      <Icon className="w-6 h-6 text-[#0C0C0C] opacity-80" />
                      <h3 className="font-medium uppercase text-[clamp(1.1rem,2.2vw,2.1rem)] text-[#0C0C0C] tracking-wide">
                        {item.name}
                      </h3>
                    </div>

                    <p className="font-light leading-relaxed max-w-2xl text-[clamp(0.85rem,1.6vw,1.15rem)] text-[#0C0C0C] opacity-60 mb-5">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-2 sm:gap-2.5">
                      {item.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3.5 py-1.5 rounded-full border border-black/15 bg-black/[0.04] backdrop-blur-md text-[#0C0C0C] text-xs sm:text-sm font-medium tracking-wide uppercase shadow-[inset_0_1px_1px_0_rgba(0,0,0,0.05)] hover:bg-black/[0.08] hover:border-black/30 hover:scale-105 transition-all duration-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
