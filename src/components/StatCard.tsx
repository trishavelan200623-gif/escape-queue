import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  color?: 'teal' | 'amber' | 'red' | 'blue';
  index?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title, value, subtitle, icon: Icon, trend, color = 'teal', index = 0
}) => {
  const colorMap = {
    teal: { bg: 'bg-teal-500/10', icon: 'text-teal-400', border: 'border-teal-500/20' },
    amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400', border: 'border-amber-500/20' },
    red: { bg: 'bg-red-500/10', icon: 'text-red-400', border: 'border-red-500/20' },
    blue: { bg: 'bg-blue-500/10', icon: 'text-blue-400', border: 'border-blue-500/20' },
  };

  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`bg-slate-800/50 border ${c.border} rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trend.positive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
          }`}>
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white font-heading">{value}</p>
      <p className="text-sm font-medium text-slate-300 mt-0.5">{title}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </motion.div>
  );
};

export default StatCard;