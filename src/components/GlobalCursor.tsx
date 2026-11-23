import React, { useEffect, useState, useRef } from 'react';

/**
 * 3D White Robot Hand Cursor
 * Features:
 * - Pixel-accurate hotspot aligned with the pointing index finger tip.
 * - Hardware-accelerated translate3d tracking with zero input lag.
 * - Tactile hover scaling & tilt on interactive elements (buttons, links, inputs, cards).
 * - Satisfying click compression on mousedown.
 * - Integrated floating "OPEN" pill badge for VHS shelf items.
 * - Touch-aware: gracefully hides on touch/mobile screens.
 */
export const GlobalCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isVHS, setIsVHS] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on devices with a mouse/fine pointer
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    // Hide native cursor while custom cursor is mounted
    document.documentElement.style.cursor = 'none';

    let currentX = -100;
    let currentY = -100;

    const onMouseMove = (e: MouseEvent) => {
      currentX = e.clientX;
      currentY = e.clientY;

      if (!isVisible) setIsVisible(true);

      if (cursorRef.current) {
        // Hotspot offset: The index finger tip is at top-left (approx 1px from edge at 38px display)
        cursorRef.current.style.transform = `translate3d(${currentX - 1}px, ${currentY - 1}px, 0)`;
      }

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const vhsItem = target.closest('[data-cover], .vhs-cover-open-badge, .vhs-center-play-btn');
        setIsVHS(!!vhsItem);

        const interactive = target.closest(
          'a, button, [role="button"], input, textarea, select, .cursor-pointer, label, [data-interactive]'
        );
        setIsHovered(!!interactive || !!vhsItem);
      }
    };

    const onMouseDown = () => setIsPressed(true);
    const onMouseUp = () => setIsPressed(false);
    const onMouseLeave = () => {
      setIsVisible(false);
      setIsHovered(false);
      setIsVHS(false);
    };
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
      document.documentElement.style.cursor = '';
    };
  }, [isVisible]);

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className={`fixed top-0 left-0 pointer-events-none z-[9999999] will-change-transform transition-opacity duration-150 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
      }}
    >
      <div className="relative select-none pointer-events-none">
        {/* 3D White Robot Hand Image */}
        <img
          src="/robot-hand-cursor.png"
          alt=""
          draggable={false}
          className="w-10 h-10 object-contain will-change-transform origin-top-left transition-transform duration-100 ease-out select-none"
          style={{
            transform: `${
              isPressed
                ? 'scale(0.92) translate3d(2px, 2px, 0)'
                : isHovered
                ? 'scale(1.16) rotate(-3deg)'
                : 'scale(1)'
            }`,
            filter: isHovered
              ? 'drop-shadow(0 0 10px rgba(182, 0, 168, 0.55)) drop-shadow(0 6px 14px rgba(0, 0, 0, 0.75))'
              : 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.65))',
          }}
        />

        {/* VHS Floating Badge indicator */}
        <span
          ref={badgeRef}
          className={`absolute left-10 top-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase text-white bg-[#1F3FB0]/90 border border-white/30 backdrop-blur-md shadow-[0_4px_12px_rgba(31,63,176,0.6)] transition-all duration-150 ${
            isVHS ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'
          }`}
        >
          OPEN
        </span>
      </div>
    </div>
  );
};

export default GlobalCursor;
