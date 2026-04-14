import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LocationCard from '../components/LocationCard';
import { useAppStore } from '../store/appStore';
import type { Location } from '../types';

const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'bank', label: 'Bank' },
  { value: 'mall', label: 'Mall' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'government', label: 'Government' },
  { value: 'transport', label: 'Transport' },
];

const crowdOptions = [
  { value: 'all', label: 'All Levels' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function Locations() {
  const navigate = useNavigate();
  const { isAuthenticated, locations } = useAppStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [crowdFilter, setCrowdFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const filtered = locations.filter((loc: Location) => {
    const matchSearch = loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.address.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || loc.type === typeFilter;
    const matchCrowd = crowdFilter === 'all' || loc.crowdLevel === crowdFilter;
    return matchSearch && matchType && matchCrowd;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="pt-16">
        {/* Page Header */}
        <section className="py-12 border-b border-slate-800 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-teal-400" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-white">Locations</h1>
            </div>
            <p className="text-slate-400 text-sm">
              Search and monitor crowd levels at {locations.length} locations across Metro City.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b border-slate-800 bg-slate-900/20 sticky top-16 z-30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search locations…"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200"
                />
              </div>

              {/* Type Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                  className="pl-9 pr-8 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 appearance-none cursor-pointer transition-all duration-200"
                >
                  {typeOptions.map(o => (
                    <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Crowd Filter */}
              <select
                value={crowdFilter}
                onChange={e => setCrowdFilter(e.target.value)}
                className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 appearance-none cursor-pointer transition-all duration-200"
              >
                {crowdOptions.map(o => (
                  <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-10 pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-400">
                Showing <span className="text-white font-medium">{filtered.length}</span> location{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>

            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <MapPin className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <h3 className="font-heading text-lg font-semibold text-slate-400 mb-2">No locations found</h3>
                <p className="text-slate-500 text-sm">Try adjusting your search or filters.</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((loc, i) => (
                  <LocationCard key={loc.id} location={loc} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}