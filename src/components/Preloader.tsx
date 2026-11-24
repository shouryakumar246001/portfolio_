import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Preloader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Prevent scrolling while preloader is active
    document.body.style.overflow = 'hidden';

    let current = 0;

    // 100 steps at 50ms gives the preloader a 5-second runtime.
    const interval = setInterval(() => {
      current = Math.min(100, current + 1);
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setIsComplete(true);
        document.body.style.overflow = '';
      }
    }, 50);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{
            y: '-100%',
            transition: {
              duration: 0.85,
              ease: [0.76, 0, 0.24, 1], // Smooth cinematic curtain lift
            },
          }}
          className="fixed inset-0 z-[9999998] bg-[#07090E] flex flex-col justify-between pointer-events-auto select-none"
        >
          {/* Top Edge Progress Bar */}
          <div className="w-full h-[3.5px] bg-white/[0.04] relative">
            <div
              className="h-full bg-[#F5F2EB] shadow-[0_0_12px_rgba(245,242,235,0.45)] transition-[width] duration-75 ease-out rounded-r-full"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          {/* Bottom Row: Hint text left, Percentage right */}
          <div className="flex items-end justify-between p-8 sm:p-12 md:p-16">

            {/* Bottom-Left: Cursor hint message */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: progress > 20 ? 1 : 0, y: progress > 20 ? 0 : 12 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="max-w-xs sm:max-w-sm"
            >
              {/* SVG cursor icon */}
              <div className="flex items-center gap-2 mb-2">
                <svg
                  width="18"
                  height="22"
                  viewBox="0 0 28 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-70 shrink-0"
                >
                  <path
                    d="M2.5 2.5 L2.5 26.5 L8.5 20.5 L14 31.5 L19 29 L13.5 18 L22 18 Z"
                    fill="#000000"
                    stroke="#FFFFFF"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] text-white/40"
                >
                  Tip
                </span>
              </div>
              <p
                className="text-white/55 font-['Kanit'] font-light leading-snug"
                style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }}
              >
                Hover with your cursor throughout the website for a richer interactive experience.
              </p>
            </motion.div>

            {/* Bottom-Right: Percentage Counter */}
            <div className="font-['Kanit'] font-medium text-white tracking-tight text-[clamp(3.5rem,10vw,120px)] leading-none select-none">
              {progress} <span className="font-light text-[0.85em] text-white/90">%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
