import React, { useRef, useEffect, useState, ReactNode } from 'react';

interface MagnetProps {
  children: ReactNode;
  className?: string;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  className = '',
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('translate3d(0px, 0px, 0px)');
  const [transition, setTransition] = useState(inactiveTransition);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const minX = rect.left - padding;
      const maxX = rect.right + padding;
      const minY = rect.top - padding;
      const maxY = rect.bottom + padding;

      if (
        e.clientX >= minX &&
        e.clientX <= maxX &&
        e.clientY >= minY &&
        e.clientY <= maxY
      ) {
        const dx = (e.clientX - centerX) / strength;
        const dy = (e.clientY - centerY) / strength;
        setTransition(activeTransition);
        setTransform(`translate3d(${dx}px, ${dy}px, 0px)`);
      } else {
        setTransition(inactiveTransition);
        setTransform('translate3d(0px, 0px, 0px)');
      }
    };

    const handleMouseLeave = () => {
      setTransition(inactiveTransition);
      setTransform('translate3d(0px, 0px, 0px)');
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [padding, strength, activeTransition, inactiveTransition]);

  return (
    <div
      ref={ref}
      className={`inline-block ${className}`}
      style={{
        transform,
        transition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};

export default Magnet;
