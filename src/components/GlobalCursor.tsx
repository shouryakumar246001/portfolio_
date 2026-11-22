import React, { useEffect, useRef } from 'react';

/**
 * GlobalCursor — a premium dual-layer cursor that works across the entire website.
 * - Inner dot: snaps instantly to the mouse position (no lag).
 * - Outer ring: follows with a smooth spring-like trail effect.
 * - On hover over interactive elements: ring expands, dot shrinks, ring colour shifts to magenta.
 * - On click/press: both layers scale down for a tactile press-down feel.
 * - Works only on devices with a fine pointer (desktop mouse); hides on touch devices.
 */
export const GlobalCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) return;

    // Hide the native OS cursor globally
    document.documentElement.style.cursor = 'none';

    let mouseX = -200;
    let mouseY = -200;
    let ringX = -200;
    let ringY = -200;
    let isPointer = false;
    let isPressed = false;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer, label');
        isPointer = !!interactive;
      }

      // Snap dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
        dotRef.current.style.opacity = '1';
      }
    };

    const onMouseDown = () => {
      isPressed = true;
    };
    const onMouseUp = () => {
      isPressed = false;
    };
    const onMouseLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };
    const onMouseEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = '1';
      if (ringRef.current) ringRef.current.style.opacity = '1';
    };

    // Smooth ring lerp loop
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const SPEED = 0.11;

    const animate = () => {
      ringX = lerp(ringX, mouseX, SPEED);
      ringY = lerp(ringY, mouseY, SPEED);

      if (ringRef.current) {
        const size = isPointer ? 44 : 32;
        const half = size / 2;
        ringRef.current.style.transform = `translate3d(${ringX - half}px, ${ringY - half}px, 0)`;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
        ringRef.current.style.borderColor = isPointer ? 'rgba(182,0,168,0.85)' : 'rgba(215,226,234,0.55)';
        ringRef.current.style.boxShadow = isPointer
          ? '0 0 14px rgba(182,0,168,0.5)'
          : '0 0 6px rgba(0,0,0,0.5)';
      }

      if (dotRef.current) {
        const dotScale = isPressed ? 0.5 : isPointer ? 0.3 : 1;
        dotRef.current.style.scale = `${dotScale}`;
        dotRef.current.style.background = isPointer ? '#B600A8' : '#ffffff';
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.documentElement.style.cursor = '';
    };
  }, []);

  return (
    <>
      {/* Outer trailing ring */}
      <div
        ref={ringRef}
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[9999999] rounded-full border-[1.5px] transition-[border-color,box-shadow,width,height] duration-150 will-change-transform"
        style={{
          width: '32px',
          height: '32px',
          borderColor: 'rgba(215,226,234,0.55)',
          background: 'transparent',
          transform: 'translate3d(-200px, -200px, 0)',
          opacity: 0,
        }}
      />
      {/* Inner sharp dot — snaps instantly */}
      <div
        ref={dotRef}
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[9999999] rounded-full will-change-transform transition-[background,scale] duration-100"
        style={{
          width: '8px',
          height: '8px',
          background: '#ffffff',
          transform: 'translate3d(-200px, -200px, 0)',
          opacity: 0,
        }}
      />
    </>
  );
};

export default GlobalCursor;
