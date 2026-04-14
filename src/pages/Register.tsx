import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Activity, Eye, EyeOff, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppStore } from '../store/appStore';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser } = useAppStore();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const success = await registerUser(data.name, data.email, data.password);
    if (success) {
      toast.success('Account created! Welcome to CrowdSense.');
      navigate('/dashboard');
    } else {
      toast.error('Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-16">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold text-white">CrowdSense</span>
          </Link>
          <h1 className="font-heading text-2xl font-bold text-white">Create your account</h1>
          <p className="text-slate-400 text-sm mt-1">Start monitoring crowds for free</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                {...register('name')}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200"
                placeholder="Jane Smith"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password')}
                  className="w-full px-4 py-3 pr-11 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200"
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1.5">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('confirmPassword')}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200"
                placeholder="Repeat password"
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02]"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium transition-colors duration-200">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}