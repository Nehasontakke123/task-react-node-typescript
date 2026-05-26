import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, BookOpenCheck, Loader2, ShieldCheck, UserRoundPlus, Users } from 'lucide-react';
import { getLatestStudentsPreview } from '../services/api';
import type { LandingStats, LatestStudent } from '../types';

interface PreviewState {
  students: LatestStudent[];
  stats: LandingStats;
}

const emptyStats: LandingStats = {
  totalStudents: 0,
  activeCourses: 0,
  registeredToday: 0,
  encryptionLayers: 2,
};

const getProgress = (student: LatestStudent, index: number) => {
  const seed = `${student._id}${student.courseEnrolled}${student.createdAt}`.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 58 + ((seed + index * 9) % 37);
};

const AnimatedCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frameId = 0;
    const duration = 700;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      setDisplayValue(Math.round(value * progress));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return (
    <>
      {displayValue}
      {suffix}
    </>
  );
};

const DashboardPreview = () => {
  const [preview, setPreview] = useState<PreviewState>({ students: [], stats: emptyStats });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPreview = async (showLoader = false) => {
    try {
      if (showLoader) setIsLoading(true);
      const data = await getLatestStudentsPreview();
      setPreview(data);
      setError('');
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || 'Unable to load live preview');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPreview(true);
    const intervalId = window.setInterval(() => void loadPreview(), 15000);
    return () => window.clearInterval(intervalId);
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Total Students', value: preview.stats.totalStudents, icon: Users },
      { label: 'Active Courses', value: preview.stats.activeCourses, icon: BookOpenCheck },
      { label: 'Registered Today', value: preview.stats.registeredToday, icon: UserRoundPlus },
      { label: 'Secure Encryption', value: preview.stats.encryptionLayers, suffix: 'x', icon: ShieldCheck },
    ],
    [preview.stats],
  );

  return (
    <motion.div id="preview" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="glass-card rounded-2xl p-3">
      <div className="rounded-xl bg-slate-950 p-4 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-sm text-cyan-200">Dashboard preview</p>
            <h2 className="text-xl font-bold">Live student analytics</h2>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-500/20 text-cyan-200">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
          </div>
        </div>

        <div className="grid gap-3 py-4 sm:grid-cols-2 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-lg border border-white/10 bg-white/10 p-4">
                  <div className="h-7 w-14 animate-pulse rounded bg-white/15" />
                  <div className="mt-2 h-3 w-24 animate-pulse rounded bg-white/10" />
                </div>
              ))
            : stats.map(({ label, value, suffix, icon: Icon }) => (
                <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-white/10 bg-white/10 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-2xl font-black">
                        <AnimatedCounter value={value} suffix={suffix} />
                      </p>
                      <p className="text-xs text-slate-300">{label}</p>
                    </div>
                    <Icon className="h-4 w-4 text-cyan-200" />
                  </div>
                </motion.div>
              ))}
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10">
          {isLoading && (
            <div className="space-y-px">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between bg-white/[0.06] px-4 py-3">
                  <div className="h-4 w-44 animate-pulse rounded bg-white/10" />
                  <div className="h-2.5 w-20 animate-pulse rounded-full bg-white/10" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && error && (
            <div className="flex items-center gap-2 bg-rose-500/10 px-4 py-4 text-sm text-rose-100">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {!isLoading && !error && preview.students.length === 0 && (
            <div className="bg-white/[0.06] px-4 py-6 text-center text-sm text-slate-300">
              New registrations will appear here automatically.
            </div>
          )}

          {!isLoading &&
            !error &&
            preview.students.map((student, index) => {
              const progress = getProgress(student, index);

              return (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="grid gap-3 border-b border-white/10 bg-white/[0.06] px-4 py-3 last:border-b-0 sm:grid-cols-[1fr_112px] sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{student.fullName}</p>
                    <p className="truncate text-xs text-slate-300">{student.courseEnrolled}</p>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.7, delay: index * 0.08 }}
                      className="h-full rounded-full bg-cyan-400"
                    />
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPreview;
