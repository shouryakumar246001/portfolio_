import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface CharProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Character: React.FC<CharProps> = ({ char, progress, range }) => {
  const opacity = useTransform(progress, range, [0.25, 1]);

  return (
    <span className="relative inline-block">
      <span className="opacity-0 select-none">{char}</span>
      <motion.span
        style={{ opacity }}
        className="absolute left-0 top-0 select-none pointer-events-none"
      >
        {char}
      </motion.span>
    </span>
  );
};

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '', style }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const totalLength = text.length;
  let charCounter = 0;
  const words = text.split(' ');

  return (
    <p
      ref={containerRef}
      style={style}
      className={`font-medium text-center leading-relaxed tracking-wide text-[#D7E2EA] ${className}`}
    >
      {words.map((word, wIdx) => (
        <span
          key={`word-${wIdx}`}
          className="inline-block whitespace-nowrap mr-[0.35em] last:mr-0"
        >
          {word.split('').map((char) => {
            const start = charCounter / totalLength;
            const end = Math.min(1, (charCounter + 1) / totalLength);
            charCounter++;
            return (
              <Character
                key={`char-${charCounter}`}
                char={char}
                progress={scrollYProgress}
                range={[start, end]}
              />
            );
          })}
          {(() => {
            charCounter++;
            return null;
          })()}
        </span>
      ))}
    </p>
  );
};

export default AnimatedText;
