import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-6">
          <Activity className="w-8 h-8 text-teal-400" />
        </div>
        <h1 className="font-heading text-6xl font-bold text-white mb-3">404</h1>
        <h2 className="font-heading text-xl font-semibold text-slate-300 mb-2">Page Not Found</h2>
        <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}