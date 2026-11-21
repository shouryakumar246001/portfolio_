import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Preloader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Prevent scrolling while preloader is active
    document.body.style.overflow = 'hidden';

    let current = 0;
    const interval = setInterval(() => {
      // Dynamic natural pacing from 0% to 100%
      let increment = 1;
      if (current < 25) {
        increment = Math.floor(Math.random() * 3) + 2;
      } else if (current < 70) {
        increment = Math.floor(Math.random() * 4) + 2;
      } else if (current < 85) {
        increment = Math.floor(Math.random() * 2) + 1; // Slight natural dwell
      } else {
        increment = Math.floor(Math.random() * 3) + 2;
      }

      current = Math.min(100, current + increment);
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsComplete(true);
          document.body.style.overflow = '';
        }, 280);
      }
    }, 28);

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
          {/* Top Edge Progress Bar matching reference */}
          <div className="w-full h-[3.5px] bg-white/[0.04] relative">
            <div
              className="h-full bg-[#F5F2EB] shadow-[0_0_12px_rgba(245,242,235,0.45)] transition-[width] duration-75 ease-out rounded-r-full"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          {/* Bottom-Right Percentage Counter matching reference */}
          <div className="flex-1 flex items-end justify-end p-8 sm:p-12 md:p-16">
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
