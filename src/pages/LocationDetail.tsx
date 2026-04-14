import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, Users, CheckCircle, ArrowLeft,
  TrendingUp, Calendar, Star, Info
} from 'lucide-react';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CrowdBadge from '../components/CrowdBadge';
import PredictionChart from '../components/PredictionChart';
import { useAppStore } from '../store/appStore';
import { generateHourlyData, generatePredictions } from '../data/mockData';
import type { HourlyData, Prediction } from '../types';

export default function LocationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, locations, checkIn } = useAppStore();
  const [checking, setChecking] = useState(false);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const location = locations.find(l => l.id === id);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (id) {
      setHourlyData(generateHourlyData(id));
      setPredictions(generatePredictions(id));
    }
  }, [id]);

  if (!isAuthenticated) return null;

  if (!location) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-xl font-bold text-white mb-2">Location not found</h2>
          <Link to="/locations" className="text-teal-400 hover:text-teal-300 text-sm">
            ← Back to Locations
          </Link>
        </div>
      </div>
    );
  }

  const occupancy = Math.round((location.currentCount / location.capacity) * 100);
  const currentHour = new Date().getHours();
  const bestHours = predictions
    .filter(p => p.crowdLevel === 'low' && p.hour > currentHour)
    .slice(0, 3);

  const handleCheckIn = async () => {
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
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="pt-16">
        {/* Hero Image */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={location.image}
            alt={location.name}
            width={1200}
            height={400}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              <Link
                to="/locations"
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-4 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Locations
              </Link>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h1 className="font-heading text-3xl md:text-4xl font-bold text-white">{location.name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400 text-sm">{location.address}, {location.city}</span>
                  </div>
                </div>
                <CrowdBadge level={location.crowdLevel} />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Current Status */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6"
              >
                <h2 className="font-heading text-lg font-semibold text-white mb-5">Current Status</h2>
                <div className="grid grid-cols-3 gap-4 mb-5">
                  {[
                    { icon: Users, label: 'People Inside', value: location.currentCount, sub: `of ${location.capacity}` },
                    { icon: Clock, label: 'Wait Time', value: `${location.waitingTime}m`, sub: 'estimated' },
                    { icon: TrendingUp, label: 'Occupancy', value: `${occupancy}%`, sub: 'capacity' },
                  ].map(stat => (
                    <div key={stat.label} className="text-center p-4 bg-slate-900/50 rounded-xl">
                      <stat.icon className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-white font-heading">{stat.value}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
                      <p className="text-[10px] text-slate-600">{stat.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Occupancy Bar */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Occupancy Level</span>
                    <span>{location.currentCount} / {location.capacity}</span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${occupancy}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        location.crowdLevel === 'low' ? 'bg-emerald-500' :
                        location.crowdLevel === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Prediction Chart */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-5">
                  <TrendingUp className="w-5 h-5 text-teal-400" />
                  <h2 className="font-heading text-lg font-semibold text-white">Today's Crowd Forecast</h2>
                </div>
                <PredictionChart data={hourlyData} capacity={location.capacity} />
              </motion.div>

              {/* Best Times */}
              {bestHours.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-emerald-400" />
                    <h2 className="font-heading text-lg font-semibold text-white">Best Times to Visit</h2>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {bestHours.map(p => (
                      <div key={p.hour} className="text-center p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        <p className="text-base font-bold text-emerald-400 font-heading">{p.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">~{p.waitingTime}m wait</p>
                        <p className="text-[10px] text-emerald-500/70 mt-0.5">{p.confidence}% confidence</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Check In Card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6"
              >
                <h3 className="font-heading text-base font-semibold text-white mb-4">Check In Here</h3>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                  Checking in helps us collect real-time crowd data and improves predictions for everyone.
                </p>
                <button
                  onClick={handleCheckIn}
                  disabled={checking}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-teal-500 hover:bg-teal-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02]"
                >
                  {checking ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {checking ? 'Checking in…' : 'Check In'}
                </button>
              </motion.div>

              {/* Location Info */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 space-y-4"
              >
                <h3 className="font-heading text-base font-semibold text-white">Location Info</h3>
                {[
                  { icon: MapPin, label: 'Address', value: `${location.address}, ${location.city}` },
                  { icon: Clock, label: 'Hours', value: location.operatingHours },
                  { icon: Users, label: 'Capacity', value: `${location.capacity} people` },
                  { icon: Calendar, label: 'Type', value: location.type.charAt(0).toUpperCase() + location.type.slice(1) },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <item.icon className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm text-slate-300">{item.value}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* AI Note */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5"
              >
                <div className="flex items-start gap-3">
                  <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-blue-400 mb-1">AI Prediction Note</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Predictions are based on historical patterns and real-time check-in data. Accuracy improves with more user contributions.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}