import React from 'react';

interface CrowdBadgeProps {
  level: 'low' | 'medium' | 'high';
  size?: 'sm' | 'md';
}

const CrowdBadge: React.FC<CrowdBadgeProps> = ({ level, size = 'md' }) => {
  const config = {
    low: { label: 'Low', classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    medium: { label: 'Medium', classes: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    high: { label: 'High', classes: 'bg-red-500/15 text-red-400 border-red-500/30' },
  };

  const { label, classes } = config[level];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${classes} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        level === 'low' ? 'bg-emerald-400' : level === 'medium' ? 'bg-amber-400' : 'bg-red-400'
      } animate-pulse`} />
      {label}
    </span>
  );
};

export default CrowdBadge;