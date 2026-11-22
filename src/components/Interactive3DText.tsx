import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { playKeyboardSound } from '../utils/audio';

interface Interactive3DTextProps {
  text: string;
  className?: string;
  letterClassName?: string;
  wordSpacing?: string;
}

export const Interactive3DText: React.FC<Interactive3DTextProps> = ({
  text,
  className = '',
  letterClassName = '',
  wordSpacing = 'mr-[0.28em]',
}) => {
  const words = text.split(' ');

  return (
    <span
      className={`inline-flex flex-wrap items-baseline ${className}`}
      style={{ perspective: 1000 }}
    >
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          className={`inline-flex whitespace-nowrap ${wordSpacing}`}
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
      onMouseEnter={() => {
        setIsHovered(true);
        playKeyboardSound(index, false);
      }}
      onMouseLeave={() => setIsHovered(false)}
      className={`inline-block relative cursor-pointer select-none ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      animate={
        isHovered
          ? {
              y: -10,
              scale: 1.25,
              rotateX: -18,
              rotateY: rotY,
              rotateZ: rotZ,
              zIndex: 30,
              textShadow:
                '0 10px 25px rgba(182, 0, 168, 0.75), 0 2px 10px rgba(255, 255, 255, 0.95)',
            }
          : {
              y: 0,
              scale: 1,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              zIndex: 1,
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
