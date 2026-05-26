import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,#8dd7d7,transparent_28%),linear-gradient(135deg,#f8fafc,#e9f8f6_50%,#f6f1ff)] px-4 py-8 dark:bg-[radial-gradient(circle_at_top_left,#0e7490,transparent_26%),linear-gradient(135deg,#07111f,#0f172a_55%,#161b33)]">
      <motion.button
        type="button"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/')}
        className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-xl border border-white/50 bg-white/65 px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg shadow-cyan-900/5 backdrop-blur-xl transition hover:border-cyan-200 hover:bg-white/85 hover:text-cyan-700 hover:shadow-cyan-500/15 dark:border-white/10 dark:bg-slate-950/45 dark:text-slate-200 dark:hover:border-cyan-300/30 dark:hover:bg-slate-900/80 dark:hover:text-cyan-200 sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </motion.button>
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid w-full overflow-hidden rounded-2xl border border-white/45 bg-white/70 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70 lg:grid-cols-[1fr_0.9fr]"
        >
          <div className="hidden min-h-[560px] bg-slate-950 p-10 text-white lg:block">
            <Link to="/" className="inline-flex items-center gap-2 text-lg font-bold">
              <ShieldCheck className="h-6 w-6 text-cyan-300" />
              StudentFlow
            </Link>
            <div className="mt-24 max-w-md">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">Secure access</p>
              <h1 className="mt-4 text-5xl font-bold leading-tight">Student data, protected from the first keystroke.</h1>
              <p className="mt-5 text-slate-300">
                AES encryption starts in the browser, continues on the server, and keeps operational workflows fast.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 dark:text-cyan-300 lg:hidden">
              <ShieldCheck className="h-5 w-5" />
              StudentFlow
            </Link>
            <div className="mx-auto max-w-md">
              <h2 className="text-3xl font-bold text-slate-950 dark:text-white">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Use a registered student email and password to open the protected dashboard.
              </p>
              <div className="mt-8">
                <LoginForm />
              </div>
              <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                Need a student account?{' '}
                <Link to="/register" className="font-bold text-cyan-700 dark:text-cyan-300">
                  Register securely
                </Link>
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default Login;
