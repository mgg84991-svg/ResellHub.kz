import React from 'react';

interface ResellHubLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showBadge?: boolean;
  className?: string;
}

export const ResellHubLogo: React.FC<ResellHubLogoProps> = ({
  size = 'md',
  showText = true,
  showBadge = true,
  className = '',
}) => {
  const iconSizes = {
    xs: 'w-7 h-7',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    xs: 'text-base',
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon Mark */}
      <div 
        className={`${iconSizes[size]} relative shrink-0 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-sky-600 p-[2px] shadow-lg shadow-emerald-600/20 hover:scale-105 transition-transform duration-200`}
      >
        <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center overflow-hidden relative">
          {/* Subtle glow circle */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/25 via-teal-500/15 to-transparent pointer-events-none" />

          {/* SVG ResellHub Emblem */}
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full p-1.5"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Circular Resell Loop Arcs */}
            <path 
              d="M 50 14 A 36 36 0 0 1 86 50" 
              stroke="#38bdf8" 
              strokeWidth="5" 
              strokeLinecap="round" 
            />
            <path 
              d="M 50 86 A 36 36 0 0 1 14 50" 
              stroke="#34d399" 
              strokeWidth="5" 
              strokeLinecap="round" 
            />
            {/* Arrowheads */}
            <polygon points="86,50 90,43 83,45" fill="#38bdf8" />
            <polygon points="14,50 10,57 17,55" fill="#34d399" />

            {/* Modern Geometric 'R' */}
            {/* Vertical stem */}
            <rect x="32" y="27" width="10" height="46" rx="3.5" fill="#ffffff" />
            {/* Top loop */}
            <path 
              d="M 38 27 L 57 27 C 67 27, 73 33, 73 42 C 73 51, 67 57, 57 57 L 38 57 Z" 
              fill="#ffffff" 
            />
            {/* Loop cutout */}
            <path 
              d="M 42 36 L 55 36 C 60 36, 63 38, 63 42 C 63 46, 60 48, 55 48 L 42 48 Z" 
              fill="#090d16" 
            />
            {/* Diagonal kick leg */}
            <path 
              d="M 52 52 L 69 72 C 71 74, 73 74, 75 73 C 77 71, 76 69, 74 67 L 59 50 Z" 
              fill="#ffffff" 
            />

            {/* Kazakh Gold Accent Dot */}
            <circle cx="73" cy="27" r="3.5" fill="#fbbf24" />
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="leading-tight flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className={`${textSizes[size]} font-black tracking-tight text-slate-900 dark:text-white`}>
              Resell<span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 bg-clip-text text-transparent">Hub</span>
            </span>
            {showBadge && (
              <span className="text-[10px] sm:text-[11px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-400/90 text-slate-950 shadow-xs uppercase tracking-wider">
                .KZ
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:block tracking-wide">
            Маркетплейс ненужных вещей ₸
          </span>
        </div>
      )}
    </div>
  );
};
