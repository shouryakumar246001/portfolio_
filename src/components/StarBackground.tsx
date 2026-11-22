import React, { useEffect, useRef, useState } from 'react';

interface Star {
  x: number; // percentage of width (0 - 100)
  y: number; // percentage of height (0 - 100)
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  hasGlow: boolean;
  glowRadius: number;
  depth: number; // 0.05 to 0.25 for subtle parallax depth
}

export const StarBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);

  // Monitor scroll position to only show stars after leaving HeroSection (the donut page)
  useEffect(() => {
    const checkScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      
      // First section is HeroSection (donut)
      // When at the very top (HeroSection), opacity is 0.
      // As user scrolls towards KeycapSkillsSection, fade stars in smoothly.
      const startFade = heroHeight * 0.25;
      const fullFade = heroHeight * 0.85;

      if (scrollY <= startFade) {
        setIsVisible(false);
        setOpacity(0);
      } else {
        setIsVisible(true);
        const progress = Math.min(1, Math.max(0, (scrollY - startFade) / (fullFade - startFade)));
        setOpacity(progress);
      }
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll, { passive: true });
    checkScroll();

    return () => {
      window.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars: Star[] = [];

    const starColors = [
      '255, 255, 255',      // Pure White (majority)
      '255, 255, 255',
      '255, 255, 255',
      '225, 240, 255',      // Pale Starlight Ice-Blue
      '240, 230, 255',      // Pale Nebula Purple/Violet
      '215, 226, 234',      // Site foreground tint #D7E2EA
    ];

    const generateStars = (w: number, h: number): Star[] => {
      // Density: ~180 stars across standard 1920x1080 viewport, scaled proportionally
      const count = Math.floor(Math.max(140, Math.min(300, (w * h) / 10000)));
      const newStars: Star[] = [];

      for (let i = 0; i < count; i++) {
        const rand = Math.random();
        let radius: number;
        let hasGlow = false;
        let glowRadius = 0;
        let depth = 0.05 + Math.random() * 0.2;

        if (rand < 0.65) {
          // Tiny background stars (subtle distant dots)
          radius = 0.65 + Math.random() * 0.6; // 0.65 - 1.25px
        } else if (rand < 0.88) {
          // Medium stars (crisp visible dots)
          radius = 1.3 + Math.random() * 0.7; // 1.3 - 2.0px
        } else {
          // Bright foreground stars with soft halo glow (like screenshot)
          radius = 2.1 + Math.random() * 0.8; // 2.1 - 2.9px
          hasGlow = true;
          glowRadius = radius * (2.5 + Math.random() * 1.5);
          depth = 0.2 + Math.random() * 0.15;
        }

        const color = starColors[Math.floor(Math.random() * starColors.length)];
        const baseAlpha = 0.35 + Math.random() * 0.55;
        const twinkleSpeed = 0.8 + Math.random() * 2.2; // rad/s
        const twinklePhase = Math.random() * Math.PI * 2;

        newStars.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          radius,
          baseAlpha,
          twinkleSpeed,
          twinklePhase,
          color,
          hasGlow,
          glowRadius,
          depth,
        });
      }

      return newStars;
    };

    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      stars = generateStars(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      // Subtle parallax offset based on scroll position
      const scrollY = window.scrollY;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Gentle sinusoidal twinkle
        const twinkle = 0.65 + 0.35 * Math.sin(elapsed * star.twinkleSpeed + star.twinklePhase);
        const currentAlpha = Math.min(1, Math.max(0, star.baseAlpha * twinkle));

        // Coordinate calculation with subtle parallax wrapping
        const px = (star.x / 100) * width;
        const rawY = (star.y / 100) * height - (scrollY * star.depth * 0.2);
        // Wrap vertically so space feels continuous
        const py = ((rawY % height) + height) % height;

        // Draw soft outer glow for brighter stars
        if (star.hasGlow && currentAlpha > 0.3) {
          const glowGrad = ctx.createRadialGradient(px, py, 0, px, py, star.glowRadius);
          glowGrad.addColorStop(0, `rgba(${star.color}, ${currentAlpha * 0.45})`);
          glowGrad.addColorStop(0.5, `rgba(${star.color}, ${currentAlpha * 0.15})`);
          glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(px, py, star.glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw crisp star core
        ctx.fillStyle = `rgba(${star.color}, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(px, py, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
      style={{
        opacity: isVisible ? opacity : 0,
        transition: 'opacity 0.25s ease-out',
        willChange: 'opacity',
      }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default StarBackground;
