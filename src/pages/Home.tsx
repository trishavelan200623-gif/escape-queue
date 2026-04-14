import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, Users, Brain, Bell, ArrowRight, CheckCircle,
  MapPin, TrendingUp, Shield, Zap
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAppStore } from '../store/appStore';

const features = [
  {
    icon: Users,
    title: 'Real-Time Crowd Tracking',
    description: 'Monitor live crowd levels at hospitals, banks, malls, and more. Get instant updates as people check in.',
    color: 'teal',
  },
  {
    icon: Brain,
    title: 'AI-Powered Predictions',
    description: 'Our ML model analyzes historical and real-time data to predict future crowd levels and waiting times.',
    color: 'amber',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Receive instant alerts when crowd levels change. Get notified of the best time to visit any location.',
    color: 'blue',
  },
  {
    icon: MapPin,
    title: 'Location Intelligence',
    description: 'Search and discover locations across the city. View detailed crowd analytics for each venue.',
    color: 'purple',
  },
];

const steps = [
  { step: '01', title: 'Register & Login', desc: 'Create your account securely and access the full platform.' },
  { step: '02', title: 'Search Locations', desc: 'Find hospitals, banks, malls and check their current crowd status.' },
  { step: '03', title: 'Check In', desc: 'Check in at locations to contribute real-time crowd data.' },
  { step: '04', title: 'Plan Smartly', desc: 'Use AI predictions to choose the best time for your visit.' },
];

const colorMap: Record<string, string> = {
  teal: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

export default function Home() {
  const { isAuthenticated } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/10 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-sm font-medium mb-8">
              <Activity className="w-4 h-4" />
              Real-Time Crowd Intelligence Platform
            </div>

            <h1 className="font-heading text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Escape Queues
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                Save Your Time.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Escape Queues AI and real-time check-in data to help you avoid long waits, plan smarter visits, and stay informed about crowd levels at any location.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-teal-500/25"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-teal-500/25"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-20 pt-12 border-t border-slate-800"
          >
            {[
              { value: '6+', label: 'Locations' },
              { value: '95%', label: 'Accuracy' },
              { value: 'Live', label: 'Updates' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white font-heading">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Four powerful modules working together to give you complete crowd intelligence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-8 bg-slate-800/40 border border-slate-700/40 rounded-2xl hover:border-slate-600/60 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${colorMap[feature.color]}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Four simple steps to smarter crowd-aware planning.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-teal-400 font-bold font-heading text-sm">{step.step}</span>
                </div>
                <h3 className="font-heading text-base font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Secure & Private', desc: 'Your data is encrypted and never shared with third parties.' },
              { icon: Zap, title: 'Real-Time Updates', desc: 'Crowd data refreshes every minute for maximum accuracy.' },
              { icon: TrendingUp, title: 'Predictive Analytics', desc: 'ML models trained on historical patterns for reliable forecasts.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                Start Monitoring Crowds Today
              </h2>
              <p className="text-slate-400 mb-8">
                Join CrowdSense and never wait in a long queue again.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-teal-500/25"
              >
                <CheckCircle className="w-5 h-5" />
                Create Free Account
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
