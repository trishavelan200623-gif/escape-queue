import React, { Suspense, lazy } from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';

import Home from './src/pages/Home';
import Login from './src/pages/Login';
import Register from './src/pages/Register';
import NotFound from './src/pages/NotFound';

const Dashboard = lazy(() => import('./src/pages/Dashboard'));
const Locations = lazy(() => import('./src/pages/Locations'));
const LocationDetail = lazy(() => import('./src/pages/LocationDetail'));
const Predictions = lazy(() => import('./src/pages/Predictions'));
const Notifications = lazy(() => import('./src/pages/Notifications'));
const Profile = lazy(() => import('./src/pages/Profile'));

const Loader: React.FC = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
  </div>
);

const App: React.FC = () => {
  return (
    <Theme appearance="inherit" radius="large" scaling="100%">
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/locations/:id" element={<LocationDetail />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="dark"
          toastClassName="!bg-slate-800 !border !border-slate-700 !text-white"
        />
      </Router>
    </Theme>
  );
};

export default App;