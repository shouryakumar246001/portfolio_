import React from 'react';
import FadeIn from './FadeIn';

interface ServiceItem {
  id: string;
  name: string;
  description: string;
}

const servicesData: ServiceItem[] = [
  {
    id: '01',
    name: '3D Modeling',
    description:
      'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.',
  },
  {
    id: '02',
    name: 'Rendering',
    description:
      'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.',
  },
  {
    id: '03',
    name: 'Motion Design',
    description:
      'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.',
  },
  {
    id: '04',
    name: 'Branding',
    description:
      'Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.',
  },
  {
    id: '05',
    name: 'Web Design',
    description:
      'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.',
  },
];

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="price"
      className="bg-[#FFFFFF] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 w-full relative z-0 select-none"
    >
      <div className="max-w-5xl mx-auto">
        <FadeIn delay={0} y={40}>
          <h2
            className="text-[#0C0C0C] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28 leading-none"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Services
          </h2>
        </FadeIn>

        <div className="flex flex-col w-full">
          {servicesData.map((service, index) => (
            <FadeIn
              key={service.id}
              delay={index * 0.1}
              y={30}
              className={`flex flex-col md:flex-row items-start md:items-center justify-between py-8 sm:py-10 md:py-12 ${
                index !== servicesData.length - 1
                  ? 'border-b border-[rgba(12,12,12,0.15)]'
                  : ''
              }`}
            >
              <div className="flex-shrink-0 md:w-1/3 mb-4 md:mb-0">
                <span
                  className="font-black text-[#0C0C0C] leading-none select-none tracking-tight"
                  style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
                >
                  {service.id}
                </span>
              </div>
              <div className="flex flex-col md:w-2/3 md:pl-8">
                <h3
                  className="font-medium uppercase text-[#0C0C0C] tracking-wide mb-2 sm:mb-3"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                >
                  {service.name}
                </h3>
                <p
                  className="font-light leading-relaxed max-w-2xl text-[#0C0C0C] opacity-60"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                >
                  {service.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
