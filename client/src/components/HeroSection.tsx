import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import DashboardPreview from './DashboardPreview';

const HeroSection = () => {
  return (
    <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pt-20">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/60 px-3 py-1 text-sm font-semibold text-cyan-800 backdrop-blur dark:border-cyan-400/20 dark:bg-white/10 dark:text-cyan-200">
          <Sparkles className="h-4 w-4" />
          Secure student operations
        </p>
        <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
          Student Management System
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">
          A production-ready React and Node.js platform for encrypted student registration, protected dashboards, analytics, and CRUD administration.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/login" className="btn-primary px-6 py-3">Launch app</Link>
          <a href="#features" className="btn-secondary px-6 py-3">Explore features</a>
        </div>
      </motion.div>

      <DashboardPreview />
    </div>
  );
};

export default HeroSection;
