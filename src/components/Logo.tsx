import React from 'react';

type LogoWrapperProps = {
  size?: 24 | 32 | 48;
  children: React.ReactNode;
  label?: string;
};

export const LogoWrapper: React.FC<LogoWrapperProps> = ({ size = 48, children, label }) => {
  const className = size === 24 ? 'w-6 h-6' : size === 32 ? 'w-8 h-8' : 'w-12 h-12';
  return (
    <div className="flex flex-col items-center gap-2 text-center" aria-label={label} title={label}>
      <div className={`inline-flex items-center justify-center ${className}`} style={{ color: 'currentColor' }}>
        {children}
      </div>
      {label ? <span className="text-xs opacity-90 leading-tight">{label}</span> : null}
    </div>
  );
};

export default LogoWrapper; 