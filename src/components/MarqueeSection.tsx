import React, { useRef, useState, useEffect } from 'react';

// Pure picture cards for tech row (no text, pure visual cards matching reference)
const row1Cards = [
  { name: 'Next.js 15', image: '/card_nextjs.png' },
  { name: 'React 19', image: '/card_react19.jpg' },
  { name: 'TypeScript', image: '/card_typescript.png' },
  { name: 'C++', image: '/card_cpp.png' },
];

const quadrupledRow1 = [
  ...row1Cards,
  ...row1Cards,
  ...row1Cards,
  ...row1Cards,
  ...row1Cards,
  ...row1Cards,
];

export const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
      const calculated = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(calculated);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const row1Transform = `translateX(${offset - 200}px)`;

  return (
    <section
      ref={sectionRef}
      className="bg-[#0C0C0C] pt-16 sm:pt-24 md:pt-32 pb-10 overflow-hidden select-none"
    >
      <div className="flex flex-col gap-6">
        {/* Row 1: Pure Picture Cards (No text, smooth hover zoom) - Moves Right */}
        <div
          className="flex gap-5 sm:gap-6 will-change-transform"
          style={{ transform: row1Transform, willChange: 'transform' }}
        >
          {quadrupledRow1.map((item, idx) => (
            <div
              key={`row1-${idx}`}
              className="w-[280px] sm:w-[340px] md:w-[380px] h-[160px] sm:h-[190px] md:h-[210px] shrink-0 rounded-[24px] sm:rounded-[32px] overflow-hidden border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] relative group cursor-pointer hover:border-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarqueeSection;
