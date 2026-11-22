import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, CheckCircle2, Layers } from 'lucide-react';
import Interactive3DText from './Interactive3DText';
import { playKeyboardSound } from '../utils/audio';

export interface ProjectItem {
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

interface ProjectDetailsModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow || 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-8">
          {/* Backdrop with dark blur and fade animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 18 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-[24px] sm:rounded-[32px] md:rounded-[36px] bg-[#101114]/95 border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(182,0,168,0.25)] text-white p-5 sm:p-7 md:p-9 flex flex-col gap-6 z-10 select-text"
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg z-20 group"
              title="Close modal (Esc)"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            </button>

            {/* Header: Badge, Project Number & Title */}
            <div className="pr-12">
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs sm:text-sm font-mono tracking-wider">
                  {project.badge}
                </span>
                <span className="text-white/40 font-mono text-xs sm:text-sm">
                  Project {project.number}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                <Interactive3DText text={project.name} />
              </h2>
              <div className="text-xs sm:text-sm text-[#D7E2EA]/65 uppercase tracking-widest font-mono mt-1">
                <Interactive3DText text={project.category} />
              </div>
            </div>

            {/* Video Showcase Preview */}
            <div className="w-full aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden border border-white/15 bg-black/60 relative shadow-inner">
              <video
                src={project.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Project Description (with interactive 3D letter & word hover) */}
            <div className="leading-relaxed">
              <Interactive3DText
                text={project.description}
                className="text-sm sm:text-base md:text-lg text-[#D7E2EA]/90 font-light"
              />
            </div>

            {/* Dedicated FEATURES Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B600A8]" />
                <h3 className="text-xs uppercase tracking-widest font-mono text-[#D7E2EA]/75 font-semibold">
                  <Interactive3DText text="Key Features" />
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {project.keyFeatures.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    onMouseEnter={() => playKeyboardSound(idx, false)}
                    onClick={() => playKeyboardSound(idx, true)}
                    whileHover={{
                      y: -5,
                      scale: 1.025,
                      rotateX: -4,
                      rotateY: (idx % 2 === 0 ? 1 : -1) * 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderColor: 'rgba(182, 0, 168, 0.55)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.85), 0 0 25px rgba(182,0,168,0.3)',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 15,
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="flex items-start gap-2.5 p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/10 transition-colors cursor-pointer select-none"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#C084FC] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#D7E2EA]/90 leading-snug">
                      <Interactive3DText text={feature} />
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Technologies and Tools Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#B600A8]" />
                <h3 className="text-xs uppercase tracking-widest font-mono text-[#D7E2EA]/75 font-semibold">
                  <Interactive3DText text="Technologies & Tools" />
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <motion.span
                    key={tech}
                    onMouseEnter={() => playKeyboardSound(idx, false)}
                    onClick={() => playKeyboardSound(idx, true)}
                    whileHover={{
                      y: -6,
                      scale: 1.12,
                      rotateX: -10,
                      rotateY: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      borderColor: 'rgba(182, 0, 168, 0.65)',
                      boxShadow: '0 8px 25px rgba(182, 0, 168, 0.4)',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 450,
                      damping: 14,
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-xs sm:text-sm font-mono text-white/90 transition-colors cursor-pointer select-none inline-block"
                  >
                    <Interactive3DText text={tech} />
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Action Buttons: VISIT LIVE WEBSITE & VIEW SOURCE CODE */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => window.open(project.liveUrl, '_blank', 'noopener,noreferrer')}
                className="flex-1 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#B600A8] to-[#6A0DAD] hover:from-[#d100c1] hover:to-[#8110cf] text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(182,0,168,0.5)] transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>VISIT LIVE WEBSITE</span>
              </button>

              <button
                type="button"
                onClick={() => window.open(project.githubUrl, '_blank', 'noopener,noreferrer')}
                className="flex-1 py-3.5 px-6 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 hover:border-white/40 text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              >
                <Github className="w-4 h-4" />
                <span>VIEW SOURCE CODE</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetailsModal;
