import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

interface LiveProjectButtonProps {
  className?: string;
  onClick?: () => void;
  href?: string;
  label?: string;
  variant?: 'outline' | 'github';
}

export const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({
  className = '',
  onClick,
  href = '#',
  label = 'Live Project',
  variant = 'outline',
}) => {
  const isGithub = variant === 'github';

  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full border-2 ${
        isGithub
          ? 'border-white/20 text-[#D7E2EA] bg-white/[0.04] backdrop-blur-md hover:bg-white/10 hover:border-white/40 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)]'
          : 'border-white/30 text-[#D7E2EA] bg-white/[0.05] backdrop-blur-md hover:bg-white/15 hover:border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_0_rgba(255,255,255,0.15)]'
      } font-medium uppercase tracking-widest px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm transition-all duration-200 cursor-pointer select-none hover:scale-105 active:scale-95 no-underline ${className}`}
    >
      <span>{label}</span>
      {isGithub ? (
        <Github className="w-4 h-4 opacity-80" />
      ) : (
        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
      )}
    </a>
  );
};

export default LiveProjectButton;
