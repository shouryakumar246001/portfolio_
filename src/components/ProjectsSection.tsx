import React, { useState } from 'react';
import FadeIn from './FadeIn';
import Heading3D from './Heading3D';
import ProjectDetailsModal, { ProjectItem } from './ProjectDetailsModal';
import { ArrowUpRight, Github, Info } from 'lucide-react';

const projectsList: ProjectItem[] = [
  {
    number: '01',
    name: 'SugaCart.com',
    category: 'Multi-Vendor E-Commerce Platform',
    badge: 'Commerce platform',
    technologies: ['Next.js 15', 'React 19', 'Redux Toolkit', 'Prisma ORM', 'Tailwind CSS v4', 'Recharts'],
    description:
      'Full-stack multi-vendor e-commerce platform supporting three distinct user roles: Buyer, Seller, and Super Admin with real-time analytics and inventory control.',
    keyFeatures: [
      'Three role-based dashboards: Buyer, Seller, Super Admin.',
      'Product management and inventory control.',
      'Advanced search and multicategory filtering.',
      'Merchant verification and administration.',
      'Dynamic reviews and coupon management.',
      'Real-time revenue analytics.',
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
      'Structured attribute evaluation comparing product features and authenticity criteria.',
      'Multi-step guided verification workflow with instant visual confirmation cues.',
      'Streamlined client-side state transitions handling user inputs without page reloads.',
      'Deterministic finite state machine computing weighted authenticity score calculations.',
      'Adaptive layouts optimized for both handheld mobile inspections and desktop browsing.',
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
      'A real-time computer vision application that detects, locates, and classifies objects from live video cameras and static image inputs with continuous ML inference.',
    keyFeatures: [
      'Real-time object detection and spatial classification across continuous video frames.',
      'Dual input processing pipeline supporting both live camera feeds and high-res static images.',
      'Frame preprocessing, normalization, and optimization for low-latency inference in Python.',
      'Bounding-box rendering, class labeling, and confidence score calculation.',
      'Machine learning model integration ensuring reliable classification across varying conditions.',
    ],
    videoUrl: '/object-detector-preview.mp4',
    githubUrl: 'https://github.com/shouryakumar246001/realtime-object-detector',
    liveUrl: 'https://github.com/shouryakumar246001/realtime-object-detector',
  },
];

export const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const handleOpenLink = (url: string) => {
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
              onClick={() => setSelectedProject(project)}
              className="relative group rounded-[26px] sm:rounded-[30px] md:rounded-[34px] overflow-hidden border border-white/15 hover:border-white/40 bg-[#121316]/85 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:shadow-[0_25px_60px_rgba(182,0,168,0.35),0_0_25px_rgba(255,255,255,0.12)] transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col"
              title={`Click to view details for ${project.name}`}
            >
              {/* Video / Preview Container */}
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
                      handleOpenLink(project.githubUrl);
                    }}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/90 hover:border-white/40 transition-all duration-200 shadow-lg cursor-pointer"
                    title={`View ${project.name} on GitHub`}
                  >
                    <Github className="w-3.5 h-3.5" />
                  </button>

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLink(project.liveUrl);
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

              {/* Bottom Card Footer Strip (Details, GitHub & Live status) */}
              <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-[#0e0f12]/95 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                    }}
                    className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-white/85 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Info className="w-3 h-3 text-[#B600A8]" />
                    <span>Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLink(project.githubUrl);
                    }}
                    className="p-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="View GitHub Repository"
                  >
                    <Github className="w-3 h-3" />
                  </button>
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenLink(project.liveUrl);
                  }}
                  className="flex items-center gap-1.5 text-emerald-400/90 hover:text-emerald-300 cursor-pointer"
                  title="Open live website"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-mono tracking-wider">Live</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Interactive Project Details Modal */}
      <ProjectDetailsModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default ProjectsSection;
