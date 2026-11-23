import React, { useEffect, useRef } from 'react';

interface CosmicParticle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  drift: number;
  phase: number;
  color: string;
  glow: boolean;
}

const PURPLE_COLORS = [
  '174, 91, 255',
  '207, 72, 255',
  '244, 73, 220',
  '132, 72, 235',
  '229, 128, 255',
];

const PurpleCosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !context) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let particles: CosmicParticle[] = [];
    let frame = 0;
    let startTime = performance.now();

    const createParticles = () => {
      const count = Math.max(150, Math.min(250, Math.floor((width * height) / 6500)));
      particles = Array.from({ length: count }, () => {
        const radius = 0.5 + Math.random() * 1.45;
        return {
          x: Math.random(),
          y: Math.random(),
          radius,
          alpha: 0.14 + Math.random() * 0.34,
          speed: 0.002 + Math.random() * 0.009,
          drift: 0.002 + Math.random() * 0.007,
          phase: Math.random() * Math.PI * 2,
          color: PURPLE_COLORS[Math.floor(Math.random() * PURPLE_COLORS.length)],
          glow: radius > 1.2 && Math.random() > 0.3,
        };
      });
    };

    const resize = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createParticles();
      if (reduceMotion) draw(startTime);
    };

    const draw = (now: number) => {
      const elapsed = reduceMotion ? 0 : (now - startTime) / 1000;
      context.clearRect(0, 0, width, height);

      const drawNebula = (x: number, y: number, radius: number, color: string, alpha: number) => {
        const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${color}, ${alpha})`);
        gradient.addColorStop(0.38, `rgba(${color}, ${alpha * 0.42})`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);
        context.fillStyle = gradient;
        context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      };

      const driftX = reduceMotion ? 0 : Math.sin(elapsed * 0.07) * width * 0.035;
      const driftY = reduceMotion ? 0 : Math.cos(elapsed * 0.055) * height * 0.025;
      drawNebula(width * 0.5 + driftX, height * 0.37 + driftY, Math.max(width, height) * 0.56, '108, 27, 159', 0.075);
      drawNebula(width * 0.72 - driftX * 0.7, height * 0.72, Math.max(width, height) * 0.43, '160, 35, 205', 0.05);
      drawNebula(width * 0.22, height * 0.78 - driftY, Math.max(width, height) * 0.38, '80, 48, 190', 0.038);

      for (const particle of particles) {
        const yProgress = (particle.y + elapsed * particle.speed) % 1;
        const xDrift = Math.sin(elapsed * 0.18 + particle.phase) * particle.drift;
        const x = ((particle.x + xDrift + 1) % 1) * width;
        const y = yProgress * height;
        const twinkle = reduceMotion
          ? 0.78
          : 0.62 + 0.38 * Math.sin(elapsed * (0.7 + particle.speed * 24) + particle.phase);
        const alpha = particle.alpha * twinkle;

        if (particle.glow) {
          const glowRadius = particle.radius * 6.5;
          const gradient = context.createRadialGradient(x, y, 0, x, y, glowRadius);
          gradient.addColorStop(0, `rgba(${particle.color}, ${alpha * 0.38})`);
          gradient.addColorStop(0.35, `rgba(${particle.color}, ${alpha * 0.13})`);
          gradient.addColorStop(1, `rgba(${particle.color}, 0)`);
          context.fillStyle = gradient;
          context.beginPath();
          context.arc(x, y, glowRadius, 0, Math.PI * 2);
          context.fill();
        }

        context.fillStyle = `rgba(${particle.color}, ${alpha})`;
        context.beginPath();
        context.arc(x, y, particle.radius, 0, Math.PI * 2);
        context.fill();

        if (particle.radius > 1.55 && twinkle > 0.91) {
          const flareSize = particle.radius * 3.2;
          context.strokeStyle = `rgba(${particle.color}, ${alpha * 0.58})`;
          context.lineWidth = 0.55;
          context.beginPath();
          context.moveTo(x - flareSize, y);
          context.lineTo(x + flareSize, y);
          context.moveTo(x, y - flareSize);
          context.lineTo(x, y + flareSize);
          context.stroke();
        }
      }

      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    resize();
    if (!reduceMotion) frame = requestAnimationFrame(draw);
    window.addEventListener('resize', resize, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 h-full w-full pointer-events-none select-none"
      style={{ opacity: 0.5 }}
    />
  );
};

export default PurpleCosmicBackground;
