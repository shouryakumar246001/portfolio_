import React from 'react';
import FadeIn from './FadeIn';
import AnimatedText from './AnimatedText';
import ContactButton from './ContactButton';
import { GraduationCap, MapPin, Terminal } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const aboutText =
    "Computer Science and Engineering undergraduate at KIIT passionate about Software Development and Full-Stack Engineering. Experienced in building scalable full-stack applications with Next.js, React, TypeScript, and Prisma ORM, backed by a strong foundation in Data Structures and Algorithms with 1000+ questions solved. Actively contributing to open-source software with a dedicated focus on writing clean, maintainable, and highly efficient code.";

  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-24 bg-[#0C0C0C] overflow-hidden select-none"
    >
      {/* 4 Corner 3D Decorative Assets */}
      <div className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px] pointer-events-none z-0">
        <FadeIn delay={0.1} x={-80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
            alt="3D Decorative Element"
            className="w-full h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
            loading="lazy"
          />
        </FadeIn>
      </div>

      <div className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px] pointer-events-none z-0">
        <FadeIn delay={0.25} x={-80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
            alt="3D Object"
            className="w-full h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
            loading="lazy"
          />
        </FadeIn>
      </div>

      <div className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px] pointer-events-none z-0">
        <FadeIn delay={0.15} x={80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
            alt="3D Lego Icon"
            className="w-full h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
            loading="lazy"
          />
        </FadeIn>
      </div>

      <div className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px] pointer-events-none z-0">
        <FadeIn delay={0.3} x={80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
            alt="3D Shape Group"
            className="w-full h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
            loading="lazy"
          />
        </FadeIn>
      </div>

      {/* Main Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl text-center">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(3rem,12vw,160px)]">
            About me
          </h2>
        </FadeIn>

        <div className="h-10 sm:h-14 md:h-16" />

        <AnimatedText
          text={aboutText}
          className="max-w-[680px]"
          style={{ fontSize: 'clamp(1rem, 1.8vw, 1.35rem)' }}
        />

        {/* KIIT Education Card */}
        <FadeIn delay={0.3} y={30} className="w-full max-w-xl mt-12">
          <div className="rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-7 text-left shadow-[0_8px_32px_0_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.12)] hover:border-white/30 hover:bg-white/[0.05] transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/15 text-[#BBCCD7] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                    Kalinga Institute of Industrial Technology (KIIT)
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D7E2EA]/80 font-light">
                    Bachelor of Technology • Computer Science and Engineering
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-white uppercase tracking-widest shrink-0">
                2024 – 2028
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-[#D7E2EA]/70">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Bhubaneswar, India
              </span>
              <span className="flex items-center gap-1 text-[#BBCCD7]">
                <Terminal className="w-3.5 h-3.5" /> Core CS • DSA • OOP • DBMS
              </span>
            </div>
          </div>
        </FadeIn>

        <div className="h-14 sm:h-16" />

        <FadeIn delay={0.4} y={20}>
          <ContactButton label="Let's Connect" href="#contact" />
        </FadeIn>
      </div>
    </section>
  );
};

export default AboutSection;
