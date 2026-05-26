import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, CheckCircle2, LockKeyhole, Menu, Moon, ShieldCheck, Sun, X } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { useTheme } from '../hooks/useTheme';

const features = [
  { icon: LockKeyhole, title: 'Two-level AES', text: 'Sensitive fields are encrypted before transit and again before storage.' },
  { icon: BarChart3, title: 'Live operations', text: 'Search, filter, edit, and monitor student records from one dashboard.' },
  { icon: CheckCircle2, title: 'Validated workflow', text: 'Client and server validation keep records consistent and complete.' },
];

const Landing = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7fafc] text-slate-950 dark:bg-[#07111f] dark:text-white">
      <section className="relative min-h-[92vh] bg-[linear-gradient(120deg,#eafdf8,#f8fafc_44%,#eef4ff_78%,#fff7ed)] dark:bg-[linear-gradient(120deg,#07111f,#0b2630_45%,#182033_80%,#1f1625)]">
        <div className="absolute inset-0 opacity-60">
          <div className="h-full w-full animate-slow-pulse bg-[radial-gradient(circle_at_15%_18%,rgba(14,165,233,.32),transparent_25%),radial-gradient(circle_at_84%_20%,rgba(16,185,129,.22),transparent_24%),radial-gradient(circle_at_50%_85%,rgba(249,115,22,.18),transparent_30%)]" />
        </div>
        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-xl font-black">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-600 text-white">
              <ShieldCheck className="h-6 w-6" />
            </span>
            StudentFlow
          </Link>
          <div className="hidden items-center gap-6 text-sm font-semibold text-slate-700 dark:text-slate-200 md:flex">
            <a href="#features">Features</a>
            <a href="#preview">Preview</a>
            <a href="#footer">Deploy</a>
            <button onClick={toggleTheme} className="rounded-lg border border-slate-200 bg-white/70 p-2 dark:border-white/10 dark:bg-white/10" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link to="/login" className="btn-primary">Open dashboard</Link>
          </div>
          <button className="rounded-lg border border-slate-200 bg-white/70 p-2 dark:border-white/10 dark:bg-white/10 md:hidden" onClick={() => setIsOpen((value) => !value)} aria-label="Toggle menu">
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
        {isOpen && (
          <div className="relative z-20 mx-4 rounded-xl border border-white/40 bg-white/90 p-4 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-900/90 md:hidden">
            <div className="grid gap-3 text-sm font-semibold">
              <a href="#features" onClick={() => setIsOpen(false)}>Features</a>
              <a href="#preview" onClick={() => setIsOpen(false)}>Preview</a>
              <button onClick={toggleTheme} className="btn-secondary justify-start">{theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} Theme</button>
              <Link to="/login" className="btn-primary">Open dashboard</Link>
            </div>
          </div>
        )}

        <HeroSection />
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass-card rounded-xl p-6">
              <Icon className="h-8 w-8 text-cyan-600 dark:text-cyan-300" />
              <h3 className="mt-5 text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer id="footer" className="border-t border-slate-200 px-4 py-8 text-center text-sm text-slate-600 dark:border-white/10 dark:text-slate-400">
        <p>StudentFlow is ready for MongoDB Atlas, Vercel, Render, and modern cloud deployment.</p>
      </footer>
    </main>
  );
};

export default Landing;
