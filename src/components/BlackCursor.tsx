import React, { useEffect, useState, useRef } from 'react';

export const BlackCursor: React.FC = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on devices with a mouse/fine pointer
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 2.5}px, ${e.clientY - 2.5}px, 0)`;
      }

      // Check if hovering over interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer');
        setIsPointer(!!interactive);
      }
    };

    const onMouseDown = () => setIsPressed(true);
    const onMouseUp = () => setIsPressed(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999999] will-change-transform transition-opacity duration-150 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
      }}
    >
      <div
        className="transition-transform duration-100 ease-out origin-top-left"
        style={{
          transform: `${isPointer ? 'scale(1.18)' : 'scale(1)'} ${
            isPressed ? 'scale(0.92)' : ''
          }`,
        }}
      >
        <svg
          width="40"
          height="48"
          viewBox="0 0 28 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_4px_14px_rgba(0,0,0,0.7)]"
        >
          {/* Outer stroke shadow / outline layer for extra contrast */}
          <path
            d="M2.5 2.5 L2.5 26.5 L8.5 20.5 L14 31.5 L19 29 L13.5 18 L22 18 Z"
            fill="#000000"
            stroke="#FFFFFF"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default BlackCursor;
