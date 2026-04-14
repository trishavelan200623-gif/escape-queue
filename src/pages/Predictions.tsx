import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Clock, Star, ChevronDown } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PredictionChart from '../components/PredictionChart';
import CrowdBadge from '../components/CrowdBadge';
import { useAppStore } from '../store/appStore';
import { generateHourlyData, generatePredictions } from '../data/mockData';
import type { HourlyData, Prediction } from '../types';

export default function Predictions() {
  const navigate = useNavigate();
  const { isAuthenticated, locations } = useAppStore();
  const [selectedId, setSelectedId] = useState('loc_001');
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setHourlyData(generateHourlyData(selectedId));
    setPredictions(generatePredictions(selectedId));
  }, [selectedId]);

  if (!isAuthenticated) return null;

  const selectedLocation = locations.find(l => l.id === selectedId);
  const currentHour = new Date().getHours();
  const upcomingPredictions = predictions.filter(p => p.hour >= currentHour).slice(0, 8);
  const bestTimes = predictions.filter(p => p.crowdLevel === 'low' && p.hour > currentHour).slice(0, 3);
  const worstTimes = predictions.filter(p => p.crowdLevel === 'high').slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="pt-16">
        {/* Page Header */}
        <section className="py-12 border-b border-slate-800 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Brain className="w-4 h-4 text-amber-400" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-white">AI Predictions</h1>
            </div>
            <p className="text-slate-400 text-sm">
              Machine learning forecasts for crowd levels and waiting times throughout the day.
            </p>
          </div>
        </section>

        <section className="py-8 pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">

            {/* Location Selector */}
            <div className="flex items-center gap-4">
              <label htmlFor="location-select" className="text-sm font-medium text-slate-300 flex-shrink-0">
                Select Location:
              </label>
              <div className="relative">
                <select
                  id="location-select"
                  value={selectedId}
                  onChange={e => setSelectedId(e.target.value)}
                  className="pl-4 pr-10 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 appearance-none cursor-pointer transition-all duration-200 min-w-[220px]"
                >
                  {locations.map(l => (
                    <option key={l.id} value={l.id} className="bg-slate-800">{l.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Chart */}
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-400" />
                  <h2 className="font-heading text-lg font-semibold text-white">
                    {selectedLocation?.name} — Today's Forecast
                  </h2>
                </div>
                {selectedLocation && <CrowdBadge level={selectedLocation.crowdLevel} />}
              </div>
              <PredictionChart data={hourlyData} capacity={selectedLocation?.capacity || 200} />
            </motion.div>

            {/* Upcoming Predictions Table */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700/40">
                <h2 className="font-heading text-lg font-semibold text-white">Hourly Predictions</h2>
                <p className="text-sm text-slate-400 mt-0.5">Upcoming crowd forecast for the next 8 hours</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/40">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Crowd Level</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Est. Count</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Wait Time</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingPredictions.map((p, i) => (
                      <motion.tr
                        key={p.hour}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`border-b border-slate-700/20 hover:bg-slate-700/20 transition-colors duration-150 ${
                          p.hour === currentHour ? 'bg-teal-500/5' : ''
                        }`}
                      >
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{p.label}</span>
                            {p.hour === currentHour && (
                              <span className="px-1.5 py-0.5 bg-teal-500/20 text-teal-400 text-[10px] font-semibold rounded">NOW</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <CrowdBadge level={p.crowdLevel} size="sm" />
                        </td>
                        <td className="px-6 py-3.5 text-sm text-slate-300">{p.predictedCount}</td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-sm text-slate-300">{p.waitingTime}m</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-teal-500 rounded-full"
                                style={{ width: `${p.confidence}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-400">{p.confidence}%</span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Best & Worst Times */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Best Times */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-heading text-base font-semibold text-white">Best Times to Visit</h3>
                </div>
                {bestTimes.length === 0 ? (
                  <p className="text-sm text-slate-500">No low-crowd windows remaining today.</p>
                ) : (
                  <div className="space-y-3">
                    {bestTimes.map(p => (
                      <div key={p.hour} className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        <div>
                          <p className="text-sm font-semibold text-emerald-400">{p.label}</p>
                          <p className="text-xs text-slate-400">~{p.waitingTime}m wait</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">{p.predictedCount} people</p>
                          <p className="text-[10px] text-emerald-500/70">{p.confidence}% confidence</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Worst Times */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-red-400" />
                  <h3 className="font-heading text-base font-semibold text-white">Peak Crowd Hours</h3>
                </div>
                {worstTimes.length === 0 ? (
                  <p className="text-sm text-slate-500">No high-crowd periods predicted today.</p>
                ) : (
                  <div className="space-y-3">
                    {worstTimes.map(p => (
                      <div key={p.hour} className="flex items-center justify-between p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                        <div>
                          <p className="text-sm font-semibold text-red-400">{p.label}</p>
                          <p className="text-xs text-slate-400">~{p.waitingTime}m wait</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">{p.predictedCount} people</p>
                          <p className="text-[10px] text-red-500/70">{p.confidence}% confidence</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}