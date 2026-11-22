import React from 'react';
import FadeIn from './FadeIn';
import Heading3D from './Heading3D';
import { ArrowUpRight, Github } from 'lucide-react';

interface ProjectItem {
  number: string;
  name: string;
  category: string;
  badge: string;
  technologies: string[];
  description: string;
  keyFeatures: string[];
  videoUrl: string;
  githubUrl: string;
  liveUrl: string;
}

const projectsList: ProjectItem[] = [
  {
    number: '01',
    name: 'SugaCart.com',
    category: 'Multi-Vendor E-Commerce Platform',
    badge: 'Commerce platform',
    technologies: ['Next.js 15', 'React 19', 'Redux Toolkit', 'Prisma ORM', 'Tailwind CSS v4', 'Recharts'],
    description:
      'A full-stack multi-vendor e-commerce platform supporting three distinct user roles: Buyer, Seller, and Super Admin with real-time analytics and inventory control.',
    keyFeatures: [
      'Role-based buyer, seller, and administrator workflows via Next.js App Router & Prisma models',
      'Architected relational schemas in Prisma ORM and centralized Redux Toolkit state management',
      'URL-driven search, multicategory filtering, dynamic review modals and responsive user interfaces',
      'Implemented seller inventory control, admin merchant verification, coupons, and Recharts revenue analytics',
    ],
    videoUrl: '/sugacart-preview.mp4',
    githubUrl: 'https://github.com/shouryakumar246001/suga-cart.com__',
    liveUrl: 'https://suga-cart-mpdl6ouw0-suggaa.vercel.app',
  },
  {
    number: '02',
    name: 'Sneaker Authenticity Checker',
    category: 'Web Application & Product Verification',
    badge: 'Product verification app',
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'DOM State Machine'],
    description:
      'A responsive web application designed to evaluate sneaker attributes and product features through a structured multi-step verification workflow.',
    keyFeatures: [
      'Sneaker attribute evaluation and authenticity indicators from structured user inputs',
      'Streamlined client-side state transitions and dynamic verification calculation',
      'Adaptive layouts across desktop, tablet, and mobile devices with zero external libraries',
      'Multi-step guided inspection flow with immediate validation results',
    ],
    videoUrl: '/sneaker-preview.mp4',
    githubUrl: 'https://github.com/shouryakumar246001/sneker',
    liveUrl: 'https://sneak-on.netlify.app/',
  },
  {
    number: '03',
    name: 'Real-Time Object Detector',
    category: 'Computer Vision & Machine Learning',
    badge: 'Computer vision & ML',
    technologies: ['Python', 'Computer Vision', 'Machine Learning', 'OpenCV'],
    description:
      'A real-time computer vision application that detects and classifies objects from live video and static image streams through an optimized inference pipeline.',
    keyFeatures: [
      'Built a real-time computer vision application detecting and classifying objects from live video streams and static images',
      'Integrated image preprocessing and machine learning inference pipelines in Python',
      'Optimized frame extraction and bounding-box drawing for high FPS classification',
      'Robust error handling and flexible camera/file source input pipelines',
    ],
    videoUrl: '/object-detector-preview.mp4',
    githubUrl: 'https://github.com/shouryakumar246001/realtime-object-detector',
    liveUrl: 'https://github.com/shouryakumar246001/realtime-object-detector',
  },
];

export const ProjectsSection: React.FC = () => {
  const handleOpenProject = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="projects"
      className="relative z-10 px-4 sm:px-6 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-32 select-none"
    >
      {/* Section Header */}
      <Heading3D
        title="Projects"
        subtitle="Featured Engineering Work • Full-Stack • Computer Vision"
        className="mb-12 sm:mb-16 md:mb-20"
      />

      {/* 3-Card Video Showcase Grid (matching reference design) */}
      <FadeIn delay={0.15} y={30}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 max-w-7xl mx-auto">
          {projectsList.map((project) => (
            <div
              key={project.number}
              onClick={() => handleOpenProject(project.liveUrl)}
              className="relative group rounded-[26px] sm:rounded-[30px] md:rounded-[34px] overflow-hidden border border-white/15 hover:border-white/40 bg-[#121316]/85 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:shadow-[0_25px_60px_rgba(182,0,168,0.35),0_0_25px_rgba(255,255,255,0.12)] transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col"
              title={`Click to open ${project.name}`}
            >
              {/* Video Container (16:10 aspect ratio matching screenshot) */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#181818]">
                <video
                  src={project.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C]/95 via-transparent to-black/20 pointer-events-none" />

                {/* Top-Right Actions (GitHub + Direct Open Link Arrow) */}
                <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenProject(project.githubUrl);
                    }}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/90 hover:border-white/40 transition-all duration-200 shadow-lg cursor-pointer"
                    title={`View ${project.name} on GitHub`}
                  >
                    <Github className="w-3.5 h-3.5" />
                  </button>

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenProject(project.liveUrl);
                    }}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-[#B600A8] shadow-lg cursor-pointer"
                    title={`Click to open ${project.name}`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Left Title & Pill Badge (exact reference layout) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 flex flex-col items-start gap-1.5 z-10 pointer-events-none">
                  <h3 className="font-bold text-white text-lg sm:text-xl md:text-2xl tracking-wide group-hover:text-white transition-colors">
                    {project.name}
                  </h3>
                  <span className="px-3 sm:px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs sm:text-sm font-mono tracking-wider">
                    {project.badge}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
};

export default ProjectsSection;
