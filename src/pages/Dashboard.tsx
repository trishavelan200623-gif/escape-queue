import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, MapPin, Clock, TrendingUp, AlertTriangle,
  CheckCircle, ArrowRight, RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StatCard from '../components/StatCard';
import CrowdBadge from '../components/CrowdBadge';
import { useAppStore } from '../store/appStore';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user, locations, checkIns, notifications, refreshLocations } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const highCrowdLocations = locations.filter(l => l.crowdLevel === 'high').length;
  const totalCheckIns = checkIns.length;
  const avgWait = Math.round(locations.reduce((a, l) => a + l.waitingTime, 0) / locations.length);
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const handleRefresh = () => {
    refreshLocations();
    toast.info('Crowd data refreshed.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="pt-16">
        {/* Page Header */}
        <section className="py-10 border-b border-slate-800 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading text-2xl font-bold text-white">
                  Welcome back, {user?.name?.split(' ')[0]}
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Here's the current crowd overview across all locations.
                </p>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard
                title="Total Locations"
                value={locations.length}
                subtitle="Monitored venues"
                icon={MapPin}
                color="teal"
                index={0}
              />
              <StatCard
                title="High Crowd Alerts"
                value={highCrowdLocations}
                subtitle="Locations above 70%"
                icon={AlertTriangle}
                color="red"
                trend={{ value: 12, positive: false }}
                index={1}
              />
              <StatCard
                title="Avg. Wait Time"
                value={`${avgWait}m`}
                subtitle="Across all locations"
                icon={Clock}
                color="amber"
                index={2}
              />
              <StatCard
                title="My Check-ins"
                value={totalCheckIns}
                subtitle="Total contributions"
                icon={CheckCircle}
                color="blue"
                index={3}
              />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-4 pb-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Location Overview */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-heading text-lg font-semibold text-white">Live Location Status</h2>
                  <Link
                    to="/locations"
                    className="flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300 transition-colors duration-200"
                  >
                    View all <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {locations.map((loc, i) => {
                    const occupancy = Math.round((loc.currentCount / loc.capacity) * 100);
                    return (
                      <motion.div
                        key={loc.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.06 }}
                      >
                        <Link
                          to={`/locations/${loc.id}`}
                          className="flex items-center gap-4 p-4 bg-slate-800/40 border border-slate-700/40 rounded-xl hover:border-teal-500/30 hover:bg-slate-800/60 transition-all duration-200 group"
                        >
                          <img
                            src={loc.image}
                            alt={loc.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-white truncate group-hover:text-teal-400 transition-colors duration-200">
                                {loc.name}
                              </p>
                              <CrowdBadge level={loc.crowdLevel} size="sm" />
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    loc.crowdLevel === 'low' ? 'bg-emerald-500' :
                                    loc.crowdLevel === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${occupancy}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-400 flex-shrink-0">{occupancy}%</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-white">{loc.waitingTime}m</p>
                            <p className="text-[10px] text-slate-500">wait</p>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Right Panel */}
              <div className="space-y-6">
                {/* Recent Check-ins */}
                <div>
                  <h2 className="font-heading text-lg font-semibold text-white mb-4">My Recent Check-ins</h2>
                  {checkIns.length === 0 ? (
                    <div className="p-6 bg-slate-800/30 border border-slate-700/30 rounded-xl text-center">
                      <CheckCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">No check-ins yet.</p>
                      <Link to="/locations" className="text-xs text-teal-400 hover:text-teal-300 mt-1 inline-block">
                        Browse locations →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {checkIns.slice(0, 4).map((ci, i) => (
                        <motion.div
                          key={ci.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.06 }}
                          className="flex items-center gap-3 p-3 bg-slate-800/40 border border-slate-700/30 rounded-xl"
                        >
                          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-teal-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">{ci.locationName}</p>
                            <p className="text-[10px] text-slate-500">
                              {formatDistanceToNow(new Date(ci.timestamp), { addSuffix: true })}
                            </p>
                          </div>
                          <CrowdBadge level={ci.crowdLevelAtTime} size="sm" />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Notifications */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-lg font-semibold text-white">Alerts</h2>
                    {unreadNotifs > 0 && (
                      <span className="px-2 py-0.5 bg-red-500/15 text-red-400 text-xs font-semibold rounded-full border border-red-500/20">
                        {unreadNotifs} new
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {notifications.slice(0, 3).map((notif, i) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.06 }}
                        className={`p-3 rounded-xl border text-xs ${
                          notif.read
                            ? 'bg-slate-800/20 border-slate-700/20 opacity-60'
                            : notif.type === 'alert' ? 'bg-red-500/10 border-red-500/20'
                            : notif.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20'
                            : 'bg-teal-500/10 border-teal-500/20'
                        }`}
                      >
                        <p className="font-semibold text-white mb-0.5">{notif.title}</p>
                        <p className="text-slate-400 leading-relaxed">{notif.message}</p>
                      </motion.div>
                    ))}
                    <Link
                      to="/notifications"
                      className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors duration-200 pt-1"
                    >
                      View all notifications <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h2 className="font-heading text-lg font-semibold text-white mb-4">Quick Actions</h2>
                  <div className="space-y-2">
                    {[
                      { label: 'Browse Locations', href: '/locations', icon: MapPin },
                      { label: 'View Predictions', href: '/predictions', icon: TrendingUp },
                      { label: 'All Notifications', href: '/notifications', icon: AlertTriangle },
                    ].map(action => (
                      <Link
                        key={action.href}
                        to={action.href}
                        className="flex items-center gap-3 p-3 bg-slate-800/40 border border-slate-700/30 rounded-xl hover:border-teal-500/30 hover:bg-slate-800/60 transition-all duration-200 group"
                      >
                        <action.icon className="w-4 h-4 text-slate-400 group-hover:text-teal-400 transition-colors duration-200" />
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors duration-200">
                          {action.label}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-teal-400 ml-auto transition-colors duration-200" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}