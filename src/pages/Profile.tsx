import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, CheckCircle, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CrowdBadge from '../components/CrowdBadge';
import { useAppStore } from '../store/appStore';

export default function Profile() {
  const navigate = useNavigate();
  const { isAuthenticated, user, checkIns } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="pt-16">
        <section className="py-12 border-b border-slate-800 bg-slate-900/30">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <User className="w-4 h-4 text-teal-400" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-white">My Profile</h1>
            </div>
            <p className="text-slate-400 text-sm">Manage your account and view your activity.</p>
          </div>
        </section>

        <section className="py-10 pb-20">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-8">

            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-8"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-teal-400" />
                </div>
                <div className="flex-1">
                  <h2 className="font-heading text-xl font-bold text-white">{user.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-sm text-slate-400">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-sm text-slate-400">
                      Joined {format(new Date(user.createdAt), 'MMMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-700/40">
                <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                  <p className="text-2xl font-bold text-white font-heading">{checkIns.length}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Total Check-ins</p>
                </div>
                <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                  <p className="text-2xl font-bold text-white font-heading">
                    {new Set(checkIns.map(c => c.locationId)).size}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Locations Visited</p>
                </div>
              </div>
            </motion.div>

            {/* Check-in History */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700/40">
                <h2 className="font-heading text-lg font-semibold text-white">Check-in History</h2>
              </div>

              {checkIns.length === 0 ? (
                <div className="p-10 text-center">
                  <CheckCircle className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">No check-ins yet. Visit a location to get started.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700/30">
                  {checkIns.map((ci, i) => (
                    <motion.div
                      key={ci.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 px-6 py-4"
                    >
                      <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-teal-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{ci.locationName}</p>
                        <p className="text-xs text-slate-500">
                          {format(new Date(ci.timestamp), 'MMM d, yyyy · h:mm a')}
                        </p>
                      </div>
                      <CrowdBadge level={ci.crowdLevelAtTime} size="sm" />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}