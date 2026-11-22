import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface Heading3DProps {
  title: string;
  subtitle?: string;
  subtitleType?: 'mono' | 'prose';
  className?: string;
}

export const Heading3D: React.FC<Heading3DProps> = ({
  title,
  subtitle,
  subtitleType = 'mono',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    restDelta: 0.001,
  });

  // 3D entrance animation as the heading scrolls into view — no mouse tilt
  const scrollRotateX = useTransform(smoothProgress, [0, 1], [40, 0]);
  const scale = useTransform(smoothProgress, [0, 1], [0.82, 1]);
  const opacity = useTransform(smoothProgress, [0, 0.5, 1], [0, 0.85, 1]);
  const y = useTransform(smoothProgress, [0, 1], [70, 0]);

  return (
    <div
      ref={containerRef}
      className={`text-center relative select-none ${className}`}
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
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(2.6rem,10vw,140px)] drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)]"
          style={{
            transform: 'translateZ(35px)',
            transformStyle: 'preserve-3d',
            textShadow: '0 4px 20px rgba(0,0,0,0.85), 0 10px 40px rgba(182,0,168,0.25)',
          }}
        >
          {title}
        </h2>

        {subtitle && subtitleType === 'mono' && (
          <p
            style={{ transform: 'translateZ(18px)' }}
            className="text-[#D7E2EA]/75 uppercase tracking-widest font-mono text-xs sm:text-sm mt-4 max-w-3xl mx-auto"
          >
            {subtitle}
          </p>
        )}

        {subtitle && subtitleType === 'prose' && (
          <p
            style={{ transform: 'translateZ(18px)' }}
            className="text-[#D7E2EA]/85 font-light max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed mt-5"
          >
            {subtitle}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Heading3D;

