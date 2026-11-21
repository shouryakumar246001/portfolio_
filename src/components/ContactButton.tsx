import React from 'react';

interface ContactButtonProps {
  className?: string;
  onClick?: () => void;
  label?: string;
  href?: string;
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  className = '',
  onClick,
  label = 'Contact Me',
  href,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick();
      return;
    }
    if (href) {
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.open(href, '_blank', 'noopener,noreferrer');
      }
      return;
    }
    const contact = document.getElementById('contact');
    if (contact) {
      e.preventDefault();
      contact.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`rounded-full text-white font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 inline-flex items-center justify-center ${className}`}
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
    >
      {label}
    </button>
  );
};

export default ContactButton;
