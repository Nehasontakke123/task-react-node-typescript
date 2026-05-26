import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import StudentForm from '../components/StudentForm';
import { api } from '../services/api';
import { encryptPayload } from '../utils/crypto';
import type { StudentFormValues } from '../types';

const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: StudentFormValues) => {
    try {
      setIsSubmitting(true);
      const { confirmPassword: _confirmPassword, ...payload } = values;
      await api.post('/register', { payload: encryptPayload(payload) });
      toast.success('Student registered. Please sign in.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to register student');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(120deg,#eafdf8,#f8fafc_48%,#eef4ff)] px-4 py-8 dark:bg-[linear-gradient(120deg,#07111f,#0b2630_50%,#182033)]">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full rounded-2xl border border-white/45 bg-white/78 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/78 sm:p-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-xl font-black">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-600 text-white">
                <ShieldCheck className="h-6 w-6" />
              </span>
              StudentFlow
            </Link>
            <Link to="/login" className="btn-secondary">
              Back to login
            </Link>
          </div>
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">Encrypted registration</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Create student account</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              The browser encrypts this form before the API receives it. The server validates it, hashes the password, and stores the record with a second AES layer.
            </p>
          </div>
          <StudentForm
            isSubmitting={isSubmitting}
            showConfirmPassword
            showPasswordStrength
            onCancel={() => navigate('/login')}
            onSubmit={handleSubmit}
          />
        </motion.section>
      </div>
    </main>
  );
};

export default Register;
