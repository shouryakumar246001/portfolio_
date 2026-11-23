import React, { useEffect, useRef } from 'react';

export const UranusBackground: React.FC = () => {
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
        ? bookSection.offsetTop + bookSection.offsetHeight * 0.35
        : vh * 2.5;
      const docHeight = document.documentElement.scrollHeight;
      const endTrigger = Math.max(docHeight - vh, startTrigger + 1);

      if (scrollY < startTrigger - vh * 0.35) {
        targetProgress = 0;
      } else {
        targetProgress = Math.min(1, Math.max(0, (scrollY - startTrigger) / (endTrigger - startTrigger)));
      }
    };

    const animate = () => {
      progress = prefersReducedMotion
        ? targetProgress
        : progress + (targetProgress - progress) * 0.065;

      if (layerRef.current) {
        const entrance = progress < 0.02 ? 0 : Math.min(1, progress * 5);
        layerRef.current.style.opacity = String(entrance * 0.68);
      }

      if (planetRef.current) {
        const y = -10 + progress * 48;
        const x = -24 + progress * 14;
        const rotation = -8 - progress * 12;
        const scale = 0.72 + progress * 0.18;
        planetRef.current.style.transform = `translate3d(${x}vw, ${y}vh, 0) scale(${scale}) rotate(${rotation}deg)`;
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
        className="absolute -left-28 sm:-left-20 md:-left-12 lg:left-0 top-0 h-[390px] w-[390px] sm:h-[500px] sm:w-[500px] md:h-[560px] md:w-[560px] lg:h-[620px] lg:w-[620px] will-change-transform"
        style={{ transformOrigin: '50% 50%' }}
      >
        <div
          className="absolute inset-[8%] rounded-full"
          style={{
            background:
              'radial-gradient(circle at 68% 32%, rgba(210,246,250,0.96) 0%, rgba(172,225,235,0.98) 12%, rgba(132,202,220,1) 30%, rgba(92,166,193,1) 52%, rgba(58,121,154,1) 72%, rgba(25,67,99,1) 100%)',
            boxShadow:
              'inset -52px -18px 72px rgba(10,40,73,0.48), inset 18px 10px 30px rgba(230,252,255,0.34), 0 0 90px rgba(124,206,225,0.22)',
            transform: 'rotate(-18deg)',
          }}
        >
          <div
            className="absolute inset-0 overflow-hidden rounded-full"
            style={{
              background:
                'repeating-linear-gradient(174deg, transparent 0 7%, rgba(205,242,249,0.16) 8% 10%, transparent 11% 16%, rgba(20,95,130,0.18) 17% 20%)',
              mixBlendMode: 'screen',
              opacity: 0.9,
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(ellipse at 36% 58%, rgba(181,222,224,0.20) 0 8%, transparent 9%), radial-gradient(ellipse at 72% 72%, rgba(7,38,67,0.28) 0 10%, transparent 11%), linear-gradient(115deg, transparent 38%, rgba(231,251,255,0.12) 49%, transparent 58%)',
            }}
          />
        </div>

        <div
          className="absolute left-[2%] right-[2%] top-[48%] h-[23%] rounded-[50%] border border-cyan-100/25"
          style={{
            transform: 'rotate(-12deg) scaleY(0.42)',
            boxShadow:
              '0 -9px 18px rgba(174,231,240,0.08), 0 9px 22px rgba(95,190,215,0.10), inset 0 0 18px rgba(185,238,248,0.10)',
          }}
        />

        <div
          className="absolute inset-[1%] rounded-full"
          style={{
            background: 'radial-gradient(circle at 50% 50%, transparent 62%, rgba(20,90,125,0.10) 66%, rgba(5,16,30,0.30) 78%, transparent 79%)',
            filter: 'blur(1px)',
          }}
        />
      </div>
    </div>
  );
};

export default UranusBackground;
