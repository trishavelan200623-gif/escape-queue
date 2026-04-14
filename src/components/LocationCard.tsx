import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import CrowdBadge from './CrowdBadge';
import { useAppStore } from '../store/appStore';
import type { Location } from '../types';

interface LocationCardProps {
  location: Location;
  index?: number;
}

const typeLabels: Record<string, string> = {
  hospital: 'Hospital',
  bank: 'Bank',
  mall: 'Shopping Mall',
  restaurant: 'Restaurant',
  government: 'Government',
  transport: 'Transport',
};

const LocationCard: React.FC<LocationCardProps> = ({ location, index = 0 }) => {
  const [checking, setChecking] = useState(false);
  const { isAuthenticated, checkIn } = useAppStore();
  const occupancy = Math.round((location.currentCount / location.capacity) * 100);

  const handleCheckIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please sign in to check in.');
      return;
    }
    setChecking(true);
    const result = await checkIn(location.id);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.warning(result.message);
    }
    setChecking(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-teal-500/30 hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={location.image}
            alt={location.name}
            width={600}
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-slate-900/70 backdrop-blur-sm text-xs font-medium text-slate-300 rounded-full border border-slate-700/50">
              {typeLabels[location.type]}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <CrowdBadge level={location.crowdLevel} size="sm" />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="font-heading text-base font-semibold text-white group-hover:text-teal-400 transition-colors duration-200">
              {location.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-400">{location.address}, {location.city}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 bg-slate-900/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Users className="w-3 h-3 text-slate-400" />
              </div>
              <p className="text-sm font-bold text-white">{location.currentCount}</p>
              <p className="text-[10px] text-slate-500">People</p>
            </div>
            <div className="text-center p-2 bg-slate-900/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Clock className="w-3 h-3 text-slate-400" />
              </div>
              <p className="text-sm font-bold text-white">{location.waitingTime}m</p>
              <p className="text-[10px] text-slate-500">Wait</p>
            </div>
            <div className="text-center p-2 bg-slate-900/50 rounded-lg">
              <p className="text-sm font-bold text-white">{occupancy}%</p>
              <p className="text-[10px] text-slate-500">Full</p>
            </div>
          </div>

          {/* Occupancy Bar */}
          <div>
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>Occupancy</span>
              <span>{location.currentCount}/{location.capacity}</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  location.crowdLevel === 'low' ? 'bg-emerald-500' :
                  location.crowdLevel === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${occupancy}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleCheckIn}
              disabled={checking}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-400 text-xs font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {checking ? 'Checking in…' : 'Check In'}
            </button>
            <Link
              to={`/locations/${location.id}`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-all duration-200"
            >
              Details
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LocationCard;