import React, { useEffect, useRef } from 'react';

export const BluePlanetBackground: React.FC = () => {
  const layerRef = useRef<HTMLDivElement>(null);
  const planetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let targetProgress = 0;
    let progress = 0;
    let frame = 0;

    const updateTarget = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const bookSection = document.getElementById('films');
      const startTrigger = bookSection
        ? bookSection.offsetTop + bookSection.offsetHeight * 0.15
        : vh * 2;
      const endTrigger = Math.max(document.documentElement.scrollHeight - vh, startTrigger + 1);

      targetProgress = scrollY < startTrigger - vh * 0.4
        ? 0
        : Math.min(1, Math.max(0, (scrollY - startTrigger) / (endTrigger - startTrigger)));
    };

    const animate = () => {
      progress = prefersReducedMotion
        ? targetProgress
        : progress + (targetProgress - progress) * 0.075;

      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const bookSection = document.getElementById('films');
      const startTrigger = bookSection
        ? bookSection.offsetTop + bookSection.offsetHeight * 0.15
        : vh * 2;

      if (layerRef.current) {
        const entrance = Math.min(1, Math.max(0, (scrollY - (startTrigger - vh * 0.35)) / (vh * 0.35)));
        layerRef.current.style.opacity = String(entrance * 0.96);
      }

      if (planetRef.current) {
        // Trajectory: starts on upper-left (X ≈ 23vw, Y ≈ 23vh) beneath the 3D Book / VHS shelf
        // and glides down-right across Projects, Experience, and Contact sections
        const currentX = 23 + progress * 40;
        const currentY = 23 + progress * 46;
        const rotation = -6 - progress * 12;
        const scale = 0.88 + progress * 0.16;

        // 58.9% 48.0% is the exact center of the blue planet sphere in the 520x415 asset
        planetRef.current.style.transform =
          `translate3d(calc(${currentX}vw - 58.9%), calc(${currentY}vh - 48.0%), 0) scale(${scale}) rotate(${rotation}deg)`;
      }

      frame = requestAnimationFrame(animate);
    };

    const onChange = () => updateTarget();
    updateTarget();
    frame = requestAnimationFrame(animate);
    window.addEventListener('scroll', onChange, { passive: true });
    window.addEventListener('resize', onChange, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onChange);
      window.removeEventListener('resize', onChange);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="fixed inset-0 z-[1] overflow-hidden pointer-events-none select-none"
      style={{ opacity: 0, willChange: 'opacity' }}
    >
      <div
        ref={planetRef}
        className="absolute left-0 top-0 w-[340px] sm:w-[420px] md:w-[500px] lg:w-[580px] xl:w-[640px] max-w-none will-change-transform"
        style={{ transformOrigin: '58.9% 48.0%' }}
      >
        {/* Show the planet and its small moon without an added blue glow */}
        <img
          src="/planet-with-moon.png?v=1"
          alt="Blue planet with a small moon"
          className="w-full h-auto select-none pointer-events-none relative z-10"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
};

export default BluePlanetBackground;
