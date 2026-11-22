import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import FadeIn from './FadeIn';
import ResumeModal from './ResumeModal';
import ParticleCloud from './ParticleCloud';
import { Github, Linkedin, Download } from 'lucide-react';
import { playKeyboardSound } from '../utils/audio';

export const HeroSection: React.FC = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const heroHeadingRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroHeadingRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    restDelta: 0.001,
  });

  // 3D transformation functioning like Project and Experience section headings
  const scrollRotateX = useTransform(smoothProgress, [0, 1], [0, 30]);
  const scale = useTransform(smoothProgress, [0, 1], [1, 0.88]);
  const opacity = useTransform(smoothProgress, [0, 0.7, 1], [1, 0.8, 0]);
  const y = useTransform(smoothProgress, [0, 1], [0, 60]);

  const handleDownloadResume = () => {
    playKeyboardSound(0, true);
    const link = document.createElement('a');
    link.href = '/Shourya_Kumar_Resume.pdf';
    link.download = 'Shourya_Kumar_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsResumeOpen(true);
  };

  return (
    <>
      <section className="relative z-10 min-h-screen flex flex-col justify-between overflow-hidden bg-[#0C0C0C] select-none pt-4 sm:pt-6 pb-8 sm:pb-12">
        {/* Full-bleed interactive 3D particle cloud - seamless transition */}
        <ParticleCloud />

        {/* Soft bottom gradient fade into Marquee section for a completely fluent transition */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/80 to-transparent pointer-events-none z-10" />

        {/* Top Navbar */}
        <FadeIn delay={0} y={-20} className="w-full z-20 relative pointer-events-auto pt-3 sm:pt-4">
          <nav className="flex justify-between items-center px-6 sm:px-8 py-3 mx-3 sm:mx-6 md:mx-auto max-w-6xl rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.12)] text-[#D7E2EA] font-medium uppercase tracking-wider text-xs sm:text-sm md:text-base">
            <div className="flex items-center gap-5 sm:gap-8 md:gap-10">
              <a href="#about" className="hover:opacity-70 transition-opacity duration-200 cursor-pointer no-underline text-[#D7E2EA]">About</a>
              <a href="#skills" className="hover:opacity-70 transition-opacity duration-200 cursor-pointer no-underline text-[#D7E2EA]">Skills</a>
              <a href="#projects" className="hover:opacity-70 transition-opacity duration-200 cursor-pointer no-underline text-[#D7E2EA]">Projects</a>
              <a href="#experience" className="hover:opacity-70 transition-opacity duration-200 cursor-pointer hidden sm:inline-block no-underline text-[#D7E2EA]">Experience</a>
              <a href="#contact" className="hover:opacity-70 transition-opacity duration-200 cursor-pointer no-underline text-[#D7E2EA]">Contact</a>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <a
                href="https://github.com/shouryakumar246001"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md hover:border-white/40 hover:bg-white/10 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)] text-[#D7E2EA] transition-all duration-200"
                title="GitHub"
              >
                <Github className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </a>
              <a
                href="https://linkedin.com/in/shourya-kumar-9143372b9"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md hover:border-white/40 hover:bg-white/10 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)] text-[#D7E2EA] transition-all duration-200"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </a>
              <a
                href="https://codolio.com/profile/sugaa.shourya"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md hover:border-white/40 hover:bg-white/10 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)] text-[#D7E2EA] transition-all duration-200 flex items-center justify-center"
                title="Codolio"
              >
                <img src="/codolio.png" alt="Codolio" className="w-4 h-4 sm:w-4.5 sm:h-4.5 object-contain" />
              </a>
              <button
                onClick={handleDownloadResume}
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-md text-xs uppercase tracking-wider font-medium text-[#D7E2EA] hover:bg-white/10 hover:border-white/40 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)] transition-all cursor-pointer"
                title="Download Resume"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Resume</span>
              </button>
            </div>
          </nav>
        </FadeIn>

        {/* Hero Heading: "Hi, I'm Shourya Kumar." with 3D depth and original design */}
        <div
          ref={heroHeadingRef}
          className="w-full overflow-hidden mt-6 sm:mt-4 md:mt-2 z-10 relative text-center px-4"
          style={{ perspective: 1200 }}
        >
          <motion.div
            style={{
              rotateX: scrollRotateX,
              scale,
              opacity,
              y,
              transformStyle: 'preserve-3d',
            }}
            className="inline-block w-full cursor-default"
          >
            <h1
              className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[9.5vw] sm:text-[11vw] md:text-[12.5vw] lg:text-[13.5vw] select-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)]"
              style={{
                transform: 'translateZ(35px)',
                transformStyle: 'preserve-3d',
                textShadow: '0 4px 20px rgba(0,0,0,0.85), 0 10px 40px rgba(182,0,168,0.25)',
              }}
            >
              Hi, I&apos;m Shourya Kumar.
            </h1>

            <div
              style={{ transform: 'translateZ(18px)' }}
              className="flex items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-4 text-[#D7E2EA]/80 font-medium uppercase tracking-widest text-[clamp(0.7rem,1.2vw,1.1rem)]"
            >
              <span className="text-[#BBCCD7]">Software Developer</span>
              <span className="text-[#B600A8]">•</span>
              <span className="text-[#BBCCD7]">Full-Stack Developer</span>
              <span className="text-[#B600A8]">•</span>
              <span className="text-[#BBCCD7]">Competitive Programmer</span>
            </div>
          </motion.div>
        </div>

        {/* Center open area: 3D Donut is fully visible and interactive here */}
        <div className="flex-1 w-full min-h-[320px] sm:min-h-[400px] md:min-h-[460px] pointer-events-none" />

        {/* Bottom Bar: Left Description, Right Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end px-6 md:px-10 pb-4 sm:pb-6 z-20 relative w-full gap-6 pointer-events-auto">
          <FadeIn delay={0.35} y={20} className="max-w-xl text-center md:text-left">
            <p className="text-[#D7E2EA] font-light leading-relaxed text-xs sm:text-sm md:text-base opacity-90">
              I&apos;m a Computer Science and Engineering undergraduate passionate about building scalable web applications, solving complex problems, and developing practical software solutions. I enjoy working across the full stack, exploring new technologies, and continuously improving my problem-solving skills.
            </p>
          </FadeIn>

          <FadeIn delay={0.5} y={20} className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={handleDownloadResume}
              className="rounded-full text-white font-medium uppercase tracking-widest px-7 py-3 sm:px-9 sm:py-3.5 text-xs sm:text-sm cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 inline-flex items-center gap-2"
              style={{
                background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
                outline: '2px solid white',
                outlineOffset: '-3px',
              }}
            >
              <Download className="w-4 h-4" />
              <span>Download Resume</span>
            </button>

            <a
              href="#projects"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/25 bg-white/[0.05] backdrop-blur-xl text-[#D7E2EA] font-medium uppercase tracking-widest px-7 py-3 sm:px-9 sm:py-3.5 text-xs sm:text-sm hover:bg-white/15 hover:border-white/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.15)] transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 no-underline"
            >
              View Projects
            </a>
          </FadeIn>
        </div>
      </section>

      {/* Resume Modal */}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </>
  );
};

export default HeroSection;
