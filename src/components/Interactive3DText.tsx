import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Interactive3DTextProps {
  text: string;
  className?: string;
  letterClassName?: string;
}

export const Interactive3DText: React.FC<Interactive3DTextProps> = ({
  text,
  className = '',
  letterClassName = '',
}) => {
  const words = text.split(' ');

  return (
    <span
      className={`inline-flex flex-wrap gap-x-2 sm:gap-x-2.5 items-baseline ${className}`}
      style={{ perspective: 1000 }}
    >
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          className="inline-flex whitespace-nowrap"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {word.split('').map((char, charIndex) => (
            <InteractiveLetter
              key={`${char}-${charIndex}`}
              char={char}
              index={charIndex}
              className={letterClassName}
            />
          ))}
        </span>
      ))}
    </span>
  );
};

const InteractiveLetter: React.FC<{
  char: string;
  index: number;
  className?: string;
}> = ({ char, index, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic 3D rotation angles for realistic organic letter spring
  const rotY = (index % 2 === 0 ? 1 : -1) * 16;
  const rotZ = (index % 3 === 0 ? -1 : 1) * 5;

  return (
    <motion.span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`inline-block relative cursor-pointer select-none ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      animate={
        isHovered
          ? {
              y: -12,
              scale: 1.25,
              rotateX: -20,
              rotateY: rotY,
              rotateZ: rotZ,
              textShadow:
                '0 12px 28px rgba(182, 0, 168, 0.75), 0 2px 12px rgba(255, 255, 255, 0.95)',
            }
          : {
              y: 0,
              scale: 1,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              textShadow: '0 0 0px transparent',
            }
      }
      transition={{
        type: 'spring',
        stiffness: 480,
        damping: 12,
        mass: 0.45,
      }}
    >
      {char}
    </motion.span>
  );
};

export default Interactive3DText;
