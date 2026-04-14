import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NotificationItem from '../components/NotificationItem';
import { useAppStore } from '../store/appStore';
import { toast } from 'react-toastify';

export default function Notifications() {
  const navigate = useNavigate();
  const { isAuthenticated, notifications, unreadCount, markAllRead } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleMarkAllRead = () => {
    markAllRead();
    toast.success('All notifications marked as read.');
  };

  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="pt-16">
        {/* Page Header */}
        <section className="py-12 border-b border-slate-800 bg-slate-900/30">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h1 className="font-heading text-2xl font-bold text-white">Notifications</h1>
                  {unreadCount > 0 && (
                    <p className="text-slate-400 text-sm mt-0.5">{unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}</p>
                  )}
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-all duration-200"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all read
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="py-10 pb-20">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-8">

            {/* Unread */}
            {unread.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  New — {unread.length}
                </h2>
                <div className="space-y-3">
                  {unread.map((notif, i) => (
                    <NotificationItem key={notif.id} notification={notif} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Read */}
            {read.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  Earlier — {read.length}
                </h2>
                <div className="space-y-3">
                  {read.map((notif, i) => (
                    <NotificationItem key={notif.id} notification={notif} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {notifications.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Bell className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <h3 className="font-heading text-lg font-semibold text-slate-400 mb-2">No notifications yet</h3>
                <p className="text-slate-500 text-sm">You'll receive alerts when crowd levels change at your locations.</p>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}