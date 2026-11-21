import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FadeIn from './FadeIn';
import LiveProjectButton from './LiveProjectButton';
import { Code2, CheckCircle } from 'lucide-react';

interface ProjectItem {
  number: string;
  name: string;
  category: string;
  technologies: string[];
  description: string;
  keyFeatures: string[];
  col1TopImage?: string;
  col1BottomImage: string;
  col2Image: string;
  githubUrl: string;
  liveUrl?: string;
  liveLabel?: string;
}

const projectsList: ProjectItem[] = [
  {
    number: '01',
    name: 'SugaCart.com',
    category: 'Multi-Vendor E-Commerce Platform',
    technologies: ['Next.js 15', 'React 19', 'Redux Toolkit', 'Prisma ORM', 'Tailwind CSS v4', 'Recharts'],
    description:
      'A full-stack multi-vendor e-commerce platform supporting three distinct user roles: Buyer, Seller, and Super Admin with real-time analytics and inventory control.',
    keyFeatures: [
      'Role-based buyer, seller, and administrator workflows via Next.js App Router & Prisma models',
      'Architected relational schemas in Prisma ORM and centralized Redux Toolkit state management',
      'URL-driven search, multicategory filtering, dynamic review modals and responsive user interfaces',
      'Implemented seller inventory control, admin merchant verification, coupons, and Recharts revenue analytics',
    ],
    col1TopImage: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80',
    col1BottomImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    col2Image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80',
    githubUrl: 'https://github.com/shouryakumar246001',
    liveUrl: 'https://suga-cart-mpdl6ouw0-suggaa.vercel.app',
    liveLabel: 'Live Demo',
  },
  {
    number: '02',
    name: 'Sneaker Authenticity Checker',
    category: 'Web Application & Product Verification',
    technologies: ['JavaScript', 'HTML', 'CSS', 'DOM State Machine'],
    description:
      'A responsive web application designed to evaluate sneaker attributes and product features through a structured multi-step verification workflow.',
    keyFeatures: [
      'Sneaker attribute evaluation and authenticity indicators from structured user inputs',
      'Streamlined client-side state transitions and dynamic verification calculation',
      'Adaptive layouts across desktop, tablet, and mobile devices with zero external libraries',
      'Multi-step guided inspection flow with immediate validation results',
    ],
    col1TopImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80',
    col1BottomImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80',
    col2Image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80',
    githubUrl: 'https://github.com/shouryakumar246001',
    liveUrl: 'https://sneak-on.netlify.app/',
    liveLabel: 'Live Demo',
  },
  {
    number: '03',
    name: 'Real-Time Object Detector',
    category: 'Computer Vision & Machine Learning',
    technologies: ['Python', 'Computer Vision', 'Machine Learning', 'OpenCV'],
    description:
      'A real-time computer vision application that detects and classifies objects from live video and static image streams through an optimized inference pipeline.',
    keyFeatures: [
      'Built a real-time computer vision application detecting and classifying objects from live video streams and static images',
      'Integrated image preprocessing and machine learning inference pipelines in Python',
      'Optimized frame extraction and bounding-box drawing for high FPS classification',
      'Robust error handling and flexible camera/file source input pipelines',
    ],
    col1BottomImage: '/obj-detect-bottom.jpg',
    col2Image: '/obj-detect3.png',
    githubUrl: 'https://github.com/shouryakumar246001',
    liveUrl: 'https://github.com/shouryakumar246001',
    liveLabel: 'View Code',
  },
];

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  totalCards: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, totalCards }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start start'],
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div
      ref={cardRef}
      className="sticky top-20 md:top-28 min-h-[85vh] flex items-start justify-center"
      style={{ top: `calc(${index * 28}px + 5rem)` }}
    >
      <motion.div
        style={{ scale }}
        className="w-full max-w-6xl rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-white/25 bg-[#0C0C0C]/85 backdrop-blur-2xl p-5 sm:p-7 md:p-9 flex flex-col justify-between shadow-[0_30px_80px_rgba(0,0,0,0.95),inset_0_1px_1px_0_rgba(255,255,255,0.12)] overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-white/15">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="font-black text-[clamp(2.5rem,6vw,90px)] leading-none text-[#D7E2EA] tracking-tight">
              {project.number}
            </span>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-medium uppercase tracking-widest text-[#B600A8]">
                {project.category}
              </span>
              <h3 className="font-medium uppercase text-[clamp(1.1rem,2.2vw,2rem)] text-[#D7E2EA] tracking-wide">
                {project.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LiveProjectButton href={project.githubUrl} label="GitHub" variant="github" />
            {project.liveUrl && (
              <LiveProjectButton href={project.liveUrl} label={project.liveLabel || 'Live Demo'} />
            )}
          </div>
        </div>

        {/* Middle Description & Chips */}
        <div className="py-4 space-y-3">
          <p className="text-xs sm:text-sm md:text-base text-[#D7E2EA]/90 font-light leading-relaxed max-w-4xl">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md text-[#D7E2EA] text-[11px] sm:text-xs font-mono uppercase tracking-wider shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.08)] hover:bg-white/10 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Grid Images & Checklist */}
        <div className="pt-2 sm:pt-4 grid grid-cols-1 md:grid-cols-10 gap-4 sm:gap-6 items-stretch">
          {/* Left Column (4 cols): Images */}
          <div className="md:col-span-4 flex flex-col gap-4 sm:gap-6 justify-between">
            {project.col1TopImage && (
              <div className="overflow-hidden rounded-[30px] sm:rounded-[40px] md:rounded-[45px] bg-[#181818] h-[clamp(130px,16vw,200px)] border border-white/15 relative group shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                <img
                  src={project.col1TopImage}
                  alt={`${project.name} preview 1`}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-[30px] sm:rounded-[40px] md:rounded-[45px] group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            <div className={`overflow-hidden rounded-[30px] sm:rounded-[40px] md:rounded-[45px] bg-[#181818] ${project.col1TopImage ? 'h-[clamp(150px,20vw,240px)]' : 'h-full min-h-[260px]'} border border-white/15 relative group shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]`}>
              <img
                src={project.col1BottomImage}
                alt={`${project.name} preview`}
                loading="lazy"
                className="w-full h-full object-cover rounded-[30px] sm:rounded-[40px] md:rounded-[45px] group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Column (6 cols): Key Highlights */}
          <div className="md:col-span-6 rounded-[30px] sm:rounded-[40px] md:rounded-[45px] bg-white/[0.03] backdrop-blur-xl border border-white/15 p-5 sm:p-7 flex flex-col justify-between overflow-hidden relative shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.08)]">
            <div>
              <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-widest text-[#BBCCD7]">
                <Code2 className="w-4 h-4 text-[#B600A8]" />
                Key Engineering Highlights
              </div>
              <ul className="space-y-2.5">
                {project.keyFeatures.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#D7E2EA]/80 font-light leading-snug">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 pt-4 border-t border-[#D7E2EA]/10 flex items-center justify-between text-xs font-mono text-[#D7E2EA]/60">
              <span>Status: Verified Production Code</span>
              <span className="text-emerald-400">● Active</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const ProjectsSection: React.FC = () => {
  return (
    <section
      id="projects"
      className="relative bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-10 px-4 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-32 select-none"
    >
      <FadeIn delay={0} y={40} className="text-center mb-16 sm:mb-20 md:mb-28">
        <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(3rem,12vw,160px)]">
          Projects
        </h2>
        <p className="text-[#D7E2EA]/70 uppercase tracking-widest font-mono text-xs sm:text-sm mt-4">
          Featured Engineering Work • Full-Stack • Computer Vision
        </p>
      </FadeIn>

      <div className="relative flex flex-col gap-12 sm:gap-16">
        {projectsList.map((project, idx) => (
          <ProjectCard key={project.number} project={project} index={idx} totalCards={projectsList.length} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
